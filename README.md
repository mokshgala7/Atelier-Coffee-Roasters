# Atelier Coffee Roasters · Café Ordering Platform

An artisanal, full-stack specialty coffee ordering platform and atelier showcase built with React 19, Vite, Express, and MongoDB Atlas.

![Atelier Roasters](https://lh3.googleusercontent.com/aida-public/AB6AXuD9q-yOmPyvnRJ3o_HDsdXR0UmwHmRJ0oGi8lltSRbt88yVQCRHvckvzp4gDzyfYf2BG9qmCR_Q-oLdIvCYFevtQWJpKZx06IngKnyhQa4OBpLrp8_5bacAoFakSMDKZ-lig-dFcH2T8-fOeGo2J-apo_Cy7o-uKMgzwj5B3LzA23DZQ8K4YRJKo1P2tlqC4CXDj-bGIgv0eSHwdDzM_IcDszXVOzPm-FVxO57psuFzkWr9S9aTFh2J)

## Features

### 1. Cinematic Atelier Experience & Roastery Showcase
- **Editorial Brand Aesthetic**: Clean, luxury design language using *Playfair Display* & *Plus Jakarta Sans* typography with a dark roast & cream palette.
- **Single-Origin Roasting Craft**: Interactive terroir storytelling featuring Ethiopian Yirgacheffe, Guatemalan Huehuetenango, and Coorg micro-lots.
- **Digital Table Service Workflow**: QR Scan, customizable brew profiles, live roasting updates, and seat delivery.
- **Interactive Tasting Experience**: Multi-sensory cupping reservation system with live calendar and time picker for the SVKM Flagship Roastery Pavilion.
- **Live Editorial Reviews**: Community and Q-grader review system persisted directly to MongoDB with an interactive modal to submit tasting notes.
- **Bespoke Coffee Transition Video**: Custom animated coffee extraction video with rising steam, gold monogram, and dynamic roast progress bar that plays on page reload and page-to-page navigation.

### 2. Full-Fidelity Menu & Patisserie Selections
- **Extensive Artisanal Catalog**: 46 handcrafted single-origin coffees, ceremonial Uji matchas, cold-steeped iced teas, zero-proof mocktails, and French patisserie.
- **Artisan Bakery & Desserts**: High-resolution bespoke photography for:
  - *Classic Chocolate Mousse* & *Triple Chocolate Mousse*
  - *Classic Fudge Brownie* & *Crunchy Praline Brownie*
  - *Double Choco Chip Cookie*, *Choco Chip Cookie with Maldon Salt*, *Nutella Sea Salt Cookie*, and *Toasted Marshmallow Cookie*
- **Interactive Customizer**: Temperature selection, milk choices (Whole, Oat, Almond), and 8 premium add-ons with visual thumbnails (Extra Espresso Shot, Whipped Cream, Irish Cream, Hazelnut, Vanilla, Salted Caramel Drizzle, Chocolate Fudge, Vanilla Scoop).
- **Slide-out Cart Drawer**: Real-time subtotal and tax calculation, quantity controls, and custom extras itemization.

### 3. Patron Authentication (Atelier Guild)
- **Sign-Up & Sign-In**: Create an account with **Full Name**, **Mobile Number**, **Email Address**, and **Password**.
- **Dual Login Identifier**: Sign in seamlessly using either your registered email address or mobile number.
- **Security & Password Hashing**: Passwords securely hashed using `bcryptjs` (salt rounds: 10) before database storage. Plaintext passwords are never saved.
- **JWT Session Persistence**: Automatic token management and local storage session recovery.

### 4. Interactive Checkout & Multi-Mode Payment Simulator
- **Service Fulfillment**: Choose between Seat-Side Table Service (with table number) and Bar Pickup.
- **Payment Methods Supported**:
  - **UPI Gateway**: Realistic QR code scanner, fast UPI app selectors (Google Pay, PhonePe, Paytm, BHIM), and UPI ID verification.
  - **Credit & Debit Card**: Luxury interactive credit card mockup with live cardholder name, masked number, expiry, and CVV fields.
  - **Cash / Card at Roastery Bar**: Counter settlement for patrons enjoying the brew bar.
- **Instant Verified Order Receipt**: Comprehensive order confirmation breakdown with a unique order ID and itemized summary saved directly to MongoDB.

### 5. Patron Profile & Past Order Dossier
- **Personalized Account View**: Displays member details, contact info, and lifetime order activity.
- **Authenticated Order History**: Patrons can review all their historical orders and tasting reservations fetched directly from MongoDB.
- **One-Click Reorder**: Instant "Reorder All" feature that reloads previous order selections directly back into the cart.
- **Privacy Protections**: Guest visitors are prevented from viewing other patrons' orders.

---

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS tokens & Vanilla CSS design system, HTML5 Video, Material Symbols.
- **Backend**: Node.js, Express REST API, Mongoose 8, JWT, bcryptjs, CORS, Dotenv.
- **Database**: MongoDB Atlas (`atelier_coffee` database with `users`, `orders`, `reservations`, and `reviews` collections).

---

## Quick Start

### 1. Install Dependencies

```bash
# Install root and workspace dependencies
npm install
npm --prefix frontend install
npm --prefix backend install
```

### 2. Environment Variables

Create `backend/.env` with your MongoDB connection string:

```env
PORT=5001
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/atelier_coffee?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
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

---

## Location

**SVKM's Shri Bhagubhai Mafatlal Polytechnic and College of Engineering**  
Irla, N. R. G. Marg, Opposite Cooper Hospital, JVPD Scheme, Vile Parle West, Mumbai, Maharashtra 400056  
[View on Google Maps](http://google.com/maps/place/SVKM's+Shri+Bhagubhai+Mafatlal+Polytechnic+and+College+of+Engineering/@19.1076102,72.8378213,17z/data=!3m1!4b1!4m6!3m5!1s0x3be7c9c651c56f9b:0xc32173e36e9d804f!8m2!3d19.1076102!4d72.8378213!16s%2Fm%2F0cr51bd?entry=ttu&g_ep=EgoyMDI2MDkyMi4wIKXMDSoASAFQAw%3D%3D)

---
© 2026 Atelier Roasters Ltd. Mindfully crafted specialty coffee.
