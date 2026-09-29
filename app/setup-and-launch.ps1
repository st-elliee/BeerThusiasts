# BeerDB Setup and Launch Script
# This script installs dependencies, sets up the database, and launches the application

Write-Host "BeerDB Setup and Launch Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Shutdown any running servers
Write-Host "Checking for running servers..." -ForegroundColor Yellow
$npmProcesses = Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.ProcessName -eq "node" }
if ($npmProcesses) {
    Write-Host "Found running servers, shutting them down..." -ForegroundColor Yellow
    $npmProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
    Write-Host "Servers shut down" -ForegroundColor Green
}
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking for Node.js..." -ForegroundColor Yellow
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}
Write-Host "Node.js found" -ForegroundColor Green

# Navigate to the project root
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot
Write-Host "Working directory: $projectRoot" -ForegroundColor Green
Write-Host ""

# Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
if (Test-Path node_modules) {
    Write-Host "   Dependencies already installed" -ForegroundColor Gray
} else {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install backend dependencies" -ForegroundColor Red
        exit 1
    }
}
Write-Host "Backend dependencies installed" -ForegroundColor Green

# Make sure a .env with the MySQL credentials exists
if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "Created backend/.env from .env.example - set DB_PASSWORD in it and re-run this script." -ForegroundColor Red
    exit 1
}

# Setup database
Write-Host "Setting up database..." -ForegroundColor Yellow
node reset_db.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to set up database" -ForegroundColor Red
    exit 1
}
Write-Host "Database setup complete" -ForegroundColor Green
Write-Host ""

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location "$projectRoot/frontend"
if (Test-Path node_modules) {
    Write-Host "   Dependencies already installed" -ForegroundColor Gray
} else {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install frontend dependencies" -ForegroundColor Red
        exit 1
    }
}
Write-Host "Frontend dependencies installed" -ForegroundColor Green
Write-Host ""

# Launch backend server
Write-Host "Launching backend server..." -ForegroundColor Yellow
Set-Location "$projectRoot/backend"
Start-Process powershell -ArgumentList "cd '$projectRoot/backend'; npm start" -NoNewWindow
Write-Host "Backend server starting on http://localhost:5001" -ForegroundColor Green
Start-Sleep -Seconds 2

# Launch frontend server
Write-Host "Launching frontend server..." -ForegroundColor Yellow
Set-Location "$projectRoot/frontend"
Start-Process powershell -ArgumentList "cd '$projectRoot/frontend'; npm start" -NoNewWindow
Write-Host "Frontend server starting on http://localhost:3000" -ForegroundColor Green
Write-Host ""

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Setup complete! Servers are launching..." -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:5001" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: Both server windows will open in new terminals. Close them to stop the servers." -ForegroundColor Yellow
