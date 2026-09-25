# Atelier Coffee Roasters — Permanent Technical Knowledge Document (PROJECT_KNOWLEDGE.md)

*Generated: September 2026*  
*Repository: Atelier Coffee Roasters (`mokshgala7/Atelier-Coffee-Roasters`)*  
*System Status: Fully Integrated MERN Application (MongoDB Atlas + Express 5 REST API + React 19 + Node.js via Vite)*


---

## 1. Project Overview
**Atelier Coffee Roasters** is an artisanal, luxury specialty coffee roastery and restaurant web application designed for the flagship location at SVKM College Campus, Mumbai. It features a complete customer journey:
- Interactive cupping and table-side digital ordering.
- Live categorized artisanal menu with 46 handcrafted products across 9 categories plus 8 customization add-ons.
- Seamless shopping cart with real-time recalculation of Indian Goods and Services Tax (GST: 5%).
- Dual table-side ordering modalities: Table Service (with table number picker) and Bar Pickup.
- Multi-channel simulated payment processing: Unified Payments Interface (UPI with dynamic QR generation and app intent handling), Credit/Debit Card (with visual card preview), and Cash at Bar.
- Patron authentication system with dual-credential login (Email or Mobile Phone Number) and secure bcrypt-hashed passwords.
- Real-time MongoDB Atlas persistent storage for users, orders, table reservations, and editorial patron reviews.
- Cinematic video-based page transitions for artisanal coffee brewing.

---

## 2. Technology Stack

### Runtime & Core Architecture
- **Architecture Pattern**: Decoupled Monorepo MERN Stack (MongoDB, Express, React, Node.js).
- **Package Manager**: npm (workspaces orchestrated at root using `concurrently ^9.1.2`).

### Frontend
- **Framework**: React 19 (`react: ^19.1.1`, `react-dom: ^19.1.1`).
- **Build Tool / Bundler**: Vite 7 (`vite: ^7.1.7`, `@vitejs/plugin-react: ^5.0.2`).
- **Routing Engine**: Custom hash-aware single-page application state router with window hash synchronization (`AppContent` in `frontend/src/App.jsx`). `react-router-dom: ^7.9.1` is installed as a dependency.
- **Styling Architecture**: Custom Vanilla CSS Design System with Google Fonts (`Playfair Display`, `Plus Jakarta Sans`, and Google Material Symbols) in `frontend/src/index.css`. Tailwind CSS utility classes are also integrated in home/auth components.
- **State Management**: Native React Context API (`AuthContext` in `frontend/src/context/AuthContext.jsx`, `CartContext` in `frontend/src/context/CartContext.jsx`).

### Backend
- **Server Framework**: Express 5 (`express: ^5.1.0`, ESM modules `"type": "module"`).
- **Runtime Environment**: Node.js (with native `--watch` dev script).
- **Database ODM**: Mongoose 8 (`mongoose: ^8.18.1`).
- **Authentication & Security**:
  - `bcryptjs: ^3.0.3` (10 salt rounds for password hashing).
  - `jsonwebtoken: ^9.0.3` (HMAC SHA-256 JWT tokens with 7-day validity).
  - `cors: ^2.8.5` (Cross-Origin Resource Sharing).
  - `dotenv: ^17.2.2` (Environment configuration).

---

## 3. Folder Structure

