# Indian Aroma 🍛

A premium food ordering web application for an Indian restaurant in the Netherlands.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + Framer Motion
- **Components:** Radix UI + shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Language:** TypeScript

## Features

- 🌙 Dark theme with saffron & gold accents
- 📱 Mobile-first responsive design
- 🛒 Cart with slide-out drawer
- 🍽️ Full menu with category filters
- 🥗 Dietary filters (Veg, Vegan, Gluten-Free)
- 📞 Call-to-order checkout flow

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ZenithGupta/Food-ordering-website.git

# Navigate to project
cd Food-ordering-website

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Project Structure

```
├── app/           # Next.js App Router pages
├── components/    # React components
│   ├── ui/        # Base UI components
│   ├── layout/    # Navbar, Footer
│   ├── menu/      # Menu components
│   ├── cart/      # Cart components
│   └── checkout/  # Checkout components
├── context/       # React Context providers
├── data/          # Menu data
├── docs/          # Project documentation
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
└── public/        # Static assets
```

## License

Private project.
