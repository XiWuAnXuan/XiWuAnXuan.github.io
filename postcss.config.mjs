/**
 * Input: tailwindcss, autoprefixer
 * Output: config (default)
 * Pos: 配置层-PostCSS 插件链
 *
 * 本注释在文件修改时自动更新
 */

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

export default config