```
/Users/moksh/Desktop/FSD Final Year/
├── package.json                   # Root orchestrator script ("concurrently" backend + frontend)
├── package-lock.json              # Root lockfile
├── .gitignore                     # Git ignore rules (node_modules, dist, .env, .DS_Store, logs)
├── README.md                      # Public project documentation & feature overview
├── PROJECT_KNOWLEDGE.md           # This document (Master Technical Knowledgebase)
├── backend/
│   ├── package.json               # Express 5 backend config & dependencies
│   ├── .env                       # Local environment variables (PORT, MONGODB_URI) - [Git Ignored]
│   ├── .env.example               # Template for environment configuration
│   └── src/
│       ├── app.js                 # Express application initialization, CORS, JSON parser, route mounting
│       ├── server.js              # Server entry point, MongoDB Atlas connection init, port listener
│       ├── config/
│       │   ├── db.js              # Mongoose connection logic with Atlas reconnection listeners
│       │   └── env.js             # Configuration mapping for PORT and MONGODB_URI
│       ├── controllers/
│       │   ├── authController.js        # User registration, login (email/phone), JWT generation, profile
│       │   ├── orderController.js       # Order creation, patron order history, ID lookup, deletion
│       │   ├── reservationController.js # Tasting table reservations retrieval and creation
│       │   ├── reviewController.js      # Editorial reviews retrieval and patron review submission
│       │   ├── categoryController.js    # Stub for category retrieval
│       │   ├── productController.js     # Stub for product retrieval
│       │   ├── userController.js        # Stub for user retrieval
│       │   └── adminController.js       # Stub for admin dashboard analytics
│       ├── models/
│       │   ├── User.js            # Mongoose schema: Name, Email (unique), Phone, Hashed Password
│       │   ├── Order.js           # Mongoose schema: Items, Subtotal, Tax, Total, Payment, Status
│       │   ├── Reservation.js     # Mongoose schema: Name, Phone, Guests, Date, Time, Status
│       │   ├── Review.js          # Mongoose schema: Author, Publication, Quote, Rating, FavoriteItem
│       │   ├── Category.js        # Mongoose schema: Name, Slug
│       │   ├── Product.js         # Mongoose schema: Name, Price, Category, Available
│       │   ├── Admin.js           # Mongoose schema: Email, Password, Role
│       │   └── Favorite.js        # Mongoose schema: User ref, Product ref
│       ├── routes/
│       │   ├── authRoutes.js        # /api/auth (POST /register, POST /login, GET /me)
│       │   ├── orderRoutes.js       # /api/orders (GET /, GET /user/:userId, GET /:id, POST /, DELETE /:id)
│       │   ├── reservationRoutes.js # /api/reservations (GET /, POST /)
│       │   ├── reviewRoutes.js      # /api/reviews (GET /, POST /)
│       │   ├── categoryRoutes.js    # /api/categories (GET /)
│       │   ├── productRoutes.js     # /api/products (GET /)
│       │   ├── userRoutes.js        # /api/users (GET /me)
│       │   └── adminRoutes.js       # /api/admin (GET /dashboard)
│       ├── middleware/
│       │   ├── authMiddleware.js    # Authentication barrier stub
│       │   ├── adminMiddleware.js   # Admin access control stub
│       │   └── errorMiddleware.js   # Global express error handler
│       ├── services/
│       │   ├── orderService.js      # calculateOrderTotal utility
│       │   ├── notificationService.js # Order event notification stub
│       │   └── productService.js    # Product listing service stub
│       └── utils/
│           ├── generateOrderId.js   # Unique order identifier generator (ORD-timestamp)
│           └── validators.js        # Order validation utilities
├── frontend/
│   ├── package.json               # React 19 & Vite dependencies
│   ├── vite.config.js             # Vite configuration with /api proxy to http://localhost:5001
│   ├── index.html                 # HTML shell, favicon, typography preconnects
│   ├── public/
│   │   ├── atelier-transition.webm# Ultra-compact webm coffee pouring transition video
│   │   ├── transition.mp4         # High-compatibility MP4 transition video fallback
│   │   ├── favicon.png            # Browser tab icon
│   │   ├── logo.png / logo.webp   # Atelier Coffee Roasters emblems
│   │   └── icons/                 # Public icon assets
│   └── src/
│       ├── main.jsx               # React 19 root bootstrap into document.getElementById('root')
│       ├── App.jsx                # Core root router, navigation state, toast system, transition manager
│       ├── index.css              # Master styling design system, custom responsive layout, CSS variables
│       ├── assets/
│       │   └── images/
│       │       ├── logo.webp      # High-res webp brand logo
│       │       ├── Untitled.mov   # Source transition reference video
│       │       └── menu/          # 54 WebP images for 46 products + 8 add-on options
│       ├── context/
│       │   ├── AuthContext.jsx    # React Context for User Authentication (JWT, login, register, localStorage)
│       │   └── CartContext.jsx    # React Context for Cart Operations (item hashing, quantity, subtotal)
│       ├── hooks/
│       │   ├── useAuth.js         # Custom hook exposing AuthContext
│       │   ├── useCart.js         # Custom hook exposing CartContext
│       │   └── useOrders.js       # Custom hook exposing OrderContext stub
│       ├── data/
│       │   └── menuData.js        # Definitive menu registry: 46 products, 9 categories, 8 add-ons, integrity checks
│       ├── pages/
│       │   ├── Home.jsx           # Landing page (Hero, Philosophy, Digital Service, Reviews, Campus, Tasting)
│       │   ├── Menu.jsx           # Catalog page (Category navigation, search filter, product modal, add to cart)
│       │   ├── Checkout.jsx       # Checkout & dummy payments (Table selection, UPI, Card, Cash at Bar, MongoDB POST)
│       │   ├── Profile.jsx        # Patron account portal, past order history from MongoDB, reordering
│       │   ├── Cart.jsx           # Standalone cart view stub
│       │   ├── Favorites.jsx      # Saved items view stub
│       │   ├── OrderConfirmation.jsx # Confirmation view stub
│       │   ├── OrderTracking.jsx  # Order tracking view stub
│       │   ├── PreviousOrders.jsx # Orders list view stub
│       │   ├── ProductPage.jsx    # Single product view stub
│       │   └── admin/             # Admin portal stubs (AdminDashboard, AdminLogin, AdminMenu, AdminOrders)
│       ├── components/
│       │   ├── home/
│       │   │   ├── HomeNavbar.jsx         # Luxury floating header with dynamic auth button & cart pill
│       │   │   ├── HeroSection.jsx        # Cinematic visual introduction & CTA buttons
│       │   │   ├── RoastingPhilosophy.jsx # Craft standards and roast profile storytelling
│       │   │   ├── DigitalService.jsx     # Overview of digital ordering features
│       │   │   ├── TestimonialsSection.jsx# Editorial reviews loaded from MongoDB Atlas with review modal
│       │   │   ├── AddReviewModal.jsx     # Patron review submission modal (persists to MongoDB Atlas)
│       │   │   ├── VisitRoastery.jsx      # SVKM campus location, map preview, and tasting button
│       │   │   ├── TastingModal.jsx       # Cupping & tour reservation modal (persists to MongoDB Atlas)
│       │   │   └── HomeFooter.jsx         # Footer with campus links, hours, and dispatch newsletter subscription
│       │   ├── menu/
│       │   │   ├── CategoryNav.jsx        # Horizontal sticky category selector pills
│       │   │   ├── CategorySidebar.jsx    # Desktop sticky navigation sidebar
│       │   │   ├── CategorySection.jsx    # Category container rendering ProductCards
│       │   │   ├── ProductCard.jsx        # Individual item card with image, price, nutrition pill, quick-add
│       │   │   ├── ProductDetails.jsx     # Detail modal with customization options and add-on picker
│       │   │   ├── NutritionInfo.jsx      # Calorie and macro nutrient preview
│       │   │   ├── Customization.jsx      # Product options customizer
│       │   │   ├── AddOnCard.jsx          # Add-on modifier selector
│       │   │   └── ProductGrid.jsx        # Grid layout container
│       │   ├── cart/
│       │   │   ├── CartDrawer.jsx         # Slide-over cart drawer with live subtotal and checkout link
│       │   │   ├── CartBar.jsx            # Floating mobile bar indicating cart item count and subtotal
│       │   │   ├── CartItem.jsx           # Individual cart row component stub
│       │   │   └── CartSummary.jsx        # Cart totals calculation stub
│       │   ├── auth/
│       │   │   └── AuthModal.jsx          # Luxury dual-tab modal for Sign In (email/phone) and Sign Up
│       │   ├── common/
│       │   │   ├── PageTransition.jsx     # Global video transition overlay during reload and menu navigation
│       │   │   ├── Navbar.jsx             # Legacy navbar component
│       │   │   ├── Footer.jsx             # Legacy footer component
│       │   │   ├── Button.jsx             # Reusable button wrapper
│       │   │   ├── Modal.jsx              # Reusable modal container
│       │   │   └── Loader.jsx             # Loading indicator
│       │   ├── order/
│       │   │   ├── Checkout.jsx           # Order checkout component stub
│       │   │   ├── TableSelector.jsx      # Table selection UI stub
│       │   │   ├── OrderType.jsx          # Order type selector stub
│       │   │   ├── OrderConfirmation.jsx  # Order confirmation UI stub
│       │   │   └── OrderTracking.jsx      # Order tracking step indicator stub
│       │   └── admin/
│       │       ├── AdminSidebar.jsx       # Admin portal navigation stub
│       │       ├── Dashboard.jsx          # Admin analytics widget stub
│       │       ├── MenuManagement.jsx     # Menu editor stub
│       │       └── OrderManagement.jsx    # Live kitchen display stub
│       ├── services/
│       │   ├── api.js                     # Generic fetch wrapper
│       │   ├── authService.js             # Auth API service stub
│       │   ├── menuService.js             # Menu fetching service stub
│       │   └── orderService.js            # Order submission service stub
│       └── utils/
│           ├── formatPrice.js             # Currency formatting for Indian Rupee (INR)
│           ├── validators.js              # Input validation utilities
│           └── constants.js               # Application constants
├── database/
│   ├── sample-data/products.json          # Historical sample product seed dataset
│   └── seed/
│       ├── categories.js                  # Category seed schema script
│       └── products.js                    # Product seed schema script
└── docs/                                  # Historical documentation & assets
```

