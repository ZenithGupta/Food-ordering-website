# Product Requirements Document (PRD): Indian Aroma 2.0

## 1. Project Overview
**Client:** Indian Aroma (Netherlands)
**Goal:** Develop a high-performance, "fancy" food ordering PWA. The site must enable customers to browse the menu, customize items, and place orders directly.
**Current Phase:** Migration to Next.js with "Call to Order" fallback.

## 2. Tech Stack
* **Framework:** Next.js 14 (App Router)
* **Styling:** Tailwind CSS + Framer Motion
* **State:** Zustand or Context API
* **Database:** Supabase (PostgreSQL) - *Planned for Phase 2*

## 3. Core Features
### 3.1. Immersive Homepage
* Hero section with high-quality imagery/video.
* "Order Now" CTA that follows the user.

### 3.2. Digital Menu
* **Categories:** Starters, Tandoori, Curries, Biryani, Naan, Drinks.
* **Filters:** Veg, Vegan, Gluten-Free toggles.
* **Interactions:** Hover effects on cards, smooth category transitions.

### 3.3. Cart & Checkout (Modified)
* Slide-out cart drawer.
* **Temporary Constraint:** Online payments are disabled.
* **Fallback:** Users review their cart and are prompted to call the restaurant to finalize the order based on the cart summary.

## 4. UI/UX Design Strategy
* **Theme:** Dark Mode Default (Midnight Blue/Slate Background).
* **Accents:** Saffron Orange (#FF9933) and Gold (#F59E0B).
* **Typography:** Playfair Display (Headings) + Inter (Body).

## 5. Site Architecture (App Router)
* `/` (Home)
* `/menu` (Full Menu)
* `/checkout` (Order Summary + Contact Info)
* `/about` (Location & Hours)
