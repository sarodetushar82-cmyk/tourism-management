# Tourism Management System (GlobeTrek)

A complete, modern, responsive **Tourism Management System** built with **HTML5, CSS3, JavaScript, Node.js, Express.js, and MySQL**.

Designed specifically for college capstone projects, academic evaluations, and enterprise travel booking workflows.

---

## 🌟 Key Features

### 1. Public Portal
* **Home Page (`index.html`)**:
  * Hero banner with dynamic tourism photography, glowing badges, and action buttons (*Explore Destinations* and *View Packages*).
  * Instant destination search bar.
  * Popular destinations showcase (Goa, Manali, Kashmir, Jaipur, Kerala, etc.).
  * Featured tour packages with duration, services, and live pricing.
  * "Why Choose Us" feature cards.
  * Customer reviews & testimonials with star ratings.
  * Professional footer with quick links, contacts, and social channels.

* **Destinations Page (`destinations.html`)**:
  * Grid of tourist destination cards featuring photos, location, approximate cost, and season tags.
  * Real-time search filter and budget selector (Under ₹15,000, ₹15,000–₹20,000, Above ₹20,000).
  * Quick filter pills (*All*, *Most Popular*).

* **Destination Details Page (`destination-details.html`)**:
  * Full-width header image with location and starting price.
  * In-depth destination overview and cultural history.
  * Best time to visit and travel logistics (airports, trains, highways).
  * Key attractions badges & activities checklist (watersports, paragliding, safaris).
  * Related tour packages and sticky booking widget.

* **Tour Packages Page (`packages.html`)**:
  * Holiday package cards with day/night duration counters.
  * Included services badges (4-Star Resorts, Daily Breakfast, Private AC Cab, Sightseeing).
  * Filters by Destination, Duration (Short, Medium, Long), and Budget.

* **Booking Page (`booking.html`)**:
  * Dynamic destination and tour package dropdowns (selecting one auto-filters the other).
  * Departure date picker with date validation (disallows past dates).
  * Travelers count stepper with **live total price calculation**.
  * Form validation and instant confirmation modal displaying the generated booking reference number (e.g., `TRV-2026-XXXX`).

* **About Us Page (`about.html`)**:
  * Company history, mission, vision, core services, and leadership team.

* **Contact Us Page (`contact.html`)**:
  * Inquiry submission form with database storage.
  * Contact cards (Helpline, Email, Corporate Address, Operating Hours).
  * Embedded interactive Google Maps view.

---

### 2. User Authentication & Dashboard
* **Login & Registration (`login.html`, `register.html`)**:
  * Secure password hashing using **bcryptjs**.
  * **JWT (JSON Web Token)** authentication stored in client session.
  * Dedicated tabs for User Login and Administrator Portal.
  * **One-Click Demo Fill buttons** for examiners and evaluators (`john@example.com` / `user123`).

* **Traveler Dashboard (`dashboard.html`)**:
  * Traveler profile card with personal details.
  * Summary metrics: Total Bookings, Upcoming Trips, Completed Trips, and Cancelled.
  * Tabs to view *All*, *Upcoming*, *Completed*, and *Cancelled* trips.
  * **Cancel Booking action** with confirmation.

---

### 3. Administrator Control Center (`admin.html`)
* **Live Overview Statistics**:
  * Total Registered Users counter.
  * Total Bookings placed.
  * Total Destinations in system.
  * Total Tour Packages available.
  * Total Confirmed Revenue calculation (in ₹).
  * Pending bookings requiring review.
  * Recent bookings and latest inquiries tables.

* **Destinations Management**:
  * View destinations catalog with photos, location, approximate cost, and popular tags.
  * **Add New Destination** modal form.
  * **Edit Destination** modal form.
  * **Delete Destination** action with confirmation.

* **Tour Packages Management**:
  * View tour packages list with preview, duration, price, and included amenities.
  * **Add New Package** modal form.
  * **Edit Package** modal form.
  * **Delete Package** action.

* **Bookings Management**:
  * View all customer bookings with reference number, customer name, email, phone, trip date, travelers count, and total amount.
  * **Dynamic Status Selector**: Change status directly between `Pending`, `Confirmed`, `Completed`, and `Cancelled`.
  * Detailed booking preview popup.

