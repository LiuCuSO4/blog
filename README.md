# 硫酸铜的笔记本

规则说明 + 随笔，用 MkDocs Material 生成，发布在 GitHub Pages。

- 线上地址：https://liucuso4.github.io/blog/
- 线上写作页：https://liucuso4.github.io/blog/write/
- 内容目录：`docs/`
- 站点配置：`mkdocs.yml`

## 写东西

- 随笔：在 `docs/blog/posts/` 新建 `xxx.md`，开头写 front matter：

  ```markdown
  ---
  date: 2026-11-13
  categories:
    - 随笔
  ---
  ```

- 规则说明：改 `docs/规则说明/` 里的文件；加新章节后记得在 `mkdocs.yml` 的 `nav` 里登记。
- 直接在网页上写：打开 `/write/`，第一次填一次 GitHub token（只勾 blog 仓库的 Contents 读写），之后写完点「发布」就提交到 `main`。

## 自动发布（网页写完不用管）

`自动发布.ps1` 每 3 分钟跑一次（计划任务「大肥鱼博客自动发布」）：

1. `git ls-remote` 看 `main` 上有没有新提交；
2. 有就 `git pull --ff-only`；
3. 本地 HEAD 和 `.deployed-sha` 不一样就 `mkdocs gh-deploy` 重建并推 `gh-pages`。

日志在 `logs/autopublish.log`。想手动触发：`powershell -File D:\blog\自动发布.ps1`。

注意：这条链路依赖这台电脑开着。电脑关着时，网页上发布的文章会等到下次开机后才建。

## 预览和手动发布

- 双击 `预览.cmd`：本地 http://127.0.0.1:8000 ，改文件自动刷新。
- 双击 `发布.cmd`：立刻构建并推到 `gh-pages`。
- 也可以手动敲：

  ```powershell
  .\.venv\Scripts\python.exe -m mkdocs gh-deploy --force
  ```

## 背景和外观

页面右下角有调色板按钮：8 个预设背景、上传自己的图（≤3 MB）、模糊和压暗两个滑杆，存在浏览器 localStorage，只影响自己这台设备。

## 环境

Python 3.13 + `mkdocs-material`、`jieba`（中文搜索分词），都在 `.venv` 里，不用另装。

## 备注：GitHub Actions

`.github/workflows/deploy.yml` 已经写好（push `main` 就自动构建），但当前 `gh` 的 token 缺 `workflow` 权限，推不上去，所以暂时用本机的计划任务代替。等哪天在 GitHub 网页上把那个文件提交一次，就可以改成云端构建、不依赖本机。
