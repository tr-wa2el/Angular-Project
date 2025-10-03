# Movie App - Component Generator Script
# Run this script to generate all required components

Write-Host "🎬 Generating Movie App Components..." -ForegroundColor Green

# Navigate to src/app
Set-Location -Path "src/app"

# Create Pages
Write-Host "`n📄 Creating Page Components..." -ForegroundColor Yellow
ng generate component pages/movies-list --standalone --skip-tests
ng generate component pages/movie-details --standalone --skip-tests
ng generate component pages/wishlist --standalone --skip-tests
ng generate component pages/search-results --standalone --skip-tests
ng generate component pages/login --standalone --skip-tests
ng generate component pages/register --standalone --skip-tests
ng generate component pages/account --standalone --skip-tests
ng generate component pages/not-found --standalone --skip-tests

# Create Shared Components
Write-Host "`n🔧 Creating Shared Components..." -ForegroundColor Yellow
ng generate component components/loading-spinner --standalone --skip-tests
ng generate component components/back-to-top --standalone --skip-tests
ng generate component components/skeleton-loader --standalone --skip-tests
ng generate component components/pagination --standalone --skip-tests
ng generate component components/genre-filter --standalone --skip-tests
ng generate component components/sort-dropdown --standalone --skip-tests
ng generate component components/movie-trailer --standalone --skip-tests

# Create Pipes
Write-Host "`n🔄 Creating Pipes..." -ForegroundColor Yellow
ng generate pipe pipes/safe-url --standalone --skip-tests
ng generate pipe pipes/runtime --standalone --skip-tests

# Create Guards
Write-Host "`n🔒 Creating Guards..." -ForegroundColor Yellow
ng generate guard guards/auth --functional --skip-tests

Write-Host "`n✅ All components generated successfully!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Update TMDB API key in src/environments/environment.ts"
Write-Host "2. Implement component logic using IMPLEMENTATION_GUIDE.md"
Write-Host "3. Run 'npm start' to test the application"
Write-Host "4. Commit changes to Git regularly"
Write-Host "`nHappy coding! 🚀" -ForegroundColor Green