---

## 4. Frontend Architecture

### Routing Mechanism
- **Current Router**: Controlled by `AppContent` in `frontend/src/App.jsx`.
- **Navigation Engine**: Uses state `activePage` (`'home' | 'menu' | 'checkout' | 'profile'`).
- **Deep Linking**: Synced with `window.location.hash` (`#menu`, `#checkout`, `#profile`, `#home`). Also handles direct category hashes (`#dessert`, `#brownie`, `#coffee`, etc.) by routing immediately to `'menu'`.
- **Page Transitions**: Handled by `PageTransition.jsx`. Plays a video overlay (`/atelier-transition.webm` or `/transition.mp4`) upon page reload and specifically when navigating to the Menu.

### Context Providers & Global State
1. **`AuthContext` (`frontend/src/context/AuthContext.jsx`)**:
   - Manages `user` (`{ id, name, email, phone, createdAt }`) and `token` (JWT string).
   - Initializes from and syncs with browser `localStorage` (`atelier_user` and `atelier_token`).
   - Controls visibility of the global `AuthModal` (`isAuthModalOpen`, `authModalTab`).
   - Exposes `login(emailOrPhone, password)`, `register({ name, email, phone, password })`, and `logout()`.
2. **`CartContext` (`frontend/src/context/CartContext.jsx`)**:
   - Manages `items` array.
   - Computes unique `cartItemId` using `${product.id}-${JSON.stringify(customizations)}`.
   - Exposes `addToCart`, `updateQuantity`, `removeFromCart`, `increaseQuantity`, `decreaseQuantity`, `clearCart`.
   - Computes derived `totalQuantity` and `subtotal`.

