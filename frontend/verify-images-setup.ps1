# 🎨 Furniture Images Setup Verification Script
# This script verifies that all images and folders are set up correctly

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   🎨 Furniture Images Setup Verification                  ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$baseFolder = "public\images\furniture"
$catalogFile = "src\data\furniture_catalog.json"

# Check if we're in the frontend folder
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Please run this script from the frontend folder" -ForegroundColor Red
    Write-Host "   Run: cd frontend" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Current directory verified: frontend folder" -ForegroundColor Green
Write-Host ""

# Check folder structure
Write-Host "📁 Checking folder structure..." -ForegroundColor Yellow
Write-Host ""

$categories = @("chairs", "tables", "sofas", "beds", "cabinets", "desks", "shelves")
$foldersOK = $true

foreach ($category in $categories) {
    $folderPath = Join-Path $baseFolder $category
    if (Test-Path $folderPath) {
        Write-Host "   ✅ $folderPath" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $folderPath (MISSING)" -ForegroundColor Red
        $foldersOK = $false
    }
}

Write-Host ""

# Check catalog file
Write-Host "📄 Checking furniture catalog..." -ForegroundColor Yellow
Write-Host ""

if (Test-Path $catalogFile) {
    Write-Host "   ✅ $catalogFile exists" -ForegroundColor Green
    
    # Read and parse JSON
    try {
        $catalog = Get-Content $catalogFile -Raw | ConvertFrom-Json
        
        # Count items and images
        $totalItems = 0
        $totalImages = 0
        $unsplashCount = 0
        
        Write-Host ""
        Write-Host "📊 Catalog Statistics:" -ForegroundColor Cyan
        Write-Host ""
        
        foreach ($category in $categories) {
            $items = $catalog.$category
            $itemCount = $items.Count
            $imageCount = 0
            
            foreach ($item in $items) {
                $imageCount += $item.images.Count
                foreach ($img in $item.images) {
                    if ($img -like "*unsplash.com*") {
                        $unsplashCount++
                    }
                }
            }
            
            $totalItems += $itemCount
            $totalImages += $imageCount
            
            Write-Host "   🪑 $($category.PadRight(10)) - $itemCount items, $imageCount images" -ForegroundColor White
        }
        
        Write-Host ""
        Write-Host "   ═══════════════════════════════════════════" -ForegroundColor Gray
        Write-Host "   📦 Total Items:      $totalItems" -ForegroundColor Cyan
        Write-Host "   🖼️  Total Images:     $totalImages" -ForegroundColor Cyan
        Write-Host "   🌐 Unsplash URLs:    $unsplashCount" -ForegroundColor Cyan
        Write-Host "   ═══════════════════════════════════════════" -ForegroundColor Gray
        Write-Host ""
        
        # Validation
        if ($totalItems -eq 35 -and $totalImages -eq 175 -and $unsplashCount -eq 175) {
            Write-Host "   ✅ All images configured correctly!" -ForegroundColor Green
            $catalogOK = $true
        } else {
            Write-Host "   ⚠️  Warning: Expected 35 items, 175 images, 175 Unsplash URLs" -ForegroundColor Yellow
            Write-Host "   📊 Found: $totalItems items, $totalImages images, $unsplashCount Unsplash URLs" -ForegroundColor Yellow
            $catalogOK = $false
        }
        
    } catch {
        Write-Host "   ❌ Error parsing JSON: $_" -ForegroundColor Red
        $catalogOK = $false
    }
} else {
    Write-Host "   ❌ $catalogFile NOT FOUND" -ForegroundColor Red
    $catalogOK = $false
}

Write-Host ""

# Check UI components
Write-Host "🎨 Checking UI components..." -ForegroundColor Yellow
Write-Host ""

$components = @{
    "CarpenterDashboard" = "src\components\dashboard\CarpenterDashboard.js"
    "MyFurnitureDesigns" = "src\pages\MyFurnitureDesigns.js"
    "FurnitureGallery" = "src\components\FurnitureGallery.js"
    "App" = "src\App.js"
}

$componentsOK = $true

foreach ($component in $components.GetEnumerator()) {
    if (Test-Path $component.Value) {
        Write-Host "   ✅ $($component.Key.PadRight(20)) ($($component.Value))" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $($component.Key.PadRight(20)) MISSING" -ForegroundColor Red
        $componentsOK = $false
    }
}

Write-Host ""

# Check documentation
Write-Host "📚 Checking documentation..." -ForegroundColor Yellow
Write-Host ""

$docs = @(
    "IMAGES_IMPLEMENTATION_COMPLETE.md",
    "QUICK_REFERENCE_IMAGES.md",
    "IMAGES_SETUP_COMPLETE.md",
    "public\images\DOWNLOAD_IMAGES_GUIDE.md",
    "public\images\test-images.html"
)

foreach ($doc in $docs) {
    if (Test-Path $doc) {
        Write-Host "   ✅ $doc" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  $doc (Optional)" -ForegroundColor Yellow
    }
}

Write-Host ""

# Final summary
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                    VERIFICATION SUMMARY                    ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

if ($foldersOK -and $catalogOK -and $componentsOK) {
    Write-Host "   🎉 SUCCESS! Everything is set up correctly!" -ForegroundColor Green
    Write-Host ""
    Write-Host "   ✅ Folder structure complete" -ForegroundColor Green
    Write-Host "   ✅ Catalog with 175 images ready" -ForegroundColor Green
    Write-Host "   ✅ UI components in place" -ForegroundColor Green
    Write-Host "   ✅ Documentation available" -ForegroundColor Green
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║                  🚀 READY TO LAUNCH! 🚀                    ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    Write-Host "   Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Run: npm start" -ForegroundColor White
    Write-Host "   2. Visit: http://localhost:3000/dashboard" -ForegroundColor White
    Write-Host "   3. Click: 'My Furniture Designs' tab" -ForegroundColor White
    Write-Host "   4. Enjoy: Beautiful furniture images! ✨" -ForegroundColor White
    Write-Host ""
    Write-Host "   Test page: http://localhost:3000/images/test-images.html" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "   ⚠️  Some issues detected:" -ForegroundColor Yellow
    Write-Host ""
    if (-not $foldersOK) { Write-Host "   ❌ Folder structure incomplete" -ForegroundColor Red }
    if (-not $catalogOK) { Write-Host "   ❌ Catalog configuration issues" -ForegroundColor Red }
    if (-not $componentsOK) { Write-Host "   ❌ UI components missing" -ForegroundColor Red }
    Write-Host ""
    Write-Host "   📖 Check documentation for troubleshooting" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Gray
Write-Host ""
