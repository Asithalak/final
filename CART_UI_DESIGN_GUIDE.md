# Cart UI/UX Design Guide

## Component Hierarchy

### 1. Cart Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Shopping Cart                           [Item Count: X items] │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ ┌────────────────────────────────┐  ┌──────────────────────┐ │
│ │  CART ITEMS (2/3 width)         │  │  ORDER SUMMARY (1/3) │ │
│ │                                  │  │                      │ │
│ │ [Item 1]                          │  │ Order Summary        │ │
│ │ - Image, Name, Price             │  │ ─────────────────── │ │
│ │ - Quantity Controls              │  │ Subtotal:   $150.00 │ │
│ │ - Remove Button                  │  │ Tax (8%):    $12.00 │ │
│ │ - Item Subtotal: $100.00         │  │ Shipping:    $9.99  │ │
│ │                                  │  │ ─────────────────── │ │
│ │ [Item 2]                          │  │ TOTAL:     $171.99  │ │
│ │ - Image, Name, Price             │  │                      │ │
│ │ - Quantity Controls              │  │ Payment Method       │ │
│ │ - Remove Button                  │  │ ◉ Cash on Delivery   │ │
│ │ - Item Subtotal: $50.00          │  │ ○ Credit/Debit Card │ │
│ │                                  │  │ ○ UPI / Wallet      │ │
│ │ ─────────────────────────────── │  │                      │ │
│ │                                  │  │ [Complete Order]    │ │
│ │ Delivery Details                 │  │ [Continue Shopping] │ │
│ │ ─────────────────────────────── │  │ [Clear Cart]        │ │
│ │ Address:                         │  │                      │ │
│ │ 123 Main St, City, ST 12345     │  └──────────────────────┘ │
│ │ [Edit Address]                   │                            │
│ │                                  │                            │
│ │ Delivery Notes (Optional):       │                            │
│ │ ┌─────────────────────────────┐ │                            │
│ │ │ Special instructions here... │ │                            │
│ │ └─────────────────────────────┘ │                            │
│ │                                  │                            │
│ └────────────────────────────────┘                            │
└─────────────────────────────────────────────────────────────┘
```

## Cart Item Card Design

### Desktop View
```
┌─────────────────────────────────────────────────────────────┐
│ [Image]  Product Name                     [- 1 +] [Remove]  │ $99.99
│          $50.00 each                                         │
│          ─────────────────────────────────────────────────── │
└─────────────────────────────────────────────────────────────┘
```

### Mobile View
```
┌────────────────────────────┐
│ [Image]  Product Name      │
│          $50.00 each       │
│          [- 1 +] [Remove]  │
│          Subtotal: $99.99  │
└────────────────────────────┘
```

## Order Summary Section

```
┌──────────────────────────┐
│ Order Summary            │  ← Sticky on scroll
├──────────────────────────┤
│ Price Breakdown:         │
│ Subtotal      $150.00    │
│ Tax (8%)       $12.00    │
│ Shipping        $9.99    │  ← FREE if > $100
│ ──────────────────────   │
│ TOTAL:        $171.99    │  ← Bold, Large, Colored
├──────────────────────────┤
│ Payment Method           │
│ ◉ Cash on Delivery       │  ← Selected
│ ○ Credit/Debit Card      │
│ ○ UPI / Digital Wallet   │
├──────────────────────────┤
│ [Complete Order]         │  ← Primary CTA
│ [Continue Shopping]      │  ← Secondary CTA
│ [Clear Cart]             │  ← Danger/Text
└──────────────────────────┘
```

## State Variations

### Empty Cart
```
┌─────────────────────────────────┐
│                                  │
│        🛒 (Large Icon)           │
│                                  │
│   Your cart is empty              │
│   Browse our collection and add   │
│   items to your cart              │
│                                  │
│   [Continue Shopping]             │
│                                  │
└─────────────────────────────────┘
```

### Authentication Required
```
┌─────────────────────────────────┐
│                                  │
│   Sign In Required               │
│                                  │
│   Please log in to view your cart│
│   and proceed with checkout      │
│                                  │
│   [Sign In]                      │
│                                  │
└─────────────────────────────────┘
```

### Order Processing
```
┌──────────────────────────────────┐
│ [Complete Order] Button:          │
│ ┌──────────────────────────────┐ │
│ │ ⚙️ Processing...             │ │  ← Spinning icon
│ └──────────────────────────────┘ │
│ (Button is disabled/grayed out)   │
└──────────────────────────────────┘
```

## Dialog/Modal Designs

### Clear Cart Confirmation
```
┌───────────────────────────────────┐
│ Clear Cart?                        │
├───────────────────────────────────┤
│ Are you sure you want to remove   │
│ all items from your cart?         │
│                                    │
│ [Cancel]      [Clear]             │
└───────────────────────────────────┘
```

### Cancel Order Confirmation
```
┌───────────────────────────────────┐
│ Cancel Order?                      │
├───────────────────────────────────┤
│ Order #ORD-123456789              │
│                                    │
│ Are you sure you want to cancel    │
│ this order? This action cannot     │
│ be undone, but you may place a     │
│ new order at any time.             │
│                                    │
│ [Keep Order] [Cancel Order]        │
└───────────────────────────────────┘
```

## Typography Scale

```
Page Title:       32px, Bold, Dark Gray (#1f2937)
Section Heading:  20px, Bold, Dark Gray (#1f2937)
Label/Text:       16px, Regular, Gray (#4b5563)
Small Text:       12px, Regular, Light Gray (#9ca3af)
Price/Amount:     16px, Semibold, Primary Blue (#2563eb)
Total Amount:     24px, Bold, Primary Blue (#2563eb)
```

## Color Palette

### Primary Colors
- Primary Blue: `#2563eb` - Actions, highlights, totals
- Primary Dark: `#1e40af` - Hover states, active states

### Semantic Colors
- Success Green: `#16a34a` - Confirmations, free shipping
- Warning Yellow: `#eab308` - Pending status, warnings
- Danger Red: `#dc2626` - Cancel, delete actions
- Info Blue: `#0284c7` - Information messages

### Neutral Colors
- Dark Gray: `#1f2937` - Text, headings
- Medium Gray: `#6b7280` - Secondary text
- Light Gray: `#f3f4f6` - Backgrounds
- Border Gray: `#e5e7eb` - Dividers

### Background Colors
- White: `#ffffff` - Cards, inputs
- Light Gray: `#f9fafb` - Page background
- Blue Tint: `#eff6ff` - Info boxes
- Yellow Tint: `#fef3c7` - Warning boxes
- Red Tint: `#fee2e2` - Error boxes

## Button Styles

### Primary Button (Complete Order)
```
Background: #2563eb
Hover:      #1e40af
Text:       White, Bold
Padding:    12px 16px
Border:     None
Radius:     8px
Icon:       Left aligned (if any)
State:      Disabled (gray) when processing or invalid
```

### Secondary Button (Continue Shopping)
```
Background: White
Border:     2px solid #2563eb
Text:       #2563eb, Bold
Hover:      Light blue background
Padding:    12px 16px
Radius:     8px
```

### Tertiary Button (Clear Cart)
```
Background: Transparent
Border:     None
Text:       #dc2626 (Red), Semibold
Hover:      Light red background
Padding:    8px 12px
Font Size:  14px
```

## Spacing Scale

```
XS: 4px   - Small gaps between elements
SM: 8px   - Default element spacing
MD: 12px  - Card padding, section margins
LG: 16px  - Major sections, large padding
XL: 24px  - Page sections, large gaps
2XL: 32px - Top/bottom page margins
```

## Responsive Breakpoints

```
Mobile:   < 640px   - Single column, full-width
Tablet:   640-1024px - 2 columns, flexible layout
Desktop:  > 1024px   - 3 columns, sticky sidebar
```

## Animations

### Hover Effects
- Button scale: 0.98x on hover
- Opacity transition: 200ms
- Color transition: 150ms

### Loading States
- Spinner: 360° rotation, 1s loop
- Pulse effect on disabled buttons
- Smooth fade-in for toast notifications

### Transitions
- All: 150-300ms ease-in-out
- No flashing or jarring changes
- Smooth scrolling to sticky sidebar

## Accessibility

### Keyboard Navigation
- Tab order: Left to right, top to bottom
- Enter key to submit forms
- Escape to close dialogs
- Space to toggle radio buttons

### Screen Readers
- Alt text on all images
- Label associations with inputs
- ARIA attributes for interactive elements
- Semantic HTML structure

### Color Contrast
- Text on background: 4.5:1 minimum
- UI components: 3:1 minimum
- Color not sole indicator of status

## Toast Notification Styles

```
Success:  Green background, ✓ icon, top-right
Error:    Red background, ✗ icon, top-right
Warning:  Yellow background, ⚠ icon, top-right
Info:     Blue background, ℹ icon, top-right
Duration: 3 seconds auto-dismiss
```

## Mobile-Specific Optimizations

- Touch target minimum: 44x44px
- Larger tap areas for buttons
- Simplified modals for small screens
- Stack summary below items
- Larger fonts for readability
- Sticky header with cart info
- Bottom navigation if needed

---

This design guide ensures a consistent, professional, and user-friendly cart experience across all devices and browsers.
