/* 站点小工具：
 * 1) 背景设置（右下角齿轮，存 localStorage）
 * 2) 写文章页（/write/，直接用 GitHub API 提交到仓库）
 */
(function () {
  "use strict";

  var BG_KEY = "dfy.blog.bg";
  var TOKEN_KEY = "dfy.gh.token";
  var DRAFT_KEY = "dfy.draft.post";
  var OWNER = "LiuCuSO4";
  var REPO = "blog";
  var BRANCH = "main";
  var POSTS_DIR = "docs/blog/posts";

  var PRESETS = [
    { id: "none", name: "默认", value: "" },
    { id: "paper", name: "米色纸", value: "linear-gradient(135deg,#f7f4ec 0%,#efe9dc 60%,#e7dfcd 100%)" },
    { id: "grid", name: "网格纸", value: "repeating-linear-gradient(0deg,rgba(0,0,0,.055) 0 1px,transparent 1px 24px),repeating-linear-gradient(90deg,rgba(0,0,0,.055) 0 1px,transparent 1px 24px),linear-gradient(#fbfaf6,#f6f3ea)" },
    { id: "dots", name: "点阵", value: "radial-gradient(circle,rgba(0,0,0,.13) 1px,transparent 1.2px) 0 0/18px 18px,linear-gradient(#faf9f5,#f4f2ea)" },
    { id: "mist", name: "雾蓝", value: "linear-gradient(160deg,#e3edf6 0%,#ccdcec 45%,#b6cde3 100%)" },
    { id: "dusk", name: "晚霞", value: "linear-gradient(140deg,#f8dccd 0%,#e9bac6 45%,#b9a7d6 100%)" },
    { id: "forest", name: "墨绿", value: "radial-gradient(circle at 18% 12%,#2b3d4b 0%,#16202a 55%,#0d141a 100%)" },
    { id: "night", name: "夜", value: "linear-gradient(160deg,#131922 0%,#1c2733 60%,#243140 100%)" }
  ];

  /* ---------------------------- 背景 ---------------------------- */

  function loadBg() {
    try {
      var raw = localStorage.getItem(BG_KEY);
      return raw ? JSON.parse(raw) : { id: "none", value: "", blur: 0, veil: 0.12 };
    } catch (e) {
      return { id: "none", value: "", blur: 0, veil: 0.12 };
    }
  }

  function applyBg(cfg) {
    var el = document.documentElement;
    if (!cfg || !cfg.value) {
      el.style.removeProperty("--dfy-bg");
      el.style.removeProperty("--dfy-blur");
      el.style.removeProperty("--dfy-veil-a");
      document.body.classList.remove("dfy-has-bg");
      return;
    }
    el.style.setProperty("--dfy-bg", cfg.value);
    el.style.setProperty("--dfy-blur", (cfg.blur || 0) + "px");
    el.style.setProperty("--dfy-veil-a", cfg.veil == null ? 0.12 : cfg.veil);
    document.body.classList.add("dfy-has-bg");
  }

  function saveBg(cfg) {
    try {
      localStorage.setItem(BG_KEY, JSON.stringify(cfg));
    } catch (e) {
      alert("这张图太大了，浏览器存不下，换张小一点的。");
    }
    applyBg(cfg);
  }

  function buildBgPanel() {
    var btn = document.createElement("button");
    btn.className = "dfy-bg-btn";
    btn.type = "button";
    btn.title = "背景设置";
    btn.setAttribute("aria-label", "背景设置");
    btn.textContent = "🎨";

    var panel = document.createElement("div");
    panel.className = "dfy-bg-panel";

    var cfg = loadBg();

    panel.innerHTML =
      '<h3>背景</h3>' +
      '<div class="dfy-swatches"></div>' +
      '<div class="dfy-bg-row"><label>模糊</label><input type="range" min="0" max="12" step="1" data-k="blur"></div>' +
      '<div class="dfy-bg-row"><label>压暗</label><input type="range" min="0" max="0.7" step="0.02" data-k="veil"></div>' +
      '<div class="dfy-bg-actions">' +
      '  <button class="dfy-btn" type="button" data-act="upload">用自己的图</button>' +
      '  <button class="dfy-btn" type="button" data-act="reset">恢复默认</button>' +
      "</div>" +
      '<p class="dfy-hint">设置只存在这台电脑的浏览器里。想全站固定，改 <code>extra.css</code>。</p>' +
      '<input type="file" accept="image/*" hidden>';

    var swatches = panel.querySelector(".dfy-swatches");
    PRESETS.forEach(function (p) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "dfy-swatch";
      b.title = p.name;
      b.dataset.id = p.id;
      b.style.background = p.value || "var(--md-default-bg-color)";
      b.addEventListener("click", function () {
        cfg = { id: p.id, value: p.value, blur: cfg.blur || 0, veil: cfg.veil == null ? 0.12 : cfg.veil };
        if (p.id === "none") cfg.veil = 0.12;
        saveBg(cfg);
        sync();
      });
      swatches.appendChild(b);
    });

    var file = panel.querySelector('input[type="file"]');
    file.addEventListener("change", function () {
      var f = file.files && file.files[0];
      if (!f) return;
      if (f.size > 3 * 1024 * 1024) {
        alert("图超过 3MB 了，浏览器存不下。先压一下吧。");
        return;
      }
      var fr = new FileReader();
      fr.onload = function () {
        cfg = { id: "custom", value: 'url("' + fr.result + '")', blur: cfg.blur || 0, veil: cfg.veil == null ? 0.12 : cfg.veil };
        saveBg(cfg);
        sync();
      };
      fr.readAsDataURL(f);
    });

    panel.addEventListener("click", function (ev) {
      var act = ev.target.dataset && ev.target.dataset.act;
      if (act === "upload") file.click();
      if (act === "reset") {
        cfg = { id: "none", value: "", blur: 0, veil: 0.12 };
        saveBg(cfg);
        sync();
      }
    });

    panel.querySelectorAll('input[type="range"]').forEach(function (r) {
      r.addEventListener("input", function () {
        cfg[r.dataset.k] = r.dataset.k === "blur" ? Number(r.value) : Number(r.value);
        saveBg(cfg);
      });
    });

    function sync() {
      panel.querySelectorAll(".dfy-swatch").forEach(function (s) {
        s.setAttribute("aria-pressed", s.dataset.id === cfg.id ? "true" : "false");
      });
      panel.querySelector('[data-k="blur"]').value = cfg.blur || 0;
      panel.querySelector('[data-k="veil"]').value = cfg.veil == null ? 0.12 : cfg.veil;
    }

    btn.addEventListener("click", function () {
      var open = panel.getAttribute("data-open") === "1";
      panel.setAttribute("data-open", open ? "0" : "1");
    });

    document.addEventListener("click", function (ev) {
      if (!panel.contains(ev.target) && ev.target !== btn) panel.setAttribute("data-open", "0");
    });

    document.body.appendChild(btn);
    document.body.appendChild(panel);
    sync();
    applyBg(cfg);
  }

  /* ---------------------------- 写文章 ---------------------------- */

  function b64encodeUtf8(str) {
    var bytes = new TextEncoder().encode(str);
    var bin = "";
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }

  function b64decodeUtf8(b64) {
    var bin = atob(b64.replace(/\s/g, ""));
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  function gh(path, opts) {
    var token = localStorage.getItem(TOKEN_KEY) || "";
    opts = opts || {};
    opts.headers = Object.assign(
      {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
      },
      token ? { Authorization: "Bearer " + token } : {},
      opts.headers || {}
    );
    return fetch("https://api.github.com" + path, opts).then(function (r) {
      return r.text().then(function (t) {
        var data = null;
        try {
          data = t ? JSON.parse(t) : null;
        } catch (e) {
          data = t;
        }
        if (!r.ok) {
          var msg = (data && (data.message || data.error)) || r.status + " " + r.statusText;
          throw new Error(msg + "（" + r.status + "）");
        }
        return data;
      });
    });
  }

  function todayStr() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  function slugify(s) {
    return (s || "")
      .trim()
      .toLowerCase()
      .replace(/[\s_]+/g, "-")
      .replace(/[^\w\u4e00-\u9fa5-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60);
  }

  function mdToHtml(md) {
    if (window.marked && window.marked.parse) {
      try {
        return window.marked.parse(md);
      } catch (e) {}
    }
    var esc = md.replace(/[&<>]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c];
    });
    return "<pre>" + esc + "</pre>";
  }

  function initWriter(root) {
    var $ = function (sel) {
      return root.querySelector(sel);
    };
    var fTitle = $("#dfy-title");
    var fDate = $("#dfy-date");
    var fCat = $("#dfy-cat");
    var fName = $("#dfy-name");
    var fBody = $("#dfy-body");
    var status = $("#dfy-status");
    var preview = $("#dfy-preview");
    var tokenBox = $("#dfy-token");
    var listBox = $("#dfy-posts");

    fDate.value = todayStr();
    tokenBox.value = localStorage.getItem(TOKEN_KEY) || "";

    function say(msg, kind) {
      status.textContent = msg || "";
      status.setAttribute("data-kind", kind || "");
    }

    function filenameFromInputs() {
      if (fName.value.trim()) return slugify(fName.value) || fName.value.trim();
      var slug = slugify(fTitle.value) || "post";
      return fDate.value + "-" + slug;
    }

    function buildMarkdown() {
      var cats = fCat.value
        .split(/[,，]/)
        .map(function (s) {
          return s.trim();
        })
        .filter(Boolean);
      var fm = ["---", "date: " + (fDate.value || todayStr())];
      if (cats.length) {
        fm.push("categories:");
        cats.forEach(function (c) {
          fm.push("  - " + c);
        });
      }
      fm.push("---", "");
      var body = fBody.value.replace(/^\s+/, "");
      return fm.join("\n") + "\n" + body + "\n";
    }

    function saveDraft() {
      try {
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({
            title: fTitle.value,
            date: fDate.value,
            cat: fCat.value,
            name: fName.value,
            body: fBody.value,
            at: Date.now()
          })
        );
      } catch (e) {}
    }

    function restoreDraft() {
      try {
        var raw = localStorage.getItem(DRAFT_KEY);
        if (!raw) return;
        var d = JSON.parse(raw);
        if (!d || !(d.body || d.title)) return;
        fTitle.value = d.title || "";
        fDate.value = d.date || todayStr();
        fCat.value = d.cat || "随笔";
        fName.value = d.name || "";
        fBody.value = d.body || "";
        say("恢复了上次没发出去的草稿（存在这台电脑上）。");
      } catch (e) {}
    }

    fTitle.addEventListener("input", function () {
      if (!fName.dataset.touched) {
        // 只做提示，不覆盖手填的文件名
      }
      saveDraft();
    });
    [fDate, fCat, fName, fBody].forEach(function (el) {
      el.addEventListener("input", saveDraft);
    });

    $("#dfy-preview-btn").addEventListener("click", function () {
      if (preview.hidden) {
        preview.innerHTML = mdToHtml(fBody.value);
        preview.hidden = false;
        this.textContent = "收起预览";
      } else {
        preview.hidden = true;
        this.textContent = "预览";
      }
    });

    $("#dfy-clear").addEventListener("click", function () {
      if (!confirm("清空当前内容和草稿？")) return;
      fTitle.value = "";
      fDate.value = todayStr();
      fCat.value = "随笔";
      fName.value = "";
      fBody.value = "";
      localStorage.removeItem(DRAFT_KEY);
      say("清空了。");
    });

    $("#dfy-download").addEventListener("click", function () {
      var blob = new Blob([buildMarkdown()], { type: "text/markdown;charset=utf-8" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filenameFromInputs() + ".md";
      a.click();
      URL.revokeObjectURL(a.href);
      say("下载好了，丢进 docs/blog/posts/ 也能发。");
    });

    $("#dfy-token-save").addEventListener("click", function () {
      var t = tokenBox.value.trim();
      if (!t) {
        localStorage.removeItem(TOKEN_KEY);
        say("清掉了本机保存的 token。");
        return;
      }
      localStorage.setItem(TOKEN_KEY, t);
      say("token 存好了（只在这台电脑的浏览器里）。");
    });

    $("#dfy-test").addEventListener("click", function () {
      say("在试……");
      gh("/repos/" + OWNER + "/" + REPO)
        .then(function (r) {
          return gh("/repos/" + OWNER + "/" + REPO + "/contents/" + POSTS_DIR);
        })
        .then(function () {
          say("通了，token 能用。", "ok");
        })
        .catch(function (e) {
          say("没通：" + e.message, "err");
        });
    });

    $("#dfy-publish").addEventListener("click", function () {
      var title = fTitle.value.trim();
      var body = fBody.value.trim();
      if (!title) return say("先写个标题。", "err");
      if (!body) return say("正文还是空的。", "err");
      var token = localStorage.getItem(TOKEN_KEY) || "";
      if (!token) return say("先去下面填 token，填一次就行。", "err");

      var name = filenameFromInputs();
      var filePath = POSTS_DIR + "/" + name + ".md";
      var apiPath = "/repos/" + OWNER + "/" + REPO + "/contents/" + encodeURIComponent(name + ".md");
      var payload = {
        message: "新文章：" + title,
        content: b64encodeUtf8(buildMarkdown()),
        branch: BRANCH
      };

      say("正在提交……");
      gh(apiPath + "?ref=" + BRANCH)
        .then(function (existing) {
          payload.sha = existing.sha;
          return gh(apiPath, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        })
        .catch(function (e) {
          if (!/404/.test(e.message)) throw e;
          return gh(apiPath, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        })
        .then(function () {
          localStorage.removeItem(DRAFT_KEY);
          say("提交成功：" + filePath + "。GitHub Actions 大概 1~3 分钟重建，然后刷新首页就能看到。", "ok");
        })
        .catch(function (e) {
          say("没提交成：" + e.message, "err");
        });
    });

    function loadList() {
      listBox.innerHTML = "<span style='opacity:.6'>正在读文章列表……</span>";
      gh("/repos/" + OWNER + "/" + REPO + "/contents/" + POSTS_DIR + "?ref=" + BRANCH)
        .then(function (items) {
          listBox.innerHTML = "";
          (items || [])
            .filter(function (i) {
              return i.type === "file" && /\.md$/.test(i.name);
            })
            .sort(function (a, b) {
              return b.name.localeCompare(a.name);
            })
            .forEach(function (i) {
              var b = document.createElement("button");
              b.type = "button";
              b.textContent = i.name.replace(/\.md$/, "");
              b.addEventListener("click", function () {
                gh("/repos/" + OWNER + "/" + REPO + "/contents/" + POSTS_DIR + "/" + encodeURIComponent(i.name) + "?ref=" + BRANCH)
                  .then(function (f) {
                    var text = b64decodeUtf8(f.content || "");
                    var m = text.match(/^---\n([\s\S]*?)\n---\n?/);
                    var front = m ? m[1] : "";
                    var rest = m ? text.slice(m[0].length) : text;
                    var dm = front.match(/date:\s*([0-9-]+)/);
                    var cm = front.match(/categories:\s*\n((?:\s*-\s*.+\n?)+)/);
                    var cats = cm
                      ? cm[1]
                          .split("\n")
                          .map(function (x) {
                            return x.replace(/^\s*-\s*/, "").trim();
                          })
                          .filter(Boolean)
                          .join(", ")
                      : "随笔";
                    fDate.value = dm ? dm[1] : todayStr();
                    fCat.value = cats;
                    fName.value = i.name.replace(/\.md$/, "");
                    fName.dataset.touched = "1";
                    fBody.value = rest;
                    var h = rest.match(/^#\s+(.+)$/m);
                    fTitle.value = h ? h[1].trim() : i.name.replace(/\.md$/, "");
                    say("载入了 " + i.name + "，改完点发布就是覆盖。");
                  })
                  .catch(function (e) {
                    say("读不出来：" + e.message, "err");
                  });
              });
              listBox.appendChild(b);
            });
          if (!listBox.children.length) listBox.textContent = "（还没有文章）";
        })
        .catch(function (e) {
          listBox.innerHTML = "<span style='opacity:.7'>填好 token 点「读文章列表」就能编辑已有的。</span>";
        });
    }

    $("#dfy-list").addEventListener("click", loadList);

    restoreDraft();
    say("写吧。发布前建议先点「预览」看一眼。");
  }

  /* ---------------------------- 启动 ---------------------------- */

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function () {
    try {
      buildBgPanel();
    } catch (e) {
      console && console.warn && console.warn("背景面板没起来", e);
    }
    var root = document.getElementById("dfy-writer");
    if (root) {
      try {
        initWriter(root);
      } catch (e) {
        console && console.warn && console.warn("写文章页没起来", e);
      }
    }
  });
})();
