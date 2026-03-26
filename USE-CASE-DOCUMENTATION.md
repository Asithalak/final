# Online Furniture Showroom System - Use Case Documentation

## System Overview
මෙම Online Furniture Showroom System එක යනු customers, carpenters සහ admins යන ත්‍රිපාර්ශ්වික පරිශීලක පිරිසක් සමඟ ක්‍රියාත්මක වන සම්පූර්ණ furniture e-commerce platform එකකි.

## System Actors (පද්ධතියේ ක්‍රියාකාරීන්)

### 1. Guest (අමුත්තා)
- ලියාපදිංචි නොවූ පරිශීලකයා
- සීමිත ප්‍රවේශය ඇත

### 2. Customer (ගනුදෙනුකරු)
- ලියාපදිංචි වූ සාමාන්‍ය පරිශීලකයා
- Furniture මිලදී ගැනීමට හැකියාව

### 3. Carpenter (වඩු කාර්මිකයා)
- නිර්මාණ සහ සම්පත් විකිණීමේ හැකියාව
- විශේෂ අනුමැතිය සහිත account එකක්

### 4. Admin (පරිපාලකයා)
- සම්පූර්ණ පද්ධති පාලනය
- සියලුම අනුමැති සහ කළමනාකරණ කටයුතු

---

## Use Case Categories (භාවිත අවස්ථා කාණ්ඩ)

### A. Authentication & User Management (සත්‍යාපනය සහ පරිශීලක කළමනාකරණය)

#### UC01: Register (ලියාපදිංචි වීම)
- **Actors:** Customer, Carpenter
- **Description:** නව ගිණුමක් සාදා ගැනීම
- **Pre-condition:** පරිශීලකයා ලියාපදිංචි නොවිය යුතුය
- **Post-condition:** නව user account එකක් සාදනු ලැබේ
- **Main Flow:**
  1. පරිශීලකයා register form එක පුරවයි
  2. System email validation කරයි
  3. Password hash කරයි
  4. Database එකේ user account සාදයි
  5. JWT token එකක් generate කරයි

#### UC02: Login (පිවිසීම)
- **Actors:** Customer, Carpenter, Admin
- **Description:** පද්ධතියට ප්‍රවේශ වීම
- **Flow:**
  1. Email සහ password ඇතුළත් කරන්න
  2. Credentials සත්‍යාපනය කරන්න
  3. JWT token අදාළ කරන්න
  4. User dashboard එකට redirect කරන්න

#### UC03: Update Profile (Profile යාවත්කාලීන කිරීම)
- **Actors:** Customer, Carpenter, Admin
- **Description:** තමන්ගේ profile විස්තර වෙනස් කිරීම
- **Flow:**
  1. Profile page එකට navigate කරන්න
  2. විස්තර වෙනස් කරන්න (name, phone, address, etc.)
  3. Changes save කරන්න

#### UC04: Approve Carpenter (වඩු කාර්මිකයා අනුමත කිරීම)
- **Actors:** Admin
- **Description:** Carpenter registrations අනුමත කිරීම
- **Flow:**
  1. Pending carpenter list බලන්න
  2. Carpenter විස්තර සමාලෝචනය කරන්න
  3. Approve/Reject කරන්න

#### UC05: Manage Users (පරිශීලකයින් කළමනාකරණය)
- **Actors:** Admin
- **Description:** සියලුම users view, edit, delete කිරීම

#### UC06: View User Statistics (පරිශීලක සංඛ්‍යාන බැලීම)
- **Actors:** Admin
- **Description:** Total users, customers, carpenters ගණන බලන්න

---

### B. Furniture Management (ගෘහ භාණ්ඩ කළමනාකරණය)

#### UC10: Browse Furniture Catalogue (ගෘහ භාණ්ඩ නාමාවලිය පිරික්සීම)
- **Actors:** Guest, Customer, Carpenter, Admin
- **Description:** පද්ධතියේ furniture items බලන්න
- **Flow:**
  1. Catalogue page එකට navigate කරන්න
  2. සියලුම approved furniture පෙන්වයි
  3. Categories අනුව organized වූවා

#### UC11: Search & Filter Furniture (සොයා පෙරීම)
- **Actors:** Guest, Customer, Carpenter, Admin
- **Description:** නිශ්චිත furniture සෙවීම
- **Filters Available:**
  - Category (chairs, tables, beds, etc.)
  - Price range
  - Keywords search
  - Brand

#### UC12: View Furniture Details (විස්තර බලන්න)
- **Actors:** All
- **Description:** තනි furniture item එකක සම්පූර්ණ විස්තර
- **Information Shown:**
  - නම, විස්තරය, මිල
  - සිතුවම්
  - Materials භාවිතා කළ ඒවා
  - Dimensions
  - Carpenter විස්තර
  - Reviews සහ Ratings