---

## 5. Backend Architecture

### Server & Middleware Pipeline
- Entry point: `backend/src/server.js` boots the server, invokes `connectDatabase()` from `backend/src/config/db.js`, and binds port `5001`.
- App configuration: `backend/src/app.js` mounts:
  - `cors()` for cross-origin requests.
  - `express.json()` for parsing JSON payloads.
  - Health endpoint `GET /api/health` returning live MongoDB connection state.
  - Mounts routes: `/api/orders`, `/api/reviews`, `/api/reservations`, `/api/categories`, `/api/products`, `/api/users`, `/api/auth`, `/api/admin`.

### Controllers & Services
- `authController.js`: Handles patron user creation with bcrypt hashing and JWT issuance; verifies credentials on login supporting either email or mobile number.
- `orderController.js`: Inserts verified orders into MongoDB, fetches user-specific orders via user ID, email, or phone matching, and supports order retrieval and deletion.
- `reservationController.js`: Fetches all reservations and creates new table/tasting reservations in MongoDB.
- `reviewController.js`: Fetches all reviews and persists verified patron reviews.

---

## 6. Database Architecture & Schemas

The application is connected via Mongoose to **MongoDB Atlas** (`cluster0.s4amspf.mongodb.net`, database: `atelier_coffee`).

### Active Mongoose Collections

#### 1. `users` (`backend/src/models/User.js`)
| Field | Type | Required | Unique | Description |
|---|---|---|---|---|
| `name` | String | Yes | No | Full name of the patron (trimmed) |
| `email` | String | Yes | Yes | Unique lowercase email |
| `phone` | String | Yes | No | Contact phone number |
| `password` | String | Yes | No | bcrypt-hashed password (salt 10) |
| `createdAt` | Date | Auto | No | Mongoose timestamp |
| `updatedAt` | Date | Auto | No | Mongoose timestamp |

