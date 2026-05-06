# GPS Location Implementation - Quick Testing Guide

## Setup Instructions

### 1. Backend Setup
```bash
cd Backend

# Ensure MongoDB is running
# Check that location index is created in User model

# Restart server (will create geospatial index on startup)
npm start
# or
node server.js
```

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies if needed
npm install

# Start development server
npm start
```

---

## Testing Steps

### Test 1: Carpenter Registration with GPS

**Step 1.1:** Navigate to Registration
```
URL: http://localhost:3000/register
Click "Register as Carpenter"
or go directly to: http://localhost:3000/register/carpenter
```

**Step 1.2:** Fill Basic Information
```
- Name: Test Carpenter
- Email: carpenter@test.com
- Phone: 555-1234
- Address: 123 Main St
- Password: TestPass123
- Confirm Password: TestPass123
```

**Step 1.3:** Fill Carpenter Details
```
- Specialization: Furniture Making
- Years of Experience: 10
```

**Step 1.4:** Capture Location
```
1. Click "📍 Capture Location" button
2. Browser asks for permission to access location
3. Click "Allow" in the permission dialog
4. Button shows "🔍 Getting Location..." while loading
5. After ~3-5 seconds:
   - Success message appears: "✓ Location captured! (Accuracy: XXXm)"
   - Location box shows Latitude and Longitude
   - Example: Latitude: 40.712776, Longitude: -74.005974
```

**Step 1.5:** Submit Registration
```
1. Click "Register as Carpenter" button
2. Should redirect to /carpenterdashboard
3. Confirmation: Account created successfully
```

**Expected Results:**
- ✅ Carpenter registered with GPS location
- ✅ Location stored in MongoDB with coordinates and accuracy
- ✅ Timestamp recorded
- ✅ No errors in console

---

### Test 2: Verify Backend Storage

**Using MongoDB Client or Compass:**
```javascript
// Query user collection
db.users.findOne({ 
  email: "carpenter@test.com"
})

// Should return something like:
{
  _id: ObjectId(...),
  name: "Test Carpenter",
  email: "carpenter@test.com",
  role: "carpenter",
  specialization: "Furniture Making",
  experience: 10,
  location: {
    type: "Point",
    coordinates: [-74.005974, 40.712776],  // [longitude, latitude]
    latitude: 40.712776,
    longitude: -74.005974,
    accuracy: 25,
    timestamp: ISODate("2026-05-03T10:30:00Z")
  },
  isApproved: true
}
```

**Expected Results:**
- ✅ Location object exists with GeoJSON format
- ✅ Coordinates array has [longitude, latitude]
- ✅ All fields present: latitude, longitude, accuracy, timestamp
- ✅ Type is "Point"

---

### Test 3: View Carpenter Directory

**Step 3.1:** Access the Directory
```
Option 1: Click "🗺️ Carpenter Directory" in navbar
Option 2: Go directly to: http://localhost:3000/carpenter-directory
```

**Step 3.2:** Check Display
```
Should see:
- Title: "Carpenter Directory"
- Subtitle: "Find skilled carpenters in your area"
- Search box for specialization
- Sort dropdown (Sort by Name, Sort by Experience)
- Grid showing carpenters
```

**Step 3.3:** Verify Carpenter Card
```
Your created carpenter "Test Carpenter" should appear:
- Name: Test Carpenter
- Specialization: Furniture Making (in amber color)
- Stars: ⭐ 10 years experience
- Blue box with "📍 Location Verified"
  - Shows: Latitude: 40.712776
  - Shows: Longitude: -74.005974
  - Shows: Accuracy: 25m
