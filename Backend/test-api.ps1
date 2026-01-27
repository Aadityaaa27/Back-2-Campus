# Test Script for OTP Login System

## Test 1: Send OTP

$sendOtpBody = @{
    email = "test@example.com"
    name  = "Test User"
} | ConvertTo-Json

Write-Host "`n=== Testing Send OTP ===" -ForegroundColor Cyan
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/send-otp" `
    -Method Post `
    -ContentType "application/json" `
    -Body $sendOtpBody | ConvertTo-Json -Depth 10

Write-Host "`n✅ OTP sent! Check your email for the OTP code." -ForegroundColor Green
Write-Host "Then enter it below to test verification.`n" -ForegroundColor Yellow

# Uncomment below to test OTP verification (replace with actual OTP)
<#
## Test 2: Verify OTP

$otp = Read-Host "Enter the OTP you received"

$verifyOtpBody = @{
    email = "test@example.com"
    otp = $otp
} | ConvertTo-Json

Write-Host "`n=== Testing Verify OTP ===" -ForegroundColor Cyan
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/verify-otp" `
    -Method Post `
    -ContentType "application/json" `
    -Body $verifyOtpBody

$response | ConvertTo-Json -Depth 10

$token = $response.token
Write-Host "`n✅ Login successful! Token received." -ForegroundColor Green

## Test 3: Get Profile (Protected Route)

Write-Host "`n=== Testing Get Profile (Protected) ===" -ForegroundColor Cyan
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/profile" `
    -Method Get `
    -Headers @{Authorization = "Bearer $token"} | ConvertTo-Json -Depth 10

Write-Host "`n✅ All tests passed!" -ForegroundColor Green
#>
