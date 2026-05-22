# Run from Backend folder: .\start.ps1
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (-not (Test-Path ".venv")) {
    python -m venv .venv
    .\.venv\Scripts\pip.exe install -r requirements.txt
}

if (-not (Test-Path ".env") -or ((Get-Item ".env").Length -eq 0)) {
    Write-Host "ERROR: Backend/.env is missing or empty. Copy .env.example and fill in MONGODB_URI, JWT_SECRET, etc."
    exit 1
}

.\.venv\Scripts\uvicorn.exe app.main:app --reload --host 127.0.0.1 --port 8000