#### 2. `orders` (`backend/src/models/Order.js`)
| Field | Type | Required | Unique | Description |
|---|---|---|---|---|
| `userId` | ObjectId | No | No | Reference to `User` model (optional for guest orders) |
| `customerName` | String | Yes | No | Full name of patron placing the order |
| `customerEmail` | String | No | No | Patron email address |
| `customerPhone` | String | Yes | No | Patron contact phone |
| `items` | Array | Yes | No | Array of ordered items, prices, quantities, customizations |
| `subtotal` | Number | Yes | No | Sum of items before tax |
| `tax` | Number | Yes | No | 5% GST tax calculation |
| `total` | Number | Yes | No | Grand total in INR |
| `orderType` | String | Yes | No | `'Table Service'` or `'Bar Pickup'` |
| `tableNumber` | String | Yes | No | Table designation (e.g. `'Table 04 · Pavilion'`) |
| `paymentMethod`| String | Yes | No | `'UPI'`, `'Card'`, or `'Cash at Bar'` |
| `paymentStatus`| String | Yes | No | `'Paid'` or `'Pending'` |
| `paymentDetails`| Object | No | No | Holds `transactionId`, `upiId`, or `cardLast4` |
| `status` | String | Yes | No | `'Ordered'`, `'Received'`, `'Preparing'`, `'Ready'`, `'Delivered'` (Default: `'Ordered'`) |
| `notes` | String | No | No | Special patron instructions |
| `createdAt` | Date | Auto | No | Mongoose timestamp |

#### 3. `reservations` (`backend/src/models/Reservation.js`)
| Field | Type | Required | Unique | Description |
|---|---|---|---|---|
| `name` | String | Yes | No | Patron name |
| `phone` | String | No | No | Contact number |
| `guests` | String | Yes | No | Guest count (e.g. `'2 Guests'`) |
| `date` | String | Yes | No | Selected reservation date (`YYYY-MM-DD`) |
| `time` | String | Yes | No | Selected reservation time (`HH:mm`) |
| `notes` | String | No | No | Special requests or dietary notes |
| `status` | String | Yes | No | Reservation status (Default: `'Confirmed'`) |
| `createdAt` | Date | Auto | No | Mongoose timestamp |

#### 4. `reviews` (`backend/src/models/Review.js`)
| Field | Type | Required | Unique | Description |
|---|---|---|---|---|
| `author` | String | Yes | No | Patron name |
| `publication` | String | No | No | Citation / Badge (e.g. `'Verified Patron'`) |
| `quote` | String | Yes | No | Review text |
| `rating` | Number | Yes | No | 1 to 5 star rating |
| `favoriteItem`| String | No | No | Recommended menu item |
| `date` | String | No | No | Formatted review date (e.g. `'Sep 2026'`) |
| `createdAt` | Date | Auto | No | Mongoose timestamp |

---

## 7. Page & Route Map

| Client Route / Hash | Page Component | Key Functionality | Dependent Subcomponents |
|---|---|---|---|
| `/` or `#home` | `frontend/src/pages/Home.jsx` | Landing page, brand storytelling, reviews, roastery details, tasting reservation modal | `HeroSection`, `RoastingPhilosophy`, `DigitalService`, `TestimonialsSection`, `VisitRoastery`, `HomeFooter`, `TastingModal` |
| `#menu` | `frontend/src/pages/Menu.jsx` | Artisanal catalog (46 items across 9 categories), real-time search, category intersection observer, product customizer, add-to-cart | `CategoryNav`, `CategorySidebar`, `CategorySection`, `ProductCard`, `ProductDetails`, `CartBar` |
| `#checkout` | `frontend/src/pages/Checkout.jsx` | Multi-step ordering: Table selector / Bar Pickup, Patron info, UPI/Card/Cash payment simulator, MongoDB order dispatch | Visual payment cards, QR code simulator, Order confirmation screen |
| `#profile` or `#orders` | `frontend/src/pages/Profile.jsx` | Patron dashboard: Account details, MongoDB past order history retrieval, re-order quick actions, reservation history | Re-order handlers, authentication prompts |

---

## 8. Component Map

### Core Layout Components
- `HomeNavbar.jsx` (`frontend/src/components/home/HomeNavbar.jsx`): Responsive header with brand crest, navigation links, Sign In/Profile avatar toggle, and interactive Cart Pill with total item badge.
- `CartDrawer.jsx` (`frontend/src/components/cart/CartDrawer.jsx`): Fixed slide-over drawer showing active cart line items, customization badges, quantity adjusters, subtotal, and checkout CTA.
- `AuthModal.jsx` (`frontend/src/components/auth/AuthModal.jsx`): Floating authentication dialog with Sign In (email/phone) and Sign Up tabs, validation, and error banner.
- `PageTransition.jsx` (`frontend/src/components/common/PageTransition.jsx`): Fixed full-screen video overlay playing `/atelier-transition.webm` or `/transition.mp4` with luxury glowing card.

