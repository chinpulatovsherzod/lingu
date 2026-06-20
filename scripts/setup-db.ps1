# Локальная БД без Docker: скачивает portable PostgreSQL (Windows)
$ErrorActionPreference = "Stop"
$pgDir = "$PSScriptRoot\..\tools\pgsql"
$pgBin = "$pgDir\bin"
$dataDir = "$pgDir\data"
$port = 5433

if (Test-Path "$pgBin\pg_ctl.exe") {
  Write-Host "PostgreSQL уже установлен в tools/pgsql"
} else {
  Write-Host "Скачивание PostgreSQL 16 portable..."
  $zip = "$env:TEMP\pgsql-portable.zip"
  Invoke-WebRequest -Uri "https://get.enterprisedb.com/postgresql/postgresql-16.4-1-windows-x64-binaries.zip" -OutFile $zip
  New-Item -ItemType Directory -Force -Path $pgDir | Out-Null
  Expand-Archive -Path $zip -DestinationPath "$pgDir\tmp" -Force
  $inner = Get-ChildItem "$pgDir\tmp" -Directory | Select-Object -First 1
  Move-Item "$($inner.FullName)\*" $pgDir -Force
  Remove-Item "$pgDir\tmp" -Recurse -Force
}

if (-not (Test-Path $dataDir)) {
  & "$pgBin\initdb.exe" -D $dataDir -U postgres --encoding=UTF8 --locale=C
  & "$pgBin\pg_ctl.exe" -D $dataDir -o "-p $port" start
  Start-Sleep -Seconds 3
  $env:PGPASSWORD = "postgres"
  & "$pgBin\createdb.exe" -h localhost -p $port -U postgres lingoarc
} else {
  & "$pgBin\pg_ctl.exe" -D $dataDir -o "-p $port" start
}

Write-Host ""
Write-Host "PostgreSQL запущен на порту $port"
Write-Host 'Добавьте в .env:'
Write-Host "DATABASE_URL=`"postgresql://postgres@localhost:${port}/lingoarc?schema=public`""