- Contact info: 📞 555-1234
- Button: "View Details"
- Button: "🗺️ View on Map" (in location box)
```

**Expected Results:**
- ✅ Directory loads without errors
- ✅ Carpenter appears in grid
- ✅ Location data displays correctly
- ✅ All information is accurate
- ✅ Responsive layout works

---

### Test 4: Search and Filter

**Test 4.1:** Search by Specialization
```
1. Type "Furniture" in search box
2. Grid updates to show only matching carpenters
3. Carpenter with "Furniture Making" appears
4. Others filtered out
```

**Test 4.2:** Sort Options
```
1. Click "Sort by Experience"
2. Carpenters reorder by experience (highest first)
3. Click "Sort by Name"
4. Carpenters reorder alphabetically
```

**Test 4.3:** Result Count
```
- Text shows: "1 carpenter found" (or more if multiple)
- Updates when filters change
```

**Expected Results:**
- ✅ Search filters work correctly
- ✅ Sort options change order
- ✅ Result count updates
- ✅ No errors in console

---

### Test 5: Carpenter Details Modal

**Step 5.1:** Open Details
```
1. Click on any carpenter card in the grid
2. Modal popup appears with full details
```

**Step 5.2:** Check Modal Content
```
Modal should show:
- Carpenter name
- Specialization
- ⭐ Years of experience
- 📍 GPS Coordinates section with:
  - Latitude and Longitude (more precision)
  - Accuracy
  - Updated date
- Contact section:
  - 📞 Phone
  - ✉️ Email
