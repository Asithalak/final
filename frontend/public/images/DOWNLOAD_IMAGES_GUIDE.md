# 📸 Furniture Images Download Guide

## 🎯 Overview
This guide will help you obtain high-quality images for all 35 furniture items in your catalog.

## 📁 Folder Structure Created
```
frontend/public/images/furniture/
├── chairs/      (5 items × 5 images = 25 images)
├── tables/      (5 items × 5 images = 25 images)
├── sofas/       (5 items × 5 images = 25 images)
├── beds/        (5 items × 5 images = 25 images)
├── cabinets/    (5 items × 5 images = 25 images)
├── desks/       (5 items × 5 images = 25 images)
└── shelves/     (5 items × 5 images = 25 images)

Total: 175 images needed
```

---

## 🚀 Quick Method: Use Unsplash URLs (Recommended)

I'll update the furniture_catalog.json to use Unsplash image URLs that will work immediately without downloading.

**Advantages:**
- ✅ No download needed
- ✅ High-quality professional images
- ✅ Free to use
- ✅ Works instantly

---

## 📥 Alternative: Download Your Own Images

### Option 1: Free Stock Photo Sites

**Unsplash** (unsplash.com)
- Search: "modern chair", "dining table", "sofa", etc.
- Download high resolution (1920×1080 or similar)
- Rename files according to catalog

**Pexels** (pexels.com)
- Search: furniture categories
- Free license for commercial use
- Good variety

**Pixabay** (pixabay.com)
- Free images
- No attribution required

### Option 2: Use AI Image Generation

**Bing Image Creator** (bing.com/create)
- Generate custom furniture images
- High quality
- Unique designs

**Leonardo.ai** (leonardo.ai)
- Professional quality
- Customizable

### Option 3: Take Your Own Photos

If you have actual furniture:
1. Use good lighting (natural light is best)
2. Clean background
3. Multiple angles (front, side, back, detail, lifestyle)
4. Use smartphone or camera
5. Edit for brightness/contrast

---

## 📋 Image Naming Convention

Each item needs 5 images following this pattern:

### Chairs (chair-001 to chair-005)
```
chair-001-front.jpg
chair-001-side.jpg
chair-001-back.jpg
chair-001-detail.jpg
chair-001-lifestyle.jpg
```

### Tables (table-001 to table-005)
```
table-001-top.jpg
table-001-angle.jpg
table-001-detail.jpg
table-001-legs.jpg
table-001-lifestyle.jpg
```

### Sofas (sofa-001 to sofa-005)
```
sofa-001-front.jpg
sofa-001-angle.jpg
sofa-001-side.jpg
sofa-001-detail.jpg
sofa-001-lifestyle.jpg
```

### Beds (bed-001 to bed-005)
```
bed-001-front.jpg
bed-001-angle.jpg
bed-001-headboard.jpg
bed-001-detail.jpg
bed-001-lifestyle.jpg
```

### Cabinets (cabinet-001 to cabinet-005)
```
cabinet-001-front.jpg
cabinet-001-open.jpg
cabinet-001-side.jpg
cabinet-001-detail.jpg
cabinet-001-lifestyle.jpg
```

### Desks (desk-001 to desk-005)
```
desk-001-front.jpg
desk-001-angle.jpg
desk-001-drawers.jpg (or other view)
desk-001-detail.jpg
desk-001-lifestyle.jpg
```

### Shelves (shelf-001 to shelf-005)
```
shelf-001-front.jpg
shelf-001-angle.jpg
shelf-001-mounted.jpg (or other view)
shelf-001-detail.jpg
shelf-001-lifestyle.jpg
```

---

## 🎨 Image Specifications

### Recommended Dimensions:
- **Width:** 800-1200px
- **Height:** 600-900px
- **Aspect Ratio:** 4:3 or 16:9
- **Format:** JPG or PNG
- **File Size:** < 500KB per image (optimize for web)

### Image Types Explained:
1. **Front View:** Direct front-facing shot
2. **Angle/Side:** 45° or side view
3. **Back/Top:** Rear or overhead view
4. **Detail:** Close-up of materials, joints, finish
5. **Lifestyle:** Furniture in a room setting

---

## 💡 Quick Search Terms for Each Category

### Chairs
- "modern ergonomic office chair"
- "classic wooden dining chair"
- "rustic farmhouse chair"
- "executive leather chair"
- "minimalist lounge chair"

### Tables
- "rectangular oak dining table"
- "round coffee table wood"
- "industrial workbench table"
- "extendable console table"
- "glass top side table"

### Sofas
- "contemporary 3 seater sofa"
- "L shaped sectional sofa"
- "vintage chesterfield sofa"
- "modern loveseat"
- "scandinavian style sofa"

### Beds
- "king size platform bed"
- "upholstered headboard bed"
- "four poster bed wooden"
- "storage bed with drawers"
- "minimalist japanese bed"

### Cabinets
- "modern display cabinet glass"
- "rustic storage cabinet wood"
- "mid century sideboard"
- "industrial metal cabinet"
- "corner china cabinet"

### Desks
- "executive writing desk mahogany"
- "standing desk bamboo"
- "L shaped corner desk"
- "minimalist floating desk"
- "secretary drop front desk"

### Shelves
- "floating wall shelves oak"
- "ladder bookshelf"
- "industrial pipe shelf"
- "corner display shelf"
- "modular cube storage"

---

## 🔧 PowerShell Script to Download from URLs

If you have image URLs, use this script:

```powershell
# Save as download-images.ps1
# Run: .\download-images.ps1

$images = @(
    @{url="YOUR_URL_HERE"; path="public\images\furniture\chairs\chair-001-front.jpg"}
    # Add more URLs...
)

foreach ($img in $images) {
    Write-Host "Downloading $($img.path)..."
    Invoke-WebRequest -Uri $img.url -OutFile $img.path
}

Write-Host "Download complete!"
```

---

## ✅ Next Steps

**I recommend using Method 1** (Unsplash URLs) which I'll implement now:
1. ✅ Folder structure created
2. ⏳ Update furniture_catalog.json with Unsplash URLs
3. ⏳ Images will load automatically from CDN
4. ⏳ No manual download needed

**If you prefer Method 2** (Local images):
1. Download images from Unsplash/Pexels
2. Rename them according to naming convention
3. Place in correct folders
4. Images will automatically work (paths already set in catalog)

---

## 🎯 Current Status

✅ Folder structure created at:
`D:\final\frontend\public\images\furniture\`

⏳ Awaiting your choice:
- **Option A:** I'll update catalog with Unsplash URLs (instant, recommended)
- **Option B:** You download images manually and place in folders

Let me know which option you prefer!