### Home Components
- `HeroSection.jsx`: Brand kicker, Playfair headline, dual CTA buttons ("Explore Artisanal Menu" and "Reserve Tasting Table").
- `RoastingPhilosophy.jsx`: 3-card craft presentation (Thermal Profiling, Direct Trade Terroir, Hydro-Extraction Science).
- `DigitalService.jsx`: Visual guide explaining contactless ordering at tables via QR scan.
- `TestimonialsSection.jsx`: Carousel of patron cupping notes; synchronizes with MongoDB Atlas `reviews` collection and triggers `AddReviewModal`.
- `AddReviewModal.jsx`: Form allowing any patron to submit a review directly into MongoDB Atlas.
- `VisitRoastery.jsx`: Interactive map card pointing to SVKM's Shri Bhagubhai Mafatlal Polytechnic / NMIMS Campus, operating hours, and tasting booking trigger.
- `TastingModal.jsx`: Booking form with date/time pickers and hours validation (07:00 AM – 11:59 PM); submits to MongoDB Atlas `reservations` collection.
- `HomeFooter.jsx`: Roastery dispatch subscription, opening hours, campus map links, and copyright notice.

### Menu Components
- `CategoryNav.jsx` & `CategorySidebar.jsx`: Category navigation with active category highlight synchronized via `IntersectionObserver`.
- `ProductCard.jsx`: Menu item card featuring optimized WebP image, name, price in INR, calorie pill, and quick "Add" button.
- `ProductDetails.jsx`: Modal for selecting item quantity and add-on modifiers (Extra Espresso Shot, Whipped Cream, Irish Cream, Hazelnut, Vanilla, Salted Caramel, Chocolate Fudge, Vanilla Scoop).

---

## 9. API Inventory

| HTTP Method | Endpoint | Frontend Caller | Backend Controller | Request Body / Params | Database Action |
|---|---|---|---|---|---|
| `GET` | `/api/health` | Diagnostic monitoring | Inline in `app.js` | None | Reads `mongoose.connection.readyState` |
| `POST` | `/api/auth/register` | `AuthContext.jsx:register` | `authController.js:register` | `{ name, email, phone, password }` | Creates document in `users` collection |
| `POST` | `/api/auth/login` | `AuthContext.jsx:login` | `authController.js:login` | `{ email, password }` | Finds user by email or phone; compares bcrypt hash |
| `GET` | `/api/auth/me` | Patron profile sync | `authController.js:getMe` | Headers: `Authorization: Bearer <token>` | Queries `users` collection by decoded JWT ID |
| `POST` | `/api/orders` | `Checkout.jsx:handlePlaceOrder` | `orderController.js:createOrder` | `{ userId, customerName, customerPhone, items, subtotal, tax, total, orderType, tableNumber, paymentMethod, paymentDetails, notes }` | Creates document in `orders` collection |
| `GET` | `/api/orders/user/:userId` | `Profile.jsx:fetchData` | `orderController.js:getOrdersByUser` | Params: `userId`, Query: `?email=...&phone=...` | Finds orders matching `userId`, `customerEmail`, or `customerPhone` |
| `GET` | `/api/orders` | Admin / Kitchen display | `orderController.js:getOrders` | None | Returns 50 most recent orders |
| `GET` | `/api/orders/:id` | Order tracking | `orderController.js:getOrderById` | Params: `id` | Queries `orders` by `_id` |
| `DELETE` | `/api/orders/:id` | Order cancellation | `orderController.js:deleteOrder` | Params: `id` | Deletes document from `orders` collection |
| `GET` | `/api/reservations` | `Profile.jsx:fetchData` | `reservationController.js:getReservations` | None | Finds all documents in `reservations` collection |
| `POST` | `/api/reservations` | `TastingModal.jsx:handleSubmit` | `reservationController.js:createReservation` | `{ name, phone, guests, date, time, notes }` | Creates document in `reservations` collection |
| `GET` | `/api/reviews` | `TestimonialsSection.jsx` | `reviewController.js:getReviews` | None | Finds all documents in `reviews` collection |
| `POST` | `/api/reviews` | `TestimonialsSection.jsx:handleAddReview` | `reviewController.js:createReview` | `{ author, publication, quote, rating, favoriteItem, date }` | Creates document in `reviews` collection |
| `GET` | `/api/categories` | Future API integration | `categoryController.js:getCategories` | None | Returns empty array (current stub) |
| `GET` | `/api/products` | Future API integration | `productController.js:getProducts` | None | Returns empty array (current stub) |

---

## 10. Data-Flow Diagrams