- Address (if available)
- Buttons: "🗺️ Map" and "Close"
```

**Step 5.3:** View on Map
```
1. Click "🗺️ Map" button
2. New tab opens with Google Maps
3. Map shows the carpenter's location (red pin)
4. Address shown in bottom info box
```

**Expected Results:**
- ✅ Modal displays all information correctly
- ✅ Map opens with correct coordinates
- ✅ Google Maps loads properly
- ✅ Location marker placed accurately
- ✅ Close button works

---

### Test 6: API Endpoints

**Using curl or Postman:**

**Test 6.1:** Get All Carpenters
```bash
curl http://localhost:8000/api/users/carpenters
```

**Expected Response:**
```json
[
  {
    "_id": "...",
    "name": "Test Carpenter",
    "specialization": "Furniture Making",
    "experience": 10,
    "phone": "555-1234",
    "email": "carpenter@test.com",
    "location": {
      "type": "Point",
      "coordinates": [-74.005974, 40.712776],
      "latitude": 40.712776,
      "longitude": -74.005974,
      "accuracy": 25,
      "timestamp": "2026-05-03T10:30:00Z"
    }
  }
]
```

**Test 6.2:** Find Nearby Carpenters
```bash
curl "http://localhost:8000/api/users/carpenters/nearby?latitude=40.712776&longitude=-74.005974&maxDistance=5000"
```

**Expected Response:**
```json
[
  {
    "name": "Test Carpenter",
    "location": { ... }
  }
]
```

**Expected Results:**
- ✅ API returns all carpenters with location
- ✅ Nearby endpoint finds carpenters within radius
- ✅ JSON format is valid
- ✅ No server errors (HTTP 200)

---

### Test 7: Mobile Responsiveness

**Step 7.1:** Test on Mobile
```
1. Open http://localhost:3000/carpenter-directory on mobile
2. Or use Chrome DevTools > Toggle device toolbar
3. Test on iPhone (375px), iPad (768px), Desktop (1920px)
```

**Step 7.2:** Check Mobile Display
```
- Grid should be 1 column on mobile
- 2 columns on tablet
- 3 columns on desktop
- Search box responsive
- Cards readable on small screens
- Touch-friendly buttons
```

**Step 7.3:** Test Mobile Menu
```
1. On mobile, click hamburger menu
2. Should see "🗺️ Carpenter Directory" option
3. Click to navigate to directory
```

**Expected Results:**
- ✅ Layout responsive on all sizes
- ✅ Text readable
- ✅ Touch targets adequate
- ✅ No horizontal scroll
- ✅ Mobile menu works

---

### Test 8: Error Handling

**Test 8.1:** Location Permission Denied
```
1. During registration, click "Capture Location"
2. In browser permission dialog, click "Block" or "Deny"
3. Error message appears: "Location permission denied..."
4. Registration can continue without location
5. Proceed to submit
```

**Expected Results:**
- ✅ Error handled gracefully
- ✅ User can still register without location
- ✅ No console errors
- ✅ Clear error message shown

**Test 8.2:** No Geolocation Support
```
1. In old browser without Geolocation API
2. Click "Capture Location"
3. Error message: "Geolocation is not supported..."
```

**Expected Results:**
- ✅ Error handled
- ✅ Clear message to user
- ✅ No crash

**Test 8.3:** Empty Directory
```
1. If no carpenters exist with locations
2. Directory should show: "No carpenters available"
3. No errors, clean message
```

**Expected Results:**
- ✅ Graceful empty state
- ✅ Clear message
- ✅ No errors

---

### Test 9: Navigation Links

**Test 9.1:** Desktop Menu
```
1. Look for "🗺️ Carpenter Directory" in navbar
2. Should appear between "All Carpenters" and cart icon
3. Click to navigate to directory
```

**Test 9.2:** Mobile Menu
```
1. Click hamburger menu on mobile
2. Scroll to find "🗺️ Carpenter Directory"
3. Click to navigate
4. Menu closes automatically
```

**Expected Results:**
- ✅ Links visible in both menus
- ✅ Correct route on click
- ✅ Mobile menu closes properly

---

## Browser Compatibility Testing

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

**Note:** Geolocation may not work on:
- Private/Incognito windows
- Websites without HTTPS (except localhost)
- Browsers without permission granted

---

## Console Checks

### Expected Logs (No Errors):

**During Registration:**
```
"Getting Location..." // shown to user
"Location captured!" // success message
"Submitting carpenter registration: {...}"
```

**Directory Load:**
```
"Loading carpenter directory..."
"Successfully fetched carpenters"
// No error messages
```

### Watch for Errors:
- ❌ "Cannot read property 'latitude' of null"
- ❌ "API call failed"
- ❌ "undefined is not an object"
- ❌ Network errors (404, 500)

---

## Common Issues and Fixes

### Issue: Geolocation permission stuck
**Solution:** 
- Clear site data and refresh
- Check site settings in browser
- On Chrome: Settings > Privacy > Site settings > Location

### Issue: Coordinates not saving
**Solution:**
- Check MongoDB connection
- Verify location index created: `db.users.getIndexes()`
- Check backend logs for errors

### Issue: Map not opening
**Solution:**
- Ensure latitude/longitude are numbers, not strings
- Check Google Maps domain access
- Verify internet connection

### Issue: Carpenters not showing
**Solution:**
- Verify carpenters exist: `db.users.find({role: "carpenter"})`
- Check isApproved flag is true
- Verify API response: check Network tab in DevTools

### Issue: CORS errors
**Solution:**
- Check backend CORS configuration
- Verify API_BASE_URL matches server
- Clear browser cache

---

## Performance Testing

### Load Time Targets:
- Page load: < 2 seconds
- Carpenter list render: < 500ms
- Modal open: < 300ms
- Map open: < 1 second

### Monitor:
```javascript
// In browser console
performance.measure('test')
performance.getEntriesByType('navigation')
```

---

## Success Criteria

All tests ✅ when:
1. ✅ Carpenter can capture location during registration
2. ✅ Location stores in MongoDB correctly
3. ✅ Carpenter directory displays all carpenters
4. ✅ Location data shows accurately
5. ✅ Search and sort work correctly
6. ✅ Details modal opens and displays correctly
7. ✅ Map opens with correct location
8. ✅ Mobile responsive works
9. ✅ No console errors
10. ✅ Navigation links work
11. ✅ Error handling works gracefully
12. ✅ API endpoints return correct data

---

## Reporting Issues

If you find any issues:

1. **Note the error:**
   - Exact error message
   - Steps to reproduce
   - Browser and OS
   - Console errors

2. **Check logs:**
   - Backend console output
   - Browser DevTools console
   - Network tab in DevTools

3. **Verify data:**
   - Check MongoDB directly
   - Verify API responses
   - Inspect element in DevTools

4. **Provide evidence:**
   - Screenshots
   - Console error logs
   - Network requests/responses
   - User data (anonymized)

---

**Testing Checklist Complete! ✅**

All systems should be ready for:
- User acceptance testing (UAT)
- Integration with production database
- Live deployment
- Customer feedback collection
