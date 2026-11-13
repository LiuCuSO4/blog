# 硫酸铜的笔记本

规则说明 + 随笔，用 MkDocs Material 生成，发布在 GitHub Pages。

- 线上地址：https://liucuso4.github.io/blog/
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

## 预览和发布

- 双击 `预览.cmd`：本地 http://127.0.0.1:8000 ，改文件自动刷新。
- 双击 `发布.cmd`：构建并推到 `gh-pages` 分支，一分钟左右线上生效。
- 也可以手动敲：

  ```powershell
  .\.venv\Scripts\python.exe -m mkdocs gh-deploy --force
  ```

## 环境

Python 3.13 + `mkdocs-material`、`jieba`（中文搜索分词），都在 `.venv` 里，不用另装。