* **User Management**:
  * View all registered traveler accounts with registration dates.
  * Delete user accounts.

* **Contact Messages Management**:
  * View customer inquiries.
  * Modal reader for full inquiry body.
  * Direct "Reply via Email" mailto link.
  * Delete inquiry action.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML5, CSS3 (Modern Responsive Design System, Glassmorphism, CSS Grid & Flexbox), Vanilla JavaScript (ES6+) |
| **Icons & Typography** | FontAwesome 6, Google Fonts (*Plus Jakarta Sans* & *Playfair Display*) |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL (with automatic schema creation & seed data) |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs password hashing |
| **Database Driver** | `mysql2/promise` with intelligent demo fallback |

---

## 📁 Project Folder Structure

```
project 1/
├── config/
│   └── db.js                 # MySQL connection pool + auto fallback store
├── controllers/
│   ├── adminController.js    # Admin statistics, metrics, and user management
│   ├── authController.js     # User & Admin authentication and profile
│   ├── bookingController.js  # Bookings creation, user history, cancellation & admin updates
│   ├── contactController.js  # Inquiries submission and admin management
│   ├── destinationController.js # Destinations CRUD, search and filters
│   ├── packageController.js  # Tour packages CRUD and duration/price filters
│   └── reviewController.js   # Customer testimonials and star ratings
├── database/
│   ├── database.sql          # Complete MySQL schema & initial seed data
│   └── seedData.js           # Seed data records for auto-initialization
├── middleware/
│   └── authMiddleware.js     # JWT token verification for User & Admin
├── public/                   # Static Frontend Files
│   ├── css/
│   │   ├── style.css         # Universal modern design system, animations, badges
│   │   └── admin.css         # Admin dashboard specific layout and dark sidebar
│   ├── js/
│   │   ├── admin.js          # Admin dashboard operations & CRUD modals
│   │   ├── api.js            # Unified API fetch helper, session storage, toasts
│   │   ├── auth.js           # Login & Registration validation and handlers
│   │   ├── booking.js        # Dynamic booking form & live price calculation
│   │   ├── contact.js        # Contact message form submission
│   │   ├── dashboard.js      # User dashboard & booking cancellation
│   │   ├── destination-details.js # Destination detail page & related packages
│   │   ├── destinations.js   # Destinations catalog, search, and filters
│   │   ├── main.js           # Home page scripts & dynamic loaders
│   │   └── packages.js       # Tour packages catalog and filters
│   ├── about.html            # 10. About Us Page
│   ├── admin.html            # 9. Admin Dashboard
│   ├── booking.html          # 5. Booking Page
│   ├── contact.html          # 11. Contact Us Page
│   ├── dashboard.html        # 8. User Dashboard
│   ├── destination-details.html # 4. Destination Details Page
│   ├── destinations.html     # 2. Destinations Page
│   ├── index.html            # 1. Home Page
│   ├── login.html            # 6. Login Page
│   ├── packages.html         # 3. Tour Packages Page
│   └── register.html         # 7. Registration Page
├── .env.example              # Environment variables template
├── .env                      # Active environment configuration
├── package.json              # Project dependencies & scripts
├── README.md                 # Complete documentation
└── server.js                 # Express server entry point
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have installed:
* [Node.js](https://nodejs.org/) (Version 16 or higher)
* [MySQL](https://www.mysql.com/) or [XAMPP](https://www.apachefriends.org/) (Apache + MySQL)

---

### 2. Installation
Open your terminal inside the project directory and run:

```bash
npm install
```

This installs all required dependencies:
* `express`
* `cors`
* `dotenv`
* `mysql2`
* `bcryptjs`
* `jsonwebtoken`

---

### 3. MySQL Database Setup

1. Start your **MySQL service** (e.g., via XAMPP Control Panel or MySQL service).
2. Open **phpMyAdmin** (`http://localhost/phpmyadmin`) or MySQL Command Line.
3. Import the file [`database/database.sql`](file:///database/database.sql):
   * In phpMyAdmin: Click **Import** -> Choose file `database/database.sql` -> Click **Go**.
   * Or in MySQL CLI:
     ```bash
     mysql -u root -p < database/database.sql
     ```
4. Verify your database settings in [`.env`](file:///.env):
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=tourism_management
   DB_PORT=3306
   JWT_SECRET=tourism_jwt_secure_secret_key_change_in_production_2026
   ```

> **Note on Standalone Demo Mode**: If MySQL is not running on your machine when you start the project, the system will automatically activate its built-in persistent storage so you can present and test all pages, bookings, admin operations, and logins without any setup errors. Once MySQL is started, it seamlessly connects to MySQL.

---

### 4. Run the Project

Start the server using:

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The application will be accessible at:
* **Frontend Website**: [http://localhost:3000](http://localhost:3000)
* **Admin Dashboard**: [http://localhost:3000/admin.html](http://localhost:3000/admin.html)

---

## 🔑 Default Credentials

### 1. Administrator Account
* **URL**: [http://localhost:3000/login.html](http://localhost:3000/login.html) (Select "Admin Login" tab)
* **Email**: `admin@tourism.com`
* **Password**: `admin123`
* *(Tip: You can also click the "Fill Admin Demo" button on the login page)*

### 2. Sample Traveler Account
* **URL**: [http://localhost:3000/login.html](http://localhost:3000/login.html)
* **Email**: `john@example.com`
* **Password**: `user123`
* *(Tip: You can also click the "Fill User Demo" button on the login page or register a new account)*

---

## 📡 REST API Reference

### Authentication
* `POST /api/auth/register` - Register a new traveler
* `POST /api/auth/login` - Traveler login
* `POST /api/auth/admin-login` - Administrator login
* `GET /api/auth/me` - Get authenticated user profile

### Destinations
* `GET /api/destinations` - Get all destinations (supports `?search=`, `?popular=true`, `?minPrice=`, `?maxPrice=`)
* `GET /api/destinations/:id` - Get single destination with its related tour packages
* `POST /api/destinations` - Admin: Create new destination
* `PUT /api/destinations/:id` - Admin: Update destination
* `DELETE /api/destinations/:id` - Admin: Delete destination

### Tour Packages
* `GET /api/packages` - Get all packages (supports `?destination=`, `?duration=`, `?price=`, `?search=`)
* `GET /api/packages/:id` - Get package details
* `POST /api/packages` - Admin: Create new package
* `PUT /api/packages/:id` - Admin: Update package
* `DELETE /api/packages/:id` - Admin: Delete package

### Bookings
* `POST /api/bookings` - Create a new booking
* `GET /api/bookings/my-bookings` - Get current user's booking history
* `PUT /api/bookings/:id/cancel` - Cancel a booking
* `GET /api/bookings/admin/all` - Admin: Get all customer bookings
* `PUT /api/bookings/admin/:id/status` - Admin: Update booking status (`Pending`, `Confirmed`, `Completed`, `Cancelled`)

### Admin Management
* `GET /api/admin/stats` - Admin: Overview KPI statistics & recent records
* `GET /api/admin/users` - Admin: List registered users
* `DELETE /api/admin/users/:id` - Admin: Remove user account

### Inquiries & Reviews
* `POST /api/contact` - Submit inquiry message
* `GET /api/contact/admin/all` - Admin: List all contact inquiries
* `DELETE /api/contact/admin/:id` - Admin: Delete message
* `GET /api/reviews` - Get customer reviews
* `POST /api/reviews` - Post a customer testimonial

---

## 🎓 Academic Presentation Notes

1. **Architecture**: Clean MVC-inspired pattern separating Controllers, Routes, Middleware, Configuration, and Frontend Views.
2. **Security**: Passwords hashed using standard `bcryptjs` with salt rounds; API endpoints protected via JSON Web Tokens (`jwt`).
3. **Database Relational Integrity**: Complete schema with Primary Keys, Foreign Keys, cascading rules, and ENUM status types.
4. **Responsive UI**: Fully mobile, tablet, and desktop responsive using CSS Grid and Flexbox with zero broken layouts.