### A. Ordering & Payment Flow
```
Patron adds item with add-ons to Cart (ProductDetails.jsx)
  │
  ▼
CartContext calculates custom item hash & subtotal (CartContext.jsx)
  │
  ▼
Patron clicks "Proceed to Checkout" (CartDrawer.jsx)
  │
  ▼
Navigates to #checkout (App.jsx -> Checkout.jsx)
  │
  ▼
Patron selects Table Number / Pickup & chooses Payment Method (UPI / Card / Cash)
  │
  ▼
Patron clicks "Pay & Place Order"
  │
  ▼
Simulated 1.2s payment gateway handshake
  │
  ▼
HTTP POST /api/orders with order payload
  │
  ▼
Backend orderController creates Order in MongoDB Atlas
  │
  ▼
MongoDB returns saved Order document with generated _id
  │
  ▼
Frontend clearCart() & displays Confirmation Screen with Order ID
```

### B. Patron Authentication Flow
```
Patron opens Sign In modal from Navbar (HomeNavbar.jsx)
  │
  ▼
Enters Email or Phone Number and Password (AuthModal.jsx)
  │
  ▼
HTTP POST /api/auth/login
  │
  ▼
Backend authController queries User by email OR phone
  │
  ▼
bcrypt.compare(password, user.password)
  │
  ▼
jwt.sign({ id, email, name }, JWT_SECRET, { expiresIn: '7d' })
  │
  ▼
Frontend receives { success: true, token, user }
  │
  ▼
AuthContext stores in localStorage ('atelier_user', 'atelier_token')
  │
  ▼
Navbar immediately updates to display Patron Name & Avatar
```

---

## 11. Database & Data Storage Audit

| Data Entity | Current Source | Current Storage | Read Location | Write Location | Survives Restart? | Target Storage |
|---|---|---|---|---|---|---|
| Menu Products (46 items) | `frontend/src/data/menuData.js` | Hardcoded JS Module | `Menu.jsx`, `ProductDetails.jsx` | Static File | Yes (file) | MongoDB Atlas (`products` collection) |
| Add-on Modifiers (8 items) | `frontend/src/data/menuData.js` | Hardcoded JS Module | `ProductDetails.jsx` | Static File | Yes (file) | MongoDB Atlas (`addons` collection) |
| User Accounts | Client Form (`AuthModal.jsx`) | MongoDB Atlas (`users` collection) | `authController.js:login` | `authController.js:register` | Yes | MongoDB Atlas |
| Client Auth Session | API Response (`/api/auth/login`) | `localStorage` (`atelier_token`, `atelier_user`) | `AuthContext.jsx` | `AuthContext.jsx` | Yes (browser) | `localStorage` + JWT verification |
| Cart Items | User Selections | React Memory State (`CartContext.jsx`) | `CartDrawer.jsx`, `Checkout.jsx` | `CartContext.jsx` | No (resets on reload) | Optional `localStorage` sync |
| Placed Orders | `Checkout.jsx` | MongoDB Atlas (`orders` collection) | `Profile.jsx:fetchData` | `orderController.js:createOrder` | Yes | MongoDB Atlas |
| Table Reservations | `TastingModal.jsx` | MongoDB Atlas (`reservations` collection) | `Profile.jsx:fetchData` | `reservationController.js:createReservation` | Yes | MongoDB Atlas |
| Editorial Reviews | `AddReviewModal.jsx` | MongoDB Atlas (`reviews` collection) | `TestimonialsSection.jsx` | `reviewController.js:createReview` | Yes | MongoDB Atlas |
| Newsletter Dispatch | `HomeFooter.jsx` | React Memory State (`HomeFooter.jsx`) | UI Toast | UI Form State | No (transient) | MongoDB Atlas (`subscribers` collection) |

---

## 12. Environment Variables & Secrets Audit

### 1. `backend/.env`
- `PORT=5001`: Port on which the Express API server listens. Required for local development. On Render, Render provides `PORT` dynamically.
- `MONGODB_URI`: Secure connection string to MongoDB Atlas.
  - **Classification**: STRICTLY CONFIDENTIAL / BACKEND ONLY.
  - **Client Exposure**: Never exposed to Vite/React client.
  - **Git Status**: Safely ignored by `.gitignore`.

### 2. Frontend Environment Variables
- In development, Vite uses the proxy configured in `frontend/vite.config.js` (`/api` -> `http://localhost:5001`).
- For production deployment on Vercel, `VITE_API_URL` should be defined to point to the hosted backend URL (e.g. `https://atelier-coffee-backend.onrender.com`), or handled via Vercel rewrites in `vercel.json`.

---

