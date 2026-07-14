/**
 * Input: sharp, node:fs/promises, node:path, node:crypto
 * Output: 优化后的 public/images/**（≤2000px, mozjpeg q82, 去 EXIF, 自动纠正方向）
 * Pos: 构建工具-图片优化管线（image-originals 为源，public/images 为产物）
 *
 * 用法：
 *   npm run optimize:images
 *
 * 设计：
 *   - 源目录 image-originals/ 保存未压缩全分辨率原图（首跑自动从 public/images 迁移）。
 *   - 产物目录 public/images/ 为线上服务的优化版，同扩展名同文件名，零引用改动。
 *   - 用内容哈希 + 设置签名做 manifest，幂等：已优化的跳过，绝不二次压缩；
 *     后续往 image-originals/（或 public/images/）新增图片，再次运行只处理新增项。
 */

import { createHash } from 'node:crypto'
import { constants as FS } from 'node:fs'
import { access, copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, extname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SOURCE_DIR = join(ROOT, 'image-originals')
const OUTPUT_DIR = join(ROOT, 'public', 'images')
const MANIFEST_PATH = join(ROOT, 'scripts', '.image-manifest.json')

// —— 可调参数 ——（改动后 manifest 签名变化，会自动全量重生成）
const MAX_DIM = 2000 // 长边像素上限，不放大更小的图
const JPEG_QUALITY = 82
const PNG_COMPRESSION = 9
const SETTINGS_TAG = `v1-${MAX_DIM}-q${JPEG_QUALITY}` // 设置指纹

const RASTER_EXT = new Set(['.jpg', '.jpeg', '.png'])

async function exists(p) {
  try {
    await access(p, FS.F_OK)
    return true
  } catch {
    return false
  }
}

/** 递归列出目录下所有文件的绝对路径 */
async function walk(dir) {
  const out = []
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return out // 目录不存在
  }
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(full)))
    else if (entry.isFile()) out.push(full)
  }
  return out
}

const isRaster = p => RASTER_EXT.has(extname(p).toLowerCase())
const toPosix = p => p.split('\\').join('/')

function signatureOf(buf) {
  return `${createHash('sha1').update(buf).digest('hex')}:${SETTINGS_TAG}`
}

async function loadManifest() {
  try {
    return JSON.parse(await readFile(MANIFEST_PATH, 'utf8'))
  } catch {
    return {}
  }
}

async function optimizeBuffer(buf, ext) {
  // .rotate() 无参数：按 EXIF 方向自动纠正后再抹掉方向标记，
  // 这样去除元数据也不会让照片倒转/侧躺。
  const pipeline = sharp(buf)
    .rotate()
    .resize({ width: MAX_DIM, height: MAX_DIM, fit: 'inside', withoutEnlargement: true })

  if (ext === '.png') {
    return pipeline.png({ compressionLevel: PNG_COMPRESSION }).toBuffer()
  }
  // sharp 默认不保留 EXIF/其他元数据 → 满足「去掉全部」
  return pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true }).toBuffer()
}

async function main() {
  const started = Date.now()
  await mkdir(SOURCE_DIR, { recursive: true })
  await mkdir(OUTPUT_DIR, { recursive: true })

  let moved = 0
  // —— 1. 迁移：把 public/images 里尚未存档的原图复制到 image-originals ——
  //    （只在源缺失时复制，绝不覆盖已有的 pristine 原图；随后第 2 步会用优化版覆写 public 副本）
  for (const outFile of await walk(OUTPUT_DIR)) {
    if (!isRaster(outFile)) continue
    const rel = relative(OUTPUT_DIR, outFile)
    const srcFile = join(SOURCE_DIR, rel)
    if (!(await exists(srcFile))) {
      await mkdir(dirname(srcFile), { recursive: true })
      await copyFile(outFile, srcFile)
      moved++
    }
  }

  // —— 2. 生成：以 image-originals 为源，写优化版到 public/images ——
  const manifest = await loadManifest()
  const nextManifest = {}
  let optimized = 0
  let skipped = 0
  let srcBytes = 0
  let outBytes = 0

  for (const srcFile of await walk(SOURCE_DIR)) {
    if (!isRaster(srcFile)) continue
    const rel = relative(SOURCE_DIR, srcFile)
    const key = toPosix(rel)
    const outFile = join(OUTPUT_DIR, rel)
    const buf = await readFile(srcFile)
    const sig = signatureOf(buf)

    if (manifest[key] === sig && (await exists(outFile))) {
      nextManifest[key] = sig
      skipped++
      continue
    }

    const ext = extname(rel).toLowerCase()
    const optimizedBuf = await optimizeBuffer(buf, ext)
    await mkdir(dirname(outFile), { recursive: true })
    await writeFile(outFile, optimizedBuf)

    nextManifest[key] = sig
    optimized++
    srcBytes += buf.length
    outBytes += optimizedBuf.length
    console.log(
      `  ✓ ${key}  ${(buf.length / 1048576).toFixed(2)}MB → ${(optimizedBuf.length / 1048576).toFixed(2)}MB`,
    )
  }

  await writeFile(MANIFEST_PATH, `${JSON.stringify(nextManifest, null, 2)}\n`)

  const saved = srcBytes - outBytes
  const pct = srcBytes > 0 ? ((saved / srcBytes) * 100).toFixed(1) : '0.0'
  console.log('\n图片优化完成：')
  console.log(`  迁移原图到 image-originals/：${moved}`)
  console.log(`  重新生成优化版：${optimized}`)
  console.log(`  已是最新、跳过：${skipped}`)
  if (optimized > 0) {
    console.log(
      `  本次处理体积：${(srcBytes / 1048576).toFixed(1)}MB → ${(outBytes / 1048576).toFixed(1)}MB（省 ${(saved / 1048576).toFixed(1)}MB, ${pct}%）`,
    )
  }
  console.log(`  用时 ${((Date.now() - started) / 1000).toFixed(1)}s`)
}

main().catch(err => {
  console.error('图片优化失败：', err)
  process.exitCode = 1
})
