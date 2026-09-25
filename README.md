# Atelier Coffee Roasters · Café Ordering Platform

An artisanal, full-stack specialty coffee ordering platform and atelier showcase built with React 19, Vite, Express, and MongoDB.

![Atelier Roasters](https://lh3.googleusercontent.com/aida-public/AB6AXuD9q-yOmPyvnRJ3o_HDsdXR0UmwHmRJ0oGi8lltSRbt88yVQCRHvckvzp4gDzyfYf2BG9qmCR_Q-oLdIvCYFevtQWJpKZx06IngKnyhQa4OBpLrp8_5bacAoFakSMDKZ-lig-dFcH2T8-fOeGo2J-apo_Cy7o-uKMgzwj5B3LzA23DZQ8K4YRJKo1P2tlqC4CXDj-bGIgv0eSHwdDzM_IcDszXVOzPm-FVxO57psuFzkWr9S9aTFh2J)

## Features

- **Cinematic Atelier Homepage**:
  - Hero showcase with editorial typography (*Playfair Display* & *Plus Jakarta Sans*).
  - Single-Origin Roasting Craft & Terroir storytelling (Yirgacheffe, Huehuetenango, Coorg micro-lots).
  - Digital Table Service pathway (QR Scan, Customization, Live Roasting, Seat Delivery).
  - Editorial testimonials from coffee critics & Q-graders.
  - Interactive Roastery Pavilion location at **SVKM's Shri Bhagubhai Mafatlal Polytechnic and College of Engineering**, Vile Parle West, Mumbai.
  - Google Maps integration and Tasting Experience reservation modal.
  - Roastery Dispatch newsletter subscription with live toast notifications.

- **Full-Fidelity Menu & Ordering Experience**:
  - 46 handcrafted single-origin coffees, ceremonial Uji matchas, cold-steeped teas, zero-proof botanicals, shakes, and French patisserie.
  - 54 unique 1:1 square artisanal high-resolution photography assets.
  - Interactive customization configurator: Milk selection (Whole, Oat, Almond) and 8 premium add-ons with visual thumbnails (Extra Espresso Shot, Whipped Cream, Irish Cream, Hazelnut, Vanilla, Salted Caramel Drizzle, Chocolate Fudge, Vanilla Scoop).
  - Two-column responsive product modal with keyboard navigation (`Escape` to close).
  - Interactive Table Session indicator (`Table 04 Active`).
  - Slide-out Cart Drawer with real-time subtotal calculations, item quantity steppers, and customizable extras summary.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS tokens & Vanilla CSS design system, Material Symbols, Playfair Display & Plus Jakarta Sans typography.
- **Backend**: Node.js, Express REST API, CORS, Dotenv.
- **Database**: MongoDB (Mongoose models for Menu Items, Orders, and Customers).

## Quick Start

### 1. Install Dependencies

```bash
# Install root and workspace dependencies
npm install
npm --prefix frontend install
npm --prefix backend install
```

### 2. Environment Variables

Create `backend/.env` (see `backend/.env.example`):

```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/cafe-ordering
```

### 3. Run Development Servers

```bash
# Run both frontend and backend concurrently
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001

### 4. Build for Production

```bash
npm --prefix frontend run build
```

## Location

**SVKM's Shri Bhagubhai Mafatlal Polytechnic and College of Engineering**  
Irla, N. R. G. Marg, Opposite Cooper Hospital, JVPD Scheme, Vile Parle West, Mumbai, Maharashtra 400056  
[View on Google Maps](http://google.com/maps/place/SVKM's+Shri+Bhagubhai+Mafatlal+Polytechnic+and+College+of+Engineering/@19.1076102,72.8378213,17z/data=!3m1!4b1!4m6!3m5!1s0x3be7c9c651c56f9b:0xc32173e36e9d804f!8m2!3d19.1076102!4d72.8378213!16s%2Fm%2F0cr51bd?entry=ttu&g_ep=EgoyMDI2MDkyMi4wIKXMDSoASAFQAw%3D%3D)

---
© 2025 Atelier Roasters Ltd. Mindfully crafted specialty coffee.

