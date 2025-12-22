# PowerShell script to kill process using a specific port
# Usage: .\kill-port.ps1 [port]
# Example: .\kill-port.ps1 3000

param(
    [Parameter(Mandatory=$false)]
    [int]$Port = 3000
)

Write-Host "🔍 Looking for process using port $Port..." -ForegroundColor Yellow

try {
    $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    
    if ($connection) {
        $processId = $connection.OwningProcess
        $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
        
        if ($process) {
            Write-Host "📌 Found process:" -ForegroundColor Cyan
            Write-Host "   Name: $($process.ProcessName)" -ForegroundColor White
            Write-Host "   PID: $processId" -ForegroundColor White
            Write-Host "   Path: $($process.Path)" -ForegroundColor Gray
            
            Write-Host "`n⚠️  Killing process $processId..." -ForegroundColor Yellow
            Stop-Process -Id $processId -Force
            Write-Host "✅ Process killed successfully!" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Process with PID $processId not found (may have already terminated)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "✅ No process found using port $Port" -ForegroundColor Green
        Write-Host "   Port is available!" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`n💡 Try running as Administrator if you get permission errors" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n✅ Done!" -ForegroundColor Green

