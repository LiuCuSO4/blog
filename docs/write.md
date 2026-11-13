---
title: 写文章
search:
  exclude: true
---

# 写文章

在这里写完，点「发布」就直接提交到 GitHub，网站一两分钟后自己更新。不用装任何东西。

!!! warning "第一次用要填一次 token"
    浏览器得知道你有权限往仓库里写。点下面「第一次用：填 token」按提示做，token 只存在**这台电脑的浏览器**里，不经过任何第三方。

<div class="dfy-write" id="dfy-writer" markdown>

<div class="dfy-field">
  <span>标题</span>
  <input type="text" id="dfy-title" placeholder="比如：为什么我开始记规则">
</div>

<div class="dfy-grid2">
  <div class="dfy-field">
    <span>日期</span>
    <input type="date" id="dfy-date">
  </div>
  <div class="dfy-field">
    <span>分类（逗号分隔）</span>
    <input type="text" id="dfy-cat" value="随笔" placeholder="随笔, 折腾">
  </div>
</div>

<div class="dfy-field">
  <span>文件名（留空自动按日期+标题生成）</span>
  <input type="text" id="dfy-name" placeholder="2026-11-13-为什么我开始记规则">
</div>

<div class="dfy-field">
  <span>正文（Markdown）</span>
  <textarea id="dfy-body" placeholder="一句话说清楚这篇在讲什么。

## 小节

正文……"></textarea>
</div>

<div class="dfy-write-bar">
  <button class="dfy-btn" type="button" id="dfy-preview-btn">预览</button>
  <button class="dfy-btn" type="button" id="dfy-download">下载 .md</button>
  <button class="dfy-btn" type="button" id="dfy-clear">清空</button>
  <button class="dfy-btn dfy-btn--primary" type="button" id="dfy-publish">发布</button>
</div>

<div class="dfy-status" id="dfy-status"></div>
<div class="dfy-preview" id="dfy-preview" hidden></div>

<details markdown>
<summary>第一次用：填 token（只填一次）</summary>

1. 打开 <https://github.com/settings/personal-access-tokens/new>，用你的 GitHub 账号登录。
2. **Token name** 随便写，比如 `blog-writer`。
3. **Expiration** 选 90 天或者一年，到期再换。
4. **Repository access** 选 `Only select repositories` → 只勾 `blog`。
5. **Permissions** → `Repository permissions` → 找到 **Contents**，选 **Read and write**。别的不动。
6. 点最下面 **Generate token**，复制那串 `github_pat_...`（只显示一次）。
7. 粘到下面，点「保存 token」。

<div class="dfy-field">
  <span>GitHub token</span>
  <input type="password" id="dfy-token" placeholder="github_pat_...">
</div>

<div class="dfy-write-bar">
  <button class="dfy-btn" type="button" id="dfy-token-save">保存 token</button>
  <button class="dfy-btn" type="button" id="dfy-test">试一下通不通</button>
</div>

!!! danger "别在这台电脑以外的地方填"
    token 存在浏览器本地存储里。公用电脑用完请点「保存 token」时留空再保存一次，把它清掉。

</details>

<details markdown>
<summary>改已有的文章</summary>

点「读文章列表」，再点文件名，正文和日期会填进来；改完点「发布」就是覆盖原来那篇。

<div class="dfy-write-bar">
  <button class="dfy-btn" type="button" id="dfy-list">读文章列表</button>
</div>

<div class="dfy-posts" id="dfy-posts"></div>

</details>

</div>

<script src="https://cdn.jsdelivr.net/npm/marked@12/marked.min.js" defer></script>
