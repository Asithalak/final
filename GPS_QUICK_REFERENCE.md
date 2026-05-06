# GPS Location Feature - Quick Reference

## Overview
Carpenters can now capture their GPS location during registration, and customers can view all carpenters on a public directory with location information.

---

## Key Files

| File | Purpose | Key Changes |
|------|---------|-------------|
| `frontend/src/pages/RegisterUser.js` | Carpenter registration | Added GPS capture button, location display, handleGetLocation() |
| `frontend/src/pages/CarpenterDirectory.js` | Public directory | New page showing all carpenters with locations, search, sort, map links |
| `frontend/src/App.js` | Routes | Added CarpenterDirectory import and /carpenter-directory route |
| `frontend/src/components/Navbar.js` | Navigation | Added links to carpenter directory (desktop and mobile) |
| `Backend/models/User.js` | User schema | Added location object with GeoJSON format, geospatial index |
| `Backend/routes/auth.js` | Auth API | Receives and stores GPS location during carpenter registration |
| `Backend/routes/users.js` | Users API | Added /carpenters and /carpenters/nearby endpoints |

---

## Feature Workflow

### For Carpenters
```
Register → Fill Details → Capture Location → Submit → Account Created
                                ↓
                    Browser Geolocation API
                         ↓
                   Show Coordinates
                         ↓
                   Store with Timestamp
```

### For Customers
```
View Directory → Search/Sort → Select Carpenter → View Details → Open Map
       ↓                                                               ↓
   Grid View                                              Google Maps (Read-only)
```

---

## API Endpoints

### Public Endpoints

#### 1. Get All Carpenters
```
GET /api/users/carpenters
```
Returns all approved carpenters with location data.

**Response:**
```json
[
  {
    "_id": "...",
    "name": "John Smith",
    "specialization": "Furniture Making",
    "experience": 10,
    "phone": "555-1234",
    "email": "john@example.com",
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

#### 2. Find Nearby Carpenters
```
GET /api/users/carpenters/nearby?latitude=40.7&longitude=-74.0&maxDistance=5000
```
Find carpenters within X meters of coordinates.

**Parameters:**
- `latitude` (required): Decimal latitude
- `longitude` (required): Decimal longitude  
- `maxDistance` (optional): Distance in meters (default: 10000)

**Response:** Same format as above, filtered by proximity

#### 3. Get Carpenter By ID
```
GET /api/users/carpenters/:id
```
Get full details for a specific carpenter.

---

## Frontend Components

### RegisterUser.js - GPS Capture
```javascript
// New State
const [formData, setFormData] = useState({
  // ... existing fields ...
  latitude: null,
  longitude: null,
  accuracy: null
});

const [geoLoading, setGeoLoading] = useState(false);
const [geoError, setGeoError] = useState('');
const [geoSuccess, setGeoSuccess] = useState('');

// New Function
const handleGetLocation = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      // Store coordinates
      setFormData({...formData, latitude, longitude, accuracy});
      setGeoSuccess('✓ Location captured!');
    },
    (error) => {
      setGeoError('Failed to get location');
    }
  );
};

// UI Element
<div className="📍 Work Location (GPS)">
  <button onClick={handleGetLocation}>
    📍 Capture Location
  </button>
  {geoSuccess && <div className="success">{geoSuccess}</div>}
  {geoError && <div className="error">{geoError}</div>}
  {latitude && <div>
    Latitude: {latitude.toFixed(6)}
    Longitude: {longitude.toFixed(6)}
  </div>}
</div>
```

### CarpenterDirectory.js - Key Functions
```javascript
// Fetch all carpenters
const fetchCarpenters = async () => {
  const response = await axios.get('/api/users/carpenters');
  setCarpenters(response.data);
};

// Open on Google Maps
const openInMaps = (carpenter) => {
  const url = `https://maps.google.com/?q=${lat},${lon}`;
  window.open(url, '_blank');
};

// Calculate distance (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Returns distance in km
};

// Search and sort
const filteredCarpenters = carpenters
  .filter(c => c.specialization.includes(search))
  .sort((a, b) => ...);
```

---

## Database Schema

### User Model - Location Field
```javascript
location: {
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point'
  },
  coordinates: [Number],        // [longitude, latitude]
  latitude: Number,
  longitude: Number,
  accuracy: Number,              // in meters
  timestamp: Date
}
```

### Geospatial Index
```javascript
userSchema.index({ 'location.coordinates': '2dsphere' });
```

---

## Navigation

### How to Access
- **Navbar:** Click "🗺️ Carpenter Directory" (desktop/mobile menu)
- **Direct URL:** `http://localhost:3000/carpenter-directory`
- **Mobile:** Click hamburger menu → "🗺️ Carpenter Directory"

### Menu Structure
```
Navbar
├── Home
├── Brands
├── Offers  
├── Gallery
├── All Carpenters
├── 🗺️ Carpenter Directory  ← New
└── Cart
```

---

## Features

### Search
- Type specialization name (e.g., "Furniture")
- Filters grid in real-time
- Shows result count

### Sort
- **By Name:** Alphabetical A-Z
- **By Experience:** Highest experience first

