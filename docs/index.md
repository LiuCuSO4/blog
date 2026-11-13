# 硫酸铜的笔记本

放两样东西：**规则说明**（长期有效的约定、怎么用、注意事项）和**随笔**（想到哪写到哪）。

<div class="grid cards" markdown>

-   :material-book-open-variant: **规则说明**

    ---

    长期有效的东西。分章节、带目录，改一次全体生效。

    [:material-arrow-right: 进去看](规则说明/index.md)

-   :material-notebook-edit-outline: **随笔**

    ---

    按时间排的文章流。随手写的、看过的、想明白的，都丢这里。

    [:material-arrow-right: 最近的文字](blog/index.md)

</div>

## 怎么改

所有页面都是 `docs/` 下的 Markdown 文件，改完它会自己更新：

| 想改什么 | 改哪个文件 |
|---|---|
| 首页 | `docs/index.md` |
| 规则说明 | `docs/规则说明/` 里的 `.md` |
| 随笔 | `docs/blog/posts/` 里新建 `xxx.md` |
| 左边目录的顺序 | `mkdocs.yml` 的 `nav` |

!!! tip "写新随笔"
    在 `docs/blog/posts/` 下建一个 `随便什么名字.md`，开头写上：

    ```markdown
    ---
    date: 2026-11-13
    categories:
      - 随笔
    ---
    ```

    正文从下一行开始写就行。
