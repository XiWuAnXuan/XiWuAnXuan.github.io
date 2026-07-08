# Progress Log

## 2026-07-07

- [x] 复刻原站文章卡片 hover：双层虚线卡片，前景与内容向左上位移，底层向右下位移。
- [x] 修复首页残留乱码文案：最近文章、查看全部、订阅、归档等。
- [x] 复刻原站顶部导航滚动效果：初始 80px 高度，滚动后固定为 56px，并启用半透明毛玻璃背景。
- [x] 新增文章阅读信息：文章标题下方自动显示“约 N 分钟阅读 · N 字”，使用浅色小字。
- [x] 新增 lib/reading-stats.test.mjs，用 Node 测试覆盖字数统计和阅读时间向上取整。
- [x] 将等宽字体切换为开源 IoskeleyMono：接入常用 400/500/600/700 与 Italic WOFF2 文件。
- [x] 将文章详情页改为原站式标题区 + post-prose 正文排版，并修复阅读信息分隔符乱码。
- [x] 将顶部导航毛玻璃模糊调整为 backdrop-blur-[20px]。
- [x] 升级文章列表卡片：支持右侧可选封面图，并在列表元信息中显示预计阅读时间和字数。
- [x] 复刻原站顶部两侧渐隐虚线网格，并新增文章标题纸张卡片效果。
- [x] 调整顶部导航外壳底部圆角，复刻原站更圆润的 header 框弧度。
- [x] 新增博客列表分页：/posts 每页显示 5 篇文章，超过后生成 /posts/page/2、/posts/page/3 等分页页面。
- [x] 替换站点 favicon：使用 app/icon.svg，并将旧 public/favicon.ico 备份为 public/favicon-old.ico。
- [x] 将顶部左侧品牌标识和关于页头像统一替换为 app/icon.svg。
- [x] 将顶部品牌图标和关于页头像从圆形裁切改为方形完整显示，避免 SVG 被裁边。
- [x] 修正站点图标显示方式：保持顶部 32px、关于页 96px 尺寸不变，去掉圆形裁切并改为正方形铺满显示。
- [x] 回退站点图标显示方式：顶部和关于页图标恢复为方形完整显示 object-contain，不使用铺满裁切。
- [x] 初始化 Git 仓库并上传到 GitHub：整理 .gitignore，排除构建产物、临时快照、草稿和旧 commission/photography 素材，推送到私有仓库 Jiaxon/Blog_Project。
- [x] 补齐仓库可复现运行配置：更新 README、固定关键依赖版本、修正 webmanifest，并准备 npm 锁文件用于 clone 后直接安装构建。
- [x] 清理无用上传文件：删除旧字体、旧 favicon/logo、未引用图片和重复图片，并修正 6 张文章图片的大小写路径以适配 Linux 部署。
- [x] 添加 GitHub Pages 静态部署：修复 feed.xml 静态导出，新增 Actions 工作流，配置站点 URL 为 https://XiWuAnXuan.github.io。