### Location Display
```
📍 Location Verified
Latitude: 40.712776
Longitude: -74.005974
Accuracy: 25m

[🗺️ View on Map]
```

### Carpenter Card
Shows:
- Name
- Specialization (amber badge)
- ⭐ Years of experience
- 📍 Location status
- 📞 Phone
- ✉️ Email
- [View Details] button

### Details Modal
- Full carpenter information
- Complete GPS coordinates
- Contact details
- Address
- Timestamp when location was captured
- [🗺️ Map] button to open Google Maps
- [Close] button

---

## Geolocation Permissions

### Desktop Browsers
```
1. User clicks "📍 Capture Location"
2. Browser shows permission dialog
3. User selects "Allow" or "Block"
4. If allowed → coordinates captured
5. If blocked → error message shown
```

### Mobile Browsers
```
Same flow as desktop
iOS Safari: Settings > Privacy > Location Services
Android Chrome: App Settings > Permissions > Location
```

### Error Messages
| Error | Cause | Solution |
|-------|-------|----------|
| "Geolocation is not supported" | Old browser | Use modern browser |
| "Location permission denied" | User blocked | Enable in settings |
| "Position unavailable" | No GPS signal | Try in different location |
| "Location request timed out" | Slow GPS | Try again |

---

## Response Format

### Carpenter Object
```javascript
{
  _id: ObjectId,
  name: String,                    // "John Smith"
  email: String,                   // "john@example.com"
  phone: String,                   // "555-1234"
  address: String,                 // "123 Main St"
  specialization: String,          // "Furniture Making"
  experience: Number,              // 10
  isApproved: Boolean,            // true
  location: {                      // Optional
    type: "Point",
    coordinates: [Number, Number], // [lon, lat]
    latitude: Number,              // 40.712776
    longitude: Number,             // -74.005974
    accuracy: Number,              // 25 (meters)
    timestamp: Date                // 2026-05-03T10:30:00Z
  }
}
```

---

## State Management

### RegisterUser.js
```javascript
// GPS-related state
formData.latitude
formData.longitude
formData.accuracy
geoLoading        // Button state
geoError          // Error messages
geoSuccess        // Success messages
```

### CarpenterDirectory.js
```javascript
carpenters        // All carpenters from API
loading           // Page loading state
error             // Error message
selectedCarpenter // Modal carpenter
searchSpecialization // Search text
sortBy            // 'name' or 'experience'
```

---

## Error Handling

### Frontend Validation
- ✅ GPS coordinates captured with accuracy
- ✅ Only approved carpenters shown
- ✅ Graceful error messages for all scenarios
- ✅ No console errors with proper logging

### Backend Validation
- ✅ Location must be valid GeoJSON
- ✅ Coordinates must be numbers
- ✅ Only return approved carpenters
- ✅ Proximity queries optimized with index

---

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Yes | All versions >= 50 |
| Firefox | ✅ Yes | All versions >= 50 |
| Safari | ✅ Yes | iOS 13.3+, macOS 10.15+ |
| Edge | ✅ Yes | All versions |
| IE 11 | ❌ No | Geolocation API not supported |

---

## HTTPS Requirement

**Production:**
- Geolocation requires HTTPS
- Throws "insecure context" error on HTTP

**Development:**
- Works on `http://localhost`
- Works on `127.0.0.1`
- Won't work on remote HTTP (non-HTTPS)

---

## Performance Notes

- Geolocation request: ~1-3 seconds
- Directory load: ~500ms (network dependent)
- Search/filter: Instant (client-side)
- Map open: ~1-2 seconds (depends on internet)

---

## Privacy Considerations

✅ **Implemented:**
- User explicitly grants permission
- No background tracking
- Location only stored if carpenter captures it
- Can be left empty (optional)
- Only approved carpenters shown publicly

⚠️ **Considerations:**
- GPS data is precise to ~25 meters
- Timestamp shows when location was captured
- Consider privacy regulations (GDPR, etc.)

---

## Troubleshooting

### Geolocation Not Working
1. Check HTTPS (or localhost)
2. Check browser permissions
3. Check Geolocation API availability
4. Check internet connection

### Directory Not Loading
1. Check API endpoint: `/api/users/carpenters`
2. Check MongoDB connection
3. Check network requests (DevTools)
4. Check backend logs

### Location Not Saving
1. Verify MongoDB is running
2. Check geospatial index exists
3. Verify location object structure
4. Check backend console logs

### Map Not Opening
1. Check coordinates are valid numbers
2. Check internet connection
3. Check Google domain access
4. Try in different browser

---

## Testing URLs

```
Registration:      http://localhost:3000/register/carpenter
Directory:         http://localhost:3000/carpenter-directory
API - All:         http://localhost:8000/api/users/carpenters
API - Nearby:      http://localhost:8000/api/users/carpenters/nearby?latitude=40.7&longitude=-74.0
```

---

## Quick Checklist

- [x] Frontend GPS capture UI added
- [x] Backend location storage implemented
- [x] Database schema and index created
- [x] Public carpenter directory built
- [x] Search and sort functionality
- [x] Google Maps integration
- [x] Error handling and validation
- [x] Responsive mobile design
- [x] Navigation links added
- [x] Documentation complete

---

**All Features Complete and Ready for Testing! ✅**
