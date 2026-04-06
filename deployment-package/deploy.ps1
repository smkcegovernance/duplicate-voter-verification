# ============================================
# DEPLOYMENT SCRIPT FOR WINDOWS SERVER 2012 R2
# Voter Verification Application
# ============================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " VOTER VERIFICATION DEPLOYMENT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check prerequisites
Write-Host "[1/6] Checking prerequisites..." -ForegroundColor Yellow

# Check Node.js
$nodeVersion = node -v 2>$null
if (-not $nodeVersion) {
    Write-Host "ERROR: Node.js not found!" -ForegroundColor Red
    Write-Host "Please install Node.js 20.x from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

$nodeMajorVersion = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
if ($nodeMajorVersion -lt 20) {
    Write-Host "ERROR: Node.js version $nodeVersion is too old!" -ForegroundColor Red
    Write-Host "Next.js 16 requires Node.js 20.9.0 or higher" -ForegroundColor Yellow
    Write-Host "Please upgrade from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}
Write-Host "  Node.js: $nodeVersion" -ForegroundColor Green

# Check PM2
$pm2Version = pm2 -v 2>$null
if (-not $pm2Version) {
    Write-Host "ERROR: PM2 not found!" -ForegroundColor Red
    Write-Host "Install with: npm install -g pm2" -ForegroundColor Yellow
    exit 1
}
Write-Host "  PM2: v$pm2Version" -ForegroundColor Green

# Step 2: Check environment file
Write-Host ""
Write-Host "[2/7] Checking environment file..." -ForegroundColor Yellow

if (-not (Test-Path ".env.production")) {
    Write-Host "  ERROR: .env.production not found!" -ForegroundColor Red
    Write-Host "  The file must be in the same folder as deploy.ps1" -ForegroundColor Yellow
    Write-Host "  Edit .env.production with your actual API_KEY and SECRET_KEY before deploying." -ForegroundColor Yellow
    exit 1
}

# Warn if still using placeholder keys
$envContent = Get-Content ".env.production" -Raw
if ($envContent -match "CHANGE_ME") {
    Write-Host "  WARNING: .env.production still contains CHANGE_ME placeholder keys!" -ForegroundColor Red
    Write-Host "  Update API_KEY and SECRET_KEY in .env.production before going live." -ForegroundColor Yellow
} else {
    Write-Host "  .env.production OK" -ForegroundColor Green
}

# Step 3: Configure npm for Windows Server 2012
Write-Host ""
Write-Host "[3/7] Configuring npm..." -ForegroundColor Yellow
npm config set ignore-scripts false
npm config set engine-strict false
Write-Host "  npm configured for compatibility" -ForegroundColor Green

# Step 4: Stop existing application
Write-Host ""
Write-Host "[4/7] Stopping existing application..." -ForegroundColor Yellow

try {
    pm2 stop voter-verification 2>$null
    Start-Sleep -Seconds 2
    Write-Host "  Application stopped" -ForegroundColor Green
} catch {
    Write-Host "  No existing application to stop" -ForegroundColor Cyan
}

# Step 5: Clean old node_modules
Write-Host ""
Write-Host "[5/7] Cleaning old dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
    Write-Host "  Old dependencies removed" -ForegroundColor Green
} else {
    Write-Host "  No old dependencies to clean" -ForegroundColor Cyan
}

# Step 6: Install dependencies
Write-Host ""
Write-Host "[6/7] Installing dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "package.json")) {
    Write-Host "ERROR: package.json not found in current directory!" -ForegroundColor Red
    Write-Host "Make sure you're running this script from the deployment folder" -ForegroundColor Yellow
    exit 1
}

$packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
$depCount = ($packageJson.dependencies.PSObject.Properties | Measure-Object).Count
Write-Host "  Installing $depCount packages..." -ForegroundColor Cyan

# Clean npm cache
Start-Process -FilePath "npm" -ArgumentList "cache","clean","--force" -NoNewWindow -Wait -ErrorAction SilentlyContinue

# Install dependencies
npm install --legacy-peer-deps

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: npm install failed with exit code $LASTEXITCODE" -ForegroundColor Red
    Write-Host "Try running manually: npm install --legacy-peer-deps" -ForegroundColor Yellow
    exit 1
}
Write-Host "  Dependencies installed successfully" -ForegroundColor Green

# Step 7: Start application
Write-Host ""
Write-Host "[7/7] Starting application..." -ForegroundColor Yellow

# Check for ecosystem config
if (-not (Test-Path "ecosystem.config.js")) {
    Write-Host "ERROR: ecosystem.config.js not found!" -ForegroundColor Red
    exit 1
}

# Delete existing PM2 app if it exists
pm2 delete voter-verification 2>$null | Out-Null

# Start the application
try {
    pm2 start ecosystem.config.js
    
    # Save PM2 configuration
    pm2 save | Out-Null
    
    # Brief pause for status
    Start-Sleep -Seconds 3
    Write-Host "  Application started" -ForegroundColor Green
    
} catch {
    Write-Host "  ERROR: Failed to start application!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Check logs with: pm2 logs voter-verification" -ForegroundColor Yellow
    exit 1
}

# Final status
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Application Status:" -ForegroundColor Cyan
pm2 list
Write-Host ""
Write-Host "URLs:" -ForegroundColor Cyan
Write-Host "  Local:  http://localhost:8443" -ForegroundColor White
Write-Host "  Public: https://smkc.gov.in:8443" -ForegroundColor White
Write-Host ""
Write-Host "Useful Commands:" -ForegroundColor Cyan
Write-Host "  View logs:    pm2 logs voter-verification" -ForegroundColor White
Write-Host "  View status:  pm2 status" -ForegroundColor White
Write-Host "  Restart app:  pm2 restart voter-verification" -ForegroundColor White
Write-Host "  Stop app:     pm2 stop voter-verification" -ForegroundColor White
Write-Host "  Monitor:      pm2 monit" -ForegroundColor White
Write-Host ""
