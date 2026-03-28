# PowerShell script to create deployment package
Write-Host "Creating deployment package..." -ForegroundColor Green

# Create deployment folder
$deployFolder = ".\deployment-package"
if (Test-Path $deployFolder) {
    Remove-Item -Recurse -Force $deployFolder
}
New-Item -ItemType Directory -Path $deployFolder | Out-Null

Write-Host "Copying files..." -ForegroundColor Yellow

# Copy essential files and folders
Copy-Item -Path ".next" -Destination "$deployFolder\.next" -Recurse
Copy-Item -Path "public" -Destination "$deployFolder\public" -Recurse
# NOTE: node_modules excluded - will be installed on server by deploy.ps1
Copy-Item -Path "package.json" -Destination "$deployFolder\package.json"
Copy-Item -Path "package-lock.json" -Destination "$deployFolder\package-lock.json"
Copy-Item -Path "next.config.ts" -Destination "$deployFolder\next.config.ts"
Copy-Item -Path ".env.production" -Destination "$deployFolder\.env.production"
Copy-Item -Path "ecosystem.config.js" -Destination "$deployFolder\ecosystem.config.js"
Copy-Item -Path "DEPLOYMENT.md" -Destination "$deployFolder\DEPLOYMENT.md"
Copy-Item -Path "deploy.ps1" -Destination "$deployFolder\deploy.ps1"
Copy-Item -Path "web.config" -Destination "$deployFolder\web.config"

# Force the packaged production env to use the IIS HTTPS endpoint.
$packagedProductionEnv = @"
# Production environment variables
# API is hosted in IIS on HTTPS binding port 5443.
BASE_URL=https://localhost:5443/api
ALLOW_INSECURE_LOCALHOST_TLS=true

# Use your actual production API keys
API_KEY=TEST_API_KEY_12345678901234567890123456789012
SECRET_KEY=TEST_SECRET_KEY_67890ABCDEFGHIJ1234567890
"@

Set-Content -Path "$deployFolder\.env.production" -Value $packagedProductionEnv

# Create logs directory
New-Item -ItemType Directory -Path "$deployFolder\logs" | Out-Null

# Create README for server
$serverReadme = @"
# Deployment Instructions

1. Copy this entire folder to your Windows Server 2012

2. Install Node.js 20.x LTS if not already installed:
   https://nodejs.org/

3. Install PM2 globally:
   npm install -g pm2
   npm install -g pm2-windows-startup
   pm2-startup install

4. Edit .env.production file with your production settings:
   - Update BASE_URL if needed
   - Change API_KEY and SECRET_KEY from TEST values

5. Start the application:
   pm2 start ecosystem.config.js
   pm2 save

6. Configure Windows Firewall:
   New-NetFirewallRule -DisplayName NextJsVoterVerification -Direction Inbound -LocalPort 8089 -Protocol TCP -Action Allow

7. Access your application at:
   http://localhost:8089
   or
   https://smkc.gov.in:8089 (after SSL setup)

For detailed instructions, see DEPLOYMENT.md

## Troubleshooting

If application will not start:
- Check Node.js version: node -v (should be 18.18+ or 20.x)
- View logs: pm2 logs voter-verification
- Check port: netstat -ano | findstr :8089

## PM2 Commands

- View status: pm2 status
- View logs: pm2 logs voter-verification
- Restart: pm2 restart voter-verification
- Stop: pm2 stop voter-verification
- Monitor: pm2 monit
"@

Set-Content -Path "$deployFolder\README.txt" -Value $serverReadme

Write-Host "Deployment package created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Location: $deployFolder" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Copy the deployment-package folder to your Windows Server" -ForegroundColor White
Write-Host "2. Follow instructions in README.txt on the server" -ForegroundColor White
Write-Host ""
