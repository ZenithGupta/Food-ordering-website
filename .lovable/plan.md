
# Indian Aroma 2.0 - Premium Food Ordering Platform

## Overview
A stunning, app-like food ordering experience for an Indian restaurant in the Netherlands. Built with React + Vite, designed for easy Next.js migration.

---

## Phase 1: Foundation & Design System

### Dark Theme Setup
- Rich midnight blue background (#0F172A)
- Saffron orange primary color (#FF9933) with gradients
- Gold accents for prices and ratings
- Glassmorphism card effects with subtle border glows

### Typography
- **Playfair Display** for elegant headings
- **Inter** for clean body text

### Core UI Components
- Premium Button variants (gradient, outline, ghost)
- Glassmorphic Card component
- Input fields with glowing focus states
- Badge components for dietary tags (Veg, Gluten-Free)

---

## Phase 2: Layout & Navigation

### Navbar
- Sticky header with blur backdrop
- Restaurant logo/name
- Navigation links (Home, Menu, About)
- Cart icon with item count badge

### Footer
- Contact information
- Opening hours
- Social media links

### Page Structure
- Home (Landing)
- Menu
- Checkout
- Order Confirmation

---

## Phase 3: Landing Page

### Hero Section
- Full-screen gradient background (video placeholder ready)
- Animated headline: "Authentic Indian Flavors"
- Floating "Order Now" call-to-action button
- Subtle scroll indicator

### Featured Section
- Popular dishes showcase
- Smooth fade-in animations on scroll

---

## Phase 4: Menu System

### Category Navigation
- Sticky sidebar on desktop
- Horizontal scrollable pills on mobile
- Categories: Starters, Mains, Biryani, Breads, Drinks, Desserts

### Menu Cards
- High-quality image placeholders
- Dish name, description, price
- Dietary badges (🌱 Veg, GF Gluten-Free)
- Spice level indicators (🌶️)
- Hover: Scale up with glow effect
- "Add to Cart" button

### Filtering
- Toggle filters: Vegetarian, Vegan, Gluten-Free
- Smooth filter animations

---

## Phase 5: Cart System

### Cart Drawer (Slide-out Sheet)
- Opens from right side
- List of cart items with quantities
- +/- quantity controls
- Remove item option
- Order subtotal display
- "Proceed to Checkout" button

### State Management
- Simple React Context + useReducer pattern
- LocalStorage persistence
- Actions: add, remove, update quantity, clear
- Easy to replace with Zustand or port to any state solution

### Smart Upselling
- Suggest Garlic Naan or Mango Lassi if not in cart

---

## Phase 6: Checkout Flow

### Order Type Selection
- Toggle: Delivery vs. Pickup
- Different form fields based on selection

### Delivery Form
- Name, Phone, Email
- Address fields
- Dutch postal code validation (format: 1234 AB)
- Delivery notes

### Order Summary
- Items list with prices
- Delivery fee (if applicable)
- Total in EUR (€)

### Payment Placeholder
- "Pay with iDEAL" button (ready for Stripe integration)
- Card payment option placeholder

---

## Technical Architecture

### Folder Structure
```
src/
├── components/
│   ├── ui/          → Reusable atoms (Button, Card, Input)
│   ├── layout/      → Navbar, Footer, PageWrapper
│   ├── menu/        → MenuCard, CategoryFilter, MenuGrid
│   ├── cart/        → CartDrawer, CartItem, CartSummary
│   └── checkout/    → CheckoutForm, OrderSummary
├── context/
│   └── CartContext.tsx  → Simple cart state
├── hooks/
│   └── useCart.ts       → Cart actions hook
├── lib/
│   └── utils.ts         → formatCurrency, cn helper
├── data/
│   └── menu.ts          → Mock menu data (Supabase-ready structure)
└── pages/
    ├── Index.tsx
    ├── Menu.tsx
    └── Checkout.tsx
```

### Next.js Migration Ready
- All components are pure React, no Vite-specific code
- Page components map directly to Next.js pages/app routes
- Context pattern easily swappable
- Data fetching in separate layer (ready for Server Components)

---

## Design Highlights

- **Glassmorphism**: Semi-transparent cards with blur backdrop
- **Gradient accents**: Saffron-to-gold on CTAs and highlights
- **Smooth animations**: Hover effects, page transitions, cart slide
- **Mobile-first**: Responsive at every breakpoint
- **Premium feel**: Careful spacing, elegant typography, subtle shadows
