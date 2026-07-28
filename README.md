# Cheansnow · Hexo 博客框架

这是一个不包含文章内容的博客框架。界面使用 Redefine 主题，文章使用 Markdown。

## 本地预览

```bash
npm install
npm run server
```

浏览器访问 `http://localhost:4000`。

## 写一篇新文章

```bash
npx hexo new "文章标题"
```

然后编辑 `source/_posts/文章标题.md`。目前源码保存在 `hexo-source`
分支，不会覆盖现有首页。内容准备完成后再启用自动发布。

## 首次发布前

1. 在 GitHub 仓库的 Pages 设置中，将 Source 设为 GitHub Actions。
2. 如果以后使用自定义域名，在 `source/CNAME` 中填写域名。
3. 将头像、首页横幅等图片放进 `source/images/`，并在
   `_config.redefine.yml` 中保持路径一致。
