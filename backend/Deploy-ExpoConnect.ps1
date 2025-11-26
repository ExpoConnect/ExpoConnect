# ===============================
# ExpoConnect - One Click Deploy
# ===============================

Write-Host "Starting ExpoConnect deploy..." -ForegroundColor Cyan

# Paths
$solutionDir = "C:\Users\olido\Desktop\ExpoConnect\ExpoConnect\backend"
$publishPath = "C:\apps\ExpoConnect"
$buildConfig = "Release"
$appOffline = Join-Path $publishPath "app_offline.htm"

Write-Host "Solution dir: $solutionDir"
Write-Host "Publish dir:  $publishPath"

# 0) לקחת את האתר "אופליין" כדי לשחרר את ה-DLL
Write-Host "Putting app_offline.htm (taking site offline)..."
"Site is temporarily offline for deployment." | Out-File -Encoding utf8 $appOffline

# 1) Build + Publish — בדיוק כמו ידנית
Write-Host "Building and Publishing project..."
Push-Location $solutionDir

dotnet publish -c $buildConfig -o $publishPath

$exitCode = $LASTEXITCODE

Pop-Location

Write-Host "dotnet publish exit code: $exitCode"

if ($exitCode -ne 0) {
    Write-Host " Publish failed." -ForegroundColor Red
    # במקרה קיצון לא מוחקים app_offline כדי לא להעלות גרסה שבורה
    exit
}

Write-Host " Publish completed successfully." -ForegroundColor Green

# 2) להחזיר את האתר "און־ליין"
if (Test-Path $appOffline) {
    Write-Host "Removing app_offline.htm (bringing site back online)..."
    Remove-Item $appOffline -Force
}

# 3) מידע על ה-DLL שפורסם
$dll = Join-Path $publishPath "ExpoConnect.Api.dll"
if (Test-Path $dll) {
    $info = Get-Item $dll
    Write-Host "Deployed DLL:" $info.FullName
    Write-Host "Last write time:" $info.LastWriteTime
} else {
    Write-Host "WARNING: ExpoConnect.Api.dll not found in publish path!" -ForegroundColor Yellow
}

Write-Host " ExpoConnect deployed." -ForegroundColor Cyan
