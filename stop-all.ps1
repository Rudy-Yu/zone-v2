# Script untuk menghentikan semua komponen aplikasi ZONE v.2

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   ZONE v.2 - STOPPING ALL SERVICES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Stop processes on specific ports
function Stop-ProcessOnPort {
    param([int]$Port, [string]$Name)
    
    $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | 
        Select-Object -ExpandProperty OwningProcess -Unique
    
    if ($processes) {
        foreach ($pid in $processes) {
            try {
                Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                Write-Host "   ✅ Stopped $Name (PID: $pid)" -ForegroundColor Green
            } catch {
                Write-Host "   ⚠️  Could not stop $Name (PID: $pid)" -ForegroundColor Yellow
            }
        }
    } else {
        Write-Host "   ℹ️  $Name is not running" -ForegroundColor Gray
    }
}

# Stop Frontend (port 3000)
Write-Host "[1/3] Stopping Frontend (port 3000)..." -ForegroundColor Yellow
Stop-ProcessOnPort -Port 3000 -Name "Frontend"

# Stop Backend (port 8000)
Write-Host "[2/3] Stopping Backend (port 8000)..." -ForegroundColor Yellow
Stop-ProcessOnPort -Port 8000 -Name "Backend"

# Stop MongoDB (optional - comment out if you want to keep MongoDB running)
Write-Host "[3/3] MongoDB Status..." -ForegroundColor Yellow
Write-Host "   ℹ️  MongoDB tetap berjalan (tidak di-stop)" -ForegroundColor Gray
Write-Host "   Jika ingin stop MongoDB, jalankan: Stop-Service MongoDB" -ForegroundColor Gray

Write-Host ""
Write-Host "✅ All services stopped" -ForegroundColor Green
Write-Host ""

