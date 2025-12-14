# PowerShell script to run Prisma commands
# This avoids PowerShell execution policy issues

param(
    [Parameter(Mandatory=$true)]
    [string]$Command
)

# Setup environment
Write-Host "Setting up DATABASE_URL..." -ForegroundColor Cyan
node setup-env.js

# Run Prisma command
Write-Host "Running Prisma: $Command" -ForegroundColor Cyan
& .\node_modules\.bin\prisma.cmd $Command.Split(' ')



