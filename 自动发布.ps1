# 自动发布：盯住 GitHub 上 main 的最新提交，有新东西就本地重建并推 gh-pages
# 由计划任务每 3 分钟调一次；也可以用 预览.cmd 旁边手动跑
$ErrorActionPreference = 'Continue'
$Root = 'D:\blog'
$LogDir = Join-Path $Root 'logs'
$Log = Join-Path $LogDir 'autopublish.log'
$ShaFile = Join-Path $Root '.deployed-sha'
$Py = Join-Path $Root '.venv\Scripts\python.exe'

New-Item -ItemType Directory -Force -Path $LogDir | Out-Null
function Note([string]$m) {
    $line = ('{0}  {1}' -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $m)
    Add-Content -Path $Log -Value $line -Encoding utf8
}

Set-Location $Root

# 1) 远端 main 的 sha
$remoteSha = $null
for ($i = 1; $i -le 3; $i++) {
    $out = git ls-remote origin refs/heads/main 2>$null
    if ($out) { $remoteSha = ($out -split '\s+')[0]; break }
    Start-Sleep -Seconds 2
}
if (-not $remoteSha) { Note '拉不到远端状态，跳过这一轮'; exit 0 }

# 2) 本地落后就拉
$localSha = (git rev-parse HEAD).Trim()
if ($localSha -ne $remoteSha) {
    $pulled = $false
    for ($i = 1; $i -le 3; $i++) {
        git -c http.version=HTTP/1.1 pull --ff-only origin main 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) { $pulled = $true; break }
        Start-Sleep -Seconds 2
    }
    if (-not $pulled) { Note '拉取失败（网络），下一轮再试'; exit 0 }
    $localSha = (git rev-parse HEAD).Trim()
    Note "拉到新提交 $($localSha.Substring(0,7))"
}

# 3) 已经部署过就不动
$deployed = ''
if (Test-Path $ShaFile) { $deployed = (Get-Content $ShaFile -Raw).Trim() }
if ($deployed -eq $localSha) { exit 0 }

if (-not (Test-Path $Py)) { Note '找不到 .venv，跳过'; exit 1 }

# 4) 重建 + 推 gh-pages
$ok = $false
for ($i = 1; $i -le 3; $i++) {
    & $Py -m mkdocs gh-deploy --force --no-history 2>&1 | Out-File -FilePath $Log -Append -Encoding utf8
    if ($LASTEXITCODE -eq 0) { $ok = $true; break }
    Note "第 $i 次部署失败，等 5 秒重试"
    Start-Sleep -Seconds 5
}
if ($ok) {
    Set-Content -Path $ShaFile -Value $localSha -Encoding utf8 -NoNewline
    Note "部署完成 $($localSha.Substring(0,7))"
} else {
    Note '部署连续失败，下一轮再试'
    exit 1
}