#### UC13: Upload Furniture Design (නිර්මාණය උඩුගත කිරීම)
- **Actors:** Carpenter
- **Description:** නව furniture design එකක් පද්ධතියට එක් කිරීම
- **Flow:**
  1. Upload form එක පුරවන්න
  2. සිතුවම් upload කරන්න (max 5)
  3. විස්තර ඇතුළත් කරන්න (name, price, category, materials)
  4. Auto-approve වීම
  5. Catalogue එකට එක් වීම

#### UC14: Manage Own Furniture (තමන්ගේ ගෘහ භාණ්ඩ කළමනාකරණය)
- **Actors:** Carpenter
- **Description:** තමන් upload කළ items බලන්න සහ manage කරන්න

#### UC15: Update Furniture (යාවත්කාලීන කිරීම)
- **Actors:** Carpenter
- **Description:** තමන්ගේ furniture items edit කිරීම

#### UC16: Delete Furniture (මකා දැමීම)
- **Actors:** Carpenter, Admin
- **Description:** Furniture items මකා දැමීම

#### UC17: Approve Furniture Design (නිර්මාණ අනුමත කිරීම)
- **Actors:** Admin
- **Description:** Carpenter designs සමාලෝචනය කර අනුමත කිරීම

---

### C. Order & Cart Management (ඇනවුම් කළමනාකරණය)

#### UC20: Add to Cart (කරත්තයට එක් කිරීම)
- **Actors:** Customer
- **Description:** Furniture items shopping cart එකට එක් කිරීම
- **Flow:**
  1. Furniture item එකක් තෝරන්න
  2. Quantity සඳහන් කරන්න
  3. "Add to Cart" click කරන්න
  4. Cart එකේ item එක store වීම

#### UC21: Place Order (ඇනවුම් කිරීම)
- **Actors:** Customer
- **Description:** Cart එකේ items සඳහා order කිරීම
- **Flow:**
  1. Cart review කරන්න
  2. Delivery address ඇතුළත් කරන්න
  3. Payment method තෝරන්න
  4. Order confirm කරන්න
  5. Stock availability check කරනවා
  6. Order create වීම

#### UC22: View Order History (ඇනවුම් ඉතිහාසය)
- **Actors:** Customer
- **Description:** අතීත orders බලන්න

#### UC23: Track Order Status (ස්ථිතිය නිරීක්ෂණය)
- **Actors:** Customer
- **Description:** Real-time order status බලන්න
- **Status Levels:**
  - Pending
  - Processing
  - In Production
  - Ready for Delivery
  - Delivered
  - Cancelled

#### UC24: Cancel Order (ඇනවුම අවලංගු කිරීම)
- **Actors:** Customer
- **Description:** Pending orders cancel කිරීම
- **Condition:** Status = "Pending" විය යුතුය

#### UC25: View All Orders (සියලුම ඇනවුම්)
- **Actors:** Admin
- **Description:** පද්ධතියේ සියලුම orders බලන්න

#### UC26: Update Order Status (ස්ථිතිය යාවත්කාලීන කිරීම)
- **Actors:** Admin
- **Description:** Order status වෙනස් කිරීම

#### UC27: Assign Carpenter to Order (වඩු කාර්මිකයා පැවරීම)
- **Actors:** Admin
- **Description:** Production සඳහා carpenter කෙනෙක් පත් කිරීම
- **When:** Stock නැති විට

#### UC28: Update Payment Status (ගෙවීම් ස්ථිතිය)
- **Actors:** Admin
- **Description:** Payment status update කිරීම (Paid/Unpaid)

---

### D. Review & Rating System (සමාලෝචන පද්ධතිය)

#### UC30: Submit Product Review (සමාලෝචනය ලබා දීම)
- **Actors:** Customer
- **Description:** Furniture item එකකට review සහ rating දීම
- **Flow:**
  1. Furniture details page එකට යන්න
  2. Review form පුරවන්න
  3. Rating (1-5 stars) දෙන්න
  4. Comment type කරන්න
  5. Submit කරන්න

#### UC31: View Product Reviews (සමාලෝචන බලන්න)
- **Actors:** All
- **Description:** අනෙක් customers ල reviews බලන්න

#### UC32: Rate Furniture (අගයීමක් දීම)
- **Actors:** Customer
- **Description:** Star rating (1-5) දීම

---

### E. Resource Management (සම්පත් කළමනාකරණය)

