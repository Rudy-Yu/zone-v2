# Script untuk menjalankan semua komponen aplikasi ZONE v.2
# Backend, Frontend, dan MongoDB

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   ZONE v.2 - STARTING ALL SERVICES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function untuk check jika port sudah digunakan
function Test-Port {
    param([int]$Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue
    return $connection.TcpTestSucceeded
}

# 1. Check dan Start MongoDB
Write-Host "[1/3] Checking MongoDB..." -ForegroundColor Yellow
$mongoRunning = Test-Port -Port 27017

if (-not $mongoRunning) {
    Write-Host "   MongoDB tidak berjalan. Mencoba start MongoDB..." -ForegroundColor Yellow
    
    # Cek apakah MongoDB service ada
    $mongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
    
    if ($mongoService) {
        Write-Host "   Starting MongoDB Service..." -ForegroundColor Green
        Start-Service -Name "MongoDB"
        Start-Sleep -Seconds 3
        $mongoRunning = Test-Port -Port 27017
    } else {
        # Coba jalankan mongod langsung
        $mongodPath = Get-Command mongod -ErrorAction SilentlyContinue
        if ($mongodPath) {
            Write-Host "   Starting MongoDB daemon..." -ForegroundColor Green
            Start-Process -FilePath "mongod" -WindowStyle Hidden
            Start-Sleep -Seconds 3
            $mongoRunning = Test-Port -Port 27017
        } else {
            Write-Host "   ⚠️  MongoDB tidak ditemukan. Pastikan MongoDB terinstall." -ForegroundColor Red
            Write-Host "   Download dari: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
        }
    }
}

if ($mongoRunning) {
    Write-Host "   ✅ MongoDB: RUNNING on mongodb://localhost:27017" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  MongoDB: NOT RUNNING - Aplikasi mungkin tidak bisa connect ke database" -ForegroundColor Red
    Write-Host "   Silakan start MongoDB manual atau install MongoDB terlebih dahulu" -ForegroundColor Yellow
}

Write-Host ""

# 2. Start Backend Server
Write-Host "[2/3] Starting Backend Server..." -ForegroundColor Yellow

$backendRunning = Test-Port -Port 8000
if ($backendRunning) {
    Write-Host "   ⚠️  Port 8000 sudah digunakan. Backend mungkin sudah berjalan." -ForegroundColor Yellow
} else {
    Write-Host "   Starting FastAPI server..." -ForegroundColor Green
    
    # Change to backend directory
    Push-Location "backend"
    
    # Activate virtual environment and start server
    $backendPath = Join-Path $PSScriptRoot "backend"
    $pythonPath = Join-Path $backendPath "venv\Scripts\python.exe"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; & '$pythonPath' -m uvicorn server:app --host 0.0.0.0 --port 8000 --reload" -WindowStyle Minimized
    
    Write-Host "   ✅ Backend Server: STARTING on http://localhost:8000" -ForegroundColor Green
    Write-Host "   📚 API Docs akan tersedia di: http://localhost:8000/docs" -ForegroundColor Cyan
    
    # Wait for backend to start
    $maxAttempts = 10
    $attempt = 0
    do {
        Start-Sleep -Seconds 2
        $backendRunning = Test-Port -Port 8000
        $attempt++
    } while (-not $backendRunning -and $attempt -lt $maxAttempts)
    
    if ($backendRunning) {
        Write-Host "   ✅ Backend Server: READY" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Backend Server: Starting... (mungkin perlu waktu lebih lama)" -ForegroundColor Yellow
    }
    
    Pop-Location
}

Write-Host ""

# 3. Start Frontend
Write-Host "[3/3] Starting Frontend..." -ForegroundColor Yellow

$frontendRunning = Test-Port -Port 3000
if ($frontendRunning) {
    Write-Host "   ⚠️  Port 3000 sudah digunakan. Frontend mungkin sudah berjalan." -ForegroundColor Yellow
} else {
    Write-Host "   Starting React development server..." -ForegroundColor Green
    
    # Change to frontend directory
    Push-Location "frontend"
    
    # Check if node_modules exists
    if (-not (Test-Path "node_modules")) {
        Write-Host "   Installing dependencies (first time only)..." -ForegroundColor Yellow
        npm install
    }
    
    # Start frontend
    $frontendPath = Join-Path $PSScriptRoot "frontend"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm start"
    
    Write-Host "   ✅ Frontend: STARTING on http://localhost:3000" -ForegroundColor Green
    Write-Host "   Browser akan otomatis terbuka dalam beberapa detik..." -ForegroundColor Cyan
    
    # Wait a bit for frontend to start
    Start-Sleep -Seconds 5
}

Pop-Location

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   ✅ ALL SERVICES STARTED" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Access Points:" -ForegroundColor Yellow
Write-Host "   Frontend:  http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:   http://localhost:8000" -ForegroundColor White
Write-Host "   API Docs:  http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "🔐 Default Login:" -ForegroundColor Yellow
Write-Host "   Email:    admin@zone.com" -ForegroundColor White
Write-Host "   Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "📝 Note:" -ForegroundColor Yellow
Write-Host "   - Backend dan Frontend berjalan di window terpisah" -ForegroundColor Gray
Write-Host "   - Tutup window untuk stop service" -ForegroundColor Gray
Write-Host "   - MongoDB harus tetap berjalan untuk aplikasi berfungsi" -ForegroundColor Gray
Write-Host ""
Write-Host "Tekan Enter untuk keluar..." -ForegroundColor Gray
Read-Host