## 13. Image & Asset Architecture
- **Menu Assets**: 54 high-resolution WebP images stored in `frontend/src/assets/images/menu/` covering all 46 products and 8 add-on modifiers.
- **Brand Assets**: `logo.webp` and `logo.png` in both `frontend/public/` and `frontend/src/assets/images/`.
- **Cinematic Video Assets**:
  - `frontend/public/atelier-transition.webm`: Ultra-optimized WebM transition video (108 KB).
  - `frontend/public/transition.mp4`: Universal MP4 fallback video (24 KB).
- **Integrity Assertion**: `frontend/src/data/menuData.js` contains automated compile-time assertions enforcing 46 products, 8 add-ons, and 54 unique image references.

---

## 14. UI/UX & Responsiveness
- **Color Palette**: Curated luxury roastery palette:
  - Backgrounds: `#fff8f5` (warm cream), `#fbf2ec` (soft linen), `#342f2c` (deep roasted cacao).
  - Accents: `#84310e` (warm roasted amber), `#a34824` (copper terracotta).
  - Typography: `#1f1b18` (espresso black), `#665c55` (stone mocha).
- **Typography**: Google Fonts `Playfair Display` (editorial serif headings) and `Plus Jakarta Sans` (crisp modern body text).
- **Responsive Breakpoints**:
  - Desktop (>1280px): 3-column product grid with persistent sticky category sidebar.
  - Tablet (768px – 1279px): 2-column product grid with condensed sidebar.
  - Mobile (<768px): Single-column product feed with horizontal swipeable category pills and bottom sticky Cart Bar.

---

## 15. Security Considerations & Technical Debt
1. **JWT Secret Fallback**: `backend/src/controllers/authController.js` currently defaults to a fallback string if `process.env.JWT_SECRET` is not set. A dedicated `JWT_SECRET` must be set in the production environment.
2. **Middleware Enforcement**: `backend/src/middleware/authMiddleware.js` is currently a pass-through stub (`next()`). Protected endpoints should verify tokens via `jwt.verify`.
3. **Database Input Sanitization**: While Mongoose schema types validate types, adding express-rate-limit to `/api/auth` endpoints will protect against brute-force attacks.
4. **CORS Policy**: `backend/src/app.js` currently allows all origins (`cors()`). In production, this should be restricted to the authorized Vercel frontend domain.

---

## 16. Deployment Plan

### Frontend: Vercel
- **Framework Preset**: Vite
- **Build Command**: `npm run build` (runs `vite build`)
- **Output Directory**: `frontend/dist`
- **Root Directory**: `frontend`
- **Routing Configuration**: Create `frontend/vercel.json` with rewrites for client-side routing.

### Backend: Render
- **Environment**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start` (runs `node src/server.js`)
- **Root Directory**: `backend`
- **Environment Variables**: `MONGODB_URI`, `PORT`, `JWT_SECRET`, `NODE_ENV=production`.

### Database: MongoDB Atlas
- **Cluster**: Already configured and active (`cluster0.s4amspf.mongodb.net`).
- **Network Access**: Ensure IP Access List allows `0.0.0.0/0` (All IPs) for Render backend access.

---

## 17. Files That Must NOT Be Modified Without Explicit Reason
1. `frontend/src/data/menuData.js`: Contains strict integrity assertions (46 products, 8 add-ons, 54 unique images). Changing products without updating image references triggers compile errors.
2. `backend/src/config/db.js`: Contains robust MongoDB Atlas connection logic with event listeners.
3. `backend/.env`: Holds live Atlas credentials. Must never be tracked in git or committed.
4. `frontend/src/components/common/PageTransition.jsx`: Perfectly calibrated video pop-up timing; must only fire on reload and menu transition as instructed by the user.
5. `frontend/src/context/CartContext.jsx`: Core cart hashing engine. Any modification risks breaking cart state and checkout totals.
6. `frontend/src/pages/Checkout.jsx`: Handles dual delivery modes, GST calculations, simulated payment states, and MongoDB order creation.

---

## 18. Recommended Next Implementation Steps
1. **Add Newsletter Dispatch API**: Create `Subscriber` model and `POST /api/newsletter` to persist footer email subscriptions in MongoDB.
2. **Productionize Auth Middleware**: Connect `backend/src/middleware/authMiddleware.js` to inspect JWT tokens and attach authenticated user to request context.
3. **Menu Database Synchronization**: Create an idempotent seed script that populates the MongoDB `products` and `categories` collections using `menuData.js` without disrupting frontend stability.
4. **Vercel & Render Deployment Files**: Add `frontend/vercel.json` and `render.yaml` for zero-configuration cloud deployment.