#### UC40: Upload/Sell Resources (සම්පත් විකිණීම)
- **Actors:** Carpenter
- **Description:** Raw materials (ලී, screws, tools) විකිණීම සඳහා upload කිරීම
- **Flow:**
  1. Resource upload form පුරවන්න
  2. Type, quantity, price සඳහන් කරන්න
  3. Images upload කරන්න
  4. Specifications ඇතුළත් කරන්න
  5. Auto-approve වීම

#### UC41: View Available Resources (ලබා ගත හැකි සම්පත්)
- **Actors:** Carpenter, Admin
- **Description:** පද්ධතියේ resources බලන්න

#### UC42: Manage Own Resources (තමන්ගේ සම්පත්)
- **Actors:** Carpenter
- **Description:** තමන් upload කළ resources manage කිරීම

#### UC43: Update Resource Details (යාවත්කාලීන කිරීම)
- **Actors:** Carpenter
- **Description:** Resource details, price, quantity edit කිරීම

#### UC44: Delete Resource (මකා දැමීම)
- **Actors:** Carpenter, Admin
- **Description:** Resources remove කිරීම

#### UC45: Approve Resource Listing (අනුමත කිරීම)
- **Actors:** Admin
- **Description:** Resource listings verify කර approve කිරීම

#### UC46: Purchase Resources (සම්පත් මිලදී ගැනීම)
- **Actors:** Admin
- **Description:** Carpenters වෙනුවෙන් resources මිලදී ගැනීම
- **Flow:**
  1. Resource තෝරන්න
  2. Quantity specify කරන්න
  3. Recipient carpenter තෝරන්න
  4. Purchase confirm කරන්න
  5. Quantity update වීම

---

### F. Carpenter Services (වඩු කාර්මික සේවා)

#### UC50: View Assigned Orders (පවරන ලද ඇනවුම්)
- **Actors:** Carpenter
- **Description:** තමන්ට assign කළ production orders බලන්න

#### UC51: Check Resource Availability (සම්පත් පරීක්ෂා කිරීම)
- **Actors:** Carpenter
- **Description:** Production සඳහා resources තිබේදැයි බලන්න

#### UC52: Request Resources from Admin (සම්පත් ඉල්ලීම)
- **Actors:** Carpenter
- **Description:** අවශ්‍ය resources admin ගෙන් request කිරීම

#### UC53: Start Production (නිෂ්පාදනය ආරම්භ කිරීම)
- **Actors:** Carpenter
- **Description:** Order production පටන් ගැනීම

---

## Relationships (සම්බන්ධතා)

### Include Relationships (<<include>>)
- **Place Order** includes **Browse Furniture Catalogue**
  - Order කරන්න කලින් browse කළ යුතුයි
- **Place Order** includes **Add to Cart**
  - Cart එකෙන් තමයි orders යන්නේ
- **Upload Furniture Design** includes **Login**
  - Login වෙලා තමයි upload කරන්න පුළුවන්
- **Submit Review** includes **View Furniture Details**
  - Details page එකෙන් තමයි review දෙන්නේ

### Extend Relationships (<<extend>>)
- **Search & Filter** extends **Browse Catalogue**
  - Browse කරද්දී optional ලෙස filter කරන්න පුළුවන්
- **Track Status** extends **View Order History**
  - Order history බලද්දී status track කරන්න පුළුවන්
- **Cancel Order** extends **View Order History**
  - Order history එකෙන් cancel කරන්න පුළුවන්

---

## Business Logic Highlights

### Stock Management
- Order කරද්දී system auto stock check කරනවා
- Stock තියෙනවනම් reduce කරනවා
- Stock නැත්නම් production mode එකට යනවා

### Approval Workflow
- Carpenters auto-approve වෙනවා (දැන් implement කරලා තියෙන්නේ)
- Furniture designs auto-approve
- Resources auto-approve
- Admin වෙනස් කරන්න පුළුවන්

### Role-Based Access Control
- **Customer:** Browse, Order, Review
- **Carpenter:** + Upload Designs/Resources, View Assigned Orders
- **Admin:** + Full Management Access

---

## Technical Implementation

### Backend Routes
- `/api/auth` - Authentication
- `/api/furniture` - Furniture CRUD
- `/api/orders` - Order management
- `/api/resources` - Resource management
- `/api/users` - User management

### Database Models
- **User** - Customer, Carpenter, Admin accounts
- **Furniture** - Design listings
- **Order** - Customer orders
- **Resource** - Raw materials

### Authentication
- JWT tokens (30 days validity)
- Password hashing with bcrypt
- Role-based middleware

---

## Future Enhancements
- Payment gateway integration
- Real-time notifications
- Live chat support
- Email notifications
- Mobile app

---

**Generated on:** March 26, 2026
**System Version:** 1.0.0
