# Fixify 🔧

**Pakistan's Premier Home Services Platform**
Book verified technicians for plumbing, electrical, AC, cleaning, mobile repair, and more.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0+-47A248?logo=mongodb&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Enabled-3448C5?logo=cloudinary&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📖 Table of Contents

- [Project Overview](#-project-overview)
- [Technology Stack](#-technology-stack)
- [Features by Role](#-features-by-role)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [WebSocket Events](#-websocket-real-time-events)
- [Frontend Pages & Components](#-frontend-pages--components)
- [Image Storage (Cloudinary)](#-image-storage-cloudinary)
- [Security](#-security)
- [Setup & Installation](#-setup--installation)
- [Environment Variables](#-environment-variables)
- [Demo Accounts](#-demo-accounts)
- [Deployment Guide](#-deployment-guide)
- [Future Roadmap](#-future-roadmap)
- [License](#-license)

---

## 🚀 Project Overview

Fixify is a full-stack MERN web application that connects homeowners with verified service professionals across Pakistan. The platform features role-based dashboards for Users, Technicians, and Admins, a real-time messaging system powered by Socket.io, cloud-based image storage via Cloudinary, and interactive analytics dashboards.

---

## 💻 Technology Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19.x | UI framework |
| Vite | 8.x | Build tool & dev server |
| React Router | 7.x | Client-side routing & protected routes |
| Tailwind CSS | 4.x | Utility-first styling |
| Framer Motion | 12.x | Page transitions & micro-animations |
| Axios | 1.x | HTTP client with JWT interceptors |
| Socket.io-client | 4.x | Real-time WebSocket communication |
| Recharts | 3.x | Dashboard analytics charts |
| Lucide React | 1.x | Icon library |
| React Icons | 5.x | Extended icon set |
| React Hot Toast | 2.x | Toast notifications |
| date-fns | 4.x | Date formatting utilities |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20+ | Runtime |
| Express.js | 4.x | REST API framework |
| MongoDB | 8.x | NoSQL database |
| Mongoose | 8.x | ODM with schema validation |
| Socket.io | 4.x | Real-time WebSocket server |
| Cloudinary | latest | Cloud image storage (WebP) |
| Multer | 1.x | Multipart file upload parsing |
| multer-storage-cloudinary | latest | Cloudinary storage engine for Multer |
| JSON Web Tokens | 9.x | Stateless authentication |
| bcryptjs | 2.x | Password hashing |
| Helmet | 7.x | HTTP security headers |
| express-rate-limit | 7.x | DDoS / brute-force protection |
| express-validator | 7.x | Input validation |
| Morgan | 1.x | HTTP request logging |
| CORS | 2.x | Cross-origin resource sharing |
| Sharp | 0.33 | Server-side image processing |

---

## ✨ Features by Role

### 👤 Users (Customers)
- Browse services by category with search and filters
- View technician profiles with ratings, reviews, skills, and availability
- Book services with date, time, address, and description
- Track booking status (Pending → Accepted → Completed)
- Real-time chat with assigned technicians
- Leave star ratings (1–5) and written reviews
- Manage profile and upload avatar
- Receive real-time notifications for booking updates

### 👨‍🔧 Technicians (Service Providers)
- Dedicated dashboard with job stats, earnings, and rating overview
- Accept or reject incoming booking requests
- View active jobs and completed booking history
- Set custom pricing for offered services
- Configure weekly availability schedule
- Real-time chat with customers
- Track earnings with visual analytics charts
- Manage professional profile (bio, skills, hourly rate)

### 👑 Administrators
- Global analytics dashboard: revenue, user growth, booking volume
- Full CRUD management for users and technicians
- Approve or ban technician accounts
- Full CRUD management for services and categories (with image upload)
- View and manage all platform bookings
- Access revenue reports with interactive charts
- View and manage contact form submissions

---

## 📁 Project Structure

```
fixify/
├── client/                          # React Frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/              # Navbar, Footer, Sidebar, DashboardLayout
│   │   │   ├── HeroAnimation.jsx    # Animated hero section with Framer Motion
│   │   │   └── ProtectedRoute.jsx   # Role-based route guard
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx      # JWT auth state, login/logout, Axios interceptors
│   │   │   ├── SocketContext.jsx    # Socket.io client initialization & reconnection
│   │   │   └── ThemeContext.jsx     # Dark/light mode toggle
│   │   ├── pages/
│   │   │   ├── public/              # 10 pages: Home, About, Services, Technicians, etc.
│   │   │   ├── user/                # 5 pages: Dashboard, Bookings, Messages, Profile, Reviews
│   │   │   ├── technician/          # 6 pages: Dashboard, Bookings, Messages, Profile, Earnings, Availability
│   │   │   └── admin/               # 6 pages: Dashboard, Services, Users, Technicians, Bookings, Reports
│   │   ├── utils/
│   │   │   └── uploadUrl.js         # Smart URL resolver (Cloudinary / local fallback)
│   │   ├── App.jsx                  # Root routing configuration
│   │   └── index.css                # Tailwind config & CSS custom properties
│   ├── vite.config.js               # Vite config with API proxy
│   └── package.json
│
├── server/                          # Express Backend
│   ├── config/
│   │   ├── db.js                    # MongoDB connection via Mongoose
│   │   └── constants.js             # Role enums and app constants
│   ├── controllers/                 # 11 controllers (business logic)
│   │   ├── authController.js        # Register, Login, JWT refresh, Profile, Avatar upload
│   │   ├── adminController.js       # Dashboard stats, User/Tech CRUD, Booking management
│   │   ├── bookingController.js     # Create, list, update status
│   │   ├── categoryController.js    # CRUD with Cloudinary image upload
│   │   ├── contactController.js     # Contact form submission & admin management
│   │   ├── messageController.js     # Conversations, send/receive, mark read
│   │   ├── notificationController.js # List, mark read, mark all read
│   │   ├── paymentController.js     # Create, list by booking, update status
│   │   ├── reviewController.js      # Create, list by technician, reply
│   │   ├── serviceController.js     # CRUD with Cloudinary image upload
│   │   └── technicianController.js  # List, get by ID, update profile
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification, role authorization, token generation
│   │   ├── errorHandler.js          # Global error handler
│   │   └── upload.js                # Multer + Cloudinary storage (auto WebP conversion)
│   ├── models/                      # 12 Mongoose schemas
│   │   ├── User.js                  # Users with password hashing
│   │   ├── Technician.js            # Professional profiles linked to Users
│   │   ├── Category.js              # Service categories
│   │   ├── Service.js               # Individual services
│   │   ├── Booking.js               # Service bookings with status history
│   │   ├── Message.js               # Chat messages
│   │   ├── Notification.js          # System notifications
│   │   ├── Review.js                # Ratings and reviews
│   │   ├── Payment.js               # Payment records
│   │   ├── ContactMessage.js        # Contact form entries
│   │   ├── AdminLog.js              # Admin action audit trail
│   │   └── Setting.js               # Platform settings
│   ├── routes/                      # 11 Express route files
│   ├── uploads/                     # Legacy local image storage (migrated to Cloudinary)
│   ├── app.js                       # Express app setup, middleware, route mounting
│   ├── server.js                    # HTTP server, Socket.io initialization
│   ├── seedDemo.js                  # Demo data seeder (users, services, bookings, messages)
│   ├── migrateCloudinary.js         # One-time migration script (local → Cloudinary)
│   └── package.json
│
└── README.md                        # This file
```

---

## 🗄️ Database Schema

### User
| Field | Type | Description |
|---|---|---|
| name | String | Full name (required) |
| email | String | Unique, lowercase (required) |
| phone | String | Contact number |
| password | String | Bcrypt-hashed, hidden from queries |
| role | Enum | `user`, `technician`, or `admin` |
| avatar | String | Cloudinary URL |
| city | String | User's city |
| address | String | Full address |
| isActive | Boolean | Account active status |
| lastLogin | Date | Last login timestamp |

### Technician
| Field | Type | Description |
|---|---|---|
| user | ObjectId → User | Reference to user account |
| cnic | String | National ID number |
| status | Enum | `pending`, `approved`, `rejected` |
| bio | String | Professional description |
| skills | [String] | Array of skill tags |
| hourlyRate | Number | Rate per hour in PKR |
| avgRating | Number | Calculated average rating |
| totalReviews | Number | Total review count |
| totalJobs | Number | Completed job count |
| experienceYears | Number | Years of experience |
| services | [{ service: ObjectId, customPrice: Number }] | Offered services with pricing |
| availability | { days: [String], startTime, endTime } | Weekly schedule |

### Service
| Field | Type | Description |
|---|---|---|
| name | String | Service name |
| slug | String | URL-friendly identifier |
| category | ObjectId → Category | Parent category |
| basePrice | Number | Starting price in PKR |
| duration | String | Estimated time |
| description | String | Service details |
| image | String | Cloudinary URL |
| isActive | Boolean | Visibility toggle |

### Category
| Field | Type | Description |
|---|---|---|
| name | String | Category name |
| slug | String | URL-friendly identifier |
| description | String | Category details |
| image | String | Cloudinary URL |
| isActive | Boolean | Visibility toggle |

### Booking
| Field | Type | Description |
|---|---|---|
| bookingNumber | String | Unique booking ID (e.g. FIX-20260001) |
| user | ObjectId → User | Customer |
| technician | ObjectId → Technician | Assigned professional |
| service | ObjectId → Service | Requested service |
| bookingDate | Date | Scheduled date |
| bookingTime | String | Scheduled time |
| address / city / phone | String | Service location details |
| description | String | Problem description |
| totalAmount | Number | Final price in PKR |
| status | Enum | `pending`, `accepted`, `completed`, `cancelled` |
| statusHistory | [{ status, notes, changedBy, createdAt }] | Full audit trail |
| completedAt | Date | Completion timestamp |

### Message
| Field | Type | Description |
|---|---|---|
| sender | ObjectId → User | Message author |
| receiver | ObjectId → User | Message recipient |
| message | String | Text content |
| isRead | Boolean | Read receipt |

### Notification
| Field | Type | Description |
|---|---|---|
| user | ObjectId → User | Notification recipient |
| title | String | Notification title |
| message | String | Notification body |
| type | Enum | `booking`, `message`, `payment`, `system`, `review`, `admin` |
| isRead | Boolean | Read status |

### Review
| Field | Type | Description |
|---|---|---|
| user | ObjectId → User | Reviewer |
| technician | ObjectId → Technician | Reviewed professional |
| booking | ObjectId → Booking | Associated booking |
| rating | Number | 1–5 star rating |
| comment | String | Written feedback |
| reply | String | Technician's response |
| status | Enum | `pending`, `approved`, `rejected` |

### Payment
| Field | Type | Description |
|---|---|---|
| booking | ObjectId → Booking | Associated booking |
| amount | Number | Payment amount in PKR |
| method | Enum | `cod`, `jazzcash`, `easypaisa`, `bank_transfer` |
| status | Enum | `pending`, `completed`, `failed`, `refunded` |
| transactionId | String | Gateway reference |

---

## 🔐 API Reference

**Base URL:** `/api`
All protected routes require `Authorization: Bearer <jwt_token>` header.

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Create new user/technician account |
| POST | `/login` | Public | Authenticate and receive JWT tokens |
| POST | `/refresh` | Public | Refresh expired access token |
| GET | `/me` | Protected | Get current user profile |
| PUT | `/profile` | Protected | Update name, phone, city, address |
| PUT | `/password` | Protected | Change password |
| PUT | `/avatar` | Protected | Upload avatar image (→ Cloudinary) |

### Services (`/api/services`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List services (`?category=`, `?search=`) |
| GET | `/:slug` | Public | Get service details by slug |
| POST | `/` | Admin | Create service with image upload |
| PUT | `/:id` | Admin | Update service |
| DELETE | `/:id` | Admin | Delete service |

### Categories (`/api/categories`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List all active categories |
| POST | `/` | Admin | Create category with image upload |
| PUT | `/:id` | Admin | Update category |
| DELETE | `/:id` | Admin | Delete category |

### Technicians (`/api/technicians`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List technicians (`?city=`, `?search=`) |
| GET | `/:id` | Public | Get technician profile with reviews |
| PUT | `/profile` | Technician | Update own professional profile |

### Bookings (`/api/bookings`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Protected | Create a new booking |
| GET | `/` | Protected | Get user's own bookings |
| PUT | `/:id/status` | Protected | Update booking status (accept/complete/cancel) |

### Reviews (`/api/reviews`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Protected | Submit a review for a completed booking |
| GET | `/me` | Protected | Get reviews written by current user |
| GET | `/technician/:techId` | Public | Get all reviews for a technician |
| PUT | `/:id/reply` | Protected | Technician replies to a review |

### Messages (`/api/messages`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/conversations` | Protected | List all conversations for current user |
| GET | `/:userId` | Protected | Get message history with a specific user |
| POST | `/:userId` | Protected | Send a message to a user |
| PUT | `/:userId/read` | Protected | Mark conversation as read |

### Notifications (`/api/notifications`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Protected | Get all notifications for current user |
| PUT | `/read-all` | Protected | Mark all notifications as read |
| PUT | `/:id/read` | Protected | Mark a single notification as read |

### Payments (`/api/payments`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Protected | Create a payment record |
| GET | `/booking/:bookingId` | Protected | Get payments for a booking |
| PUT | `/:id` | Admin | Update payment status |

### Contact (`/api/contact`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Public | Submit a contact form message |
| GET | `/` | Admin | List all contact messages |
| PUT | `/:id` | Admin | Update contact message status |

### Admin (`/api/admin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/stats` | Admin | Platform-wide statistics and revenue data |
| GET | `/users` | Admin | List all users |
| PUT | `/users/:id` | Admin | Edit a user |
| DELETE | `/users/:id` | Admin | Delete a user |
| PUT | `/users/:id/status` | Admin | Activate/deactivate a user |
| GET | `/technicians` | Admin | List all technicians |
| PUT | `/technicians/:id/status` | Admin | Approve/reject technician application |
| GET | `/bookings` | Admin | List all bookings |

---

## 📡 WebSocket (Real-Time) Events

Socket.io runs on the same HTTP server as Express. Connections are authenticated via JWT.

### Connection Flow
1. Client connects with `{ auth: { token: jwt } }`.
2. Server middleware verifies the JWT and attaches `socket.user`.
3. Server tracks online users via an in-memory `Map<userId, socketId>`.

### Events

| Direction | Event | Payload | Description |
|---|---|---|---|
| Client → Server | `join_room` | `roomId` | Join a chat room |
| Client → Server | `leave_room` | `roomId` | Leave a chat room |
| Client → Server | `typing` | `{ room, isTyping }` | Broadcast typing indicator |
| Server → Client | `user_typing` | `{ userId, isTyping }` | Typing indicator for chat partner |
| Server → Client | `new_message` | `messageObject` | New message received |
| Server → Client | `new_notification` | `notificationObject` | System notification pushed |
| Server → All | `online_users` | `[userId, ...]` | Updated list of online user IDs |

### Chat Room ID Convention
Rooms are identified by sorting both user IDs alphabetically and joining them with an underscore:
```
roomId = [userId, receiverId].sort().join('_')
```

---

## 🧩 Frontend Pages & Components

### Public Pages (No auth required)
| Page | Route | Description |
|---|---|---|
| HomePage | `/` | Hero animation, featured services, categories, stats |
| ServicesPage | `/services` | Browse/search/filter services by category |
| ServiceDetailPage | `/services/:slug` | Service details with booking form |
| TechniciansPage | `/technicians` | Browse/search/filter technicians by city |
| TechnicianProfilePage | `/technicians/:id` | Full profile with reviews and message button |
| AboutPage | `/about` | Mission statement, stats, core values |
| ContactPage | `/contact` | Contact form |
| FAQPage | `/faq` | Frequently asked questions |
| LoginPage | `/login` | Authentication with demo credentials |
| RegisterPage | `/register` | User or technician registration |

### User Dashboard (Role: `user`)
| Page | Route | Description |
|---|---|---|
| UserDashboard | `/user/dashboard` | Overview with stats and recent bookings |
| UserBookings | `/user/bookings` | Full booking history with status |
| UserMessages | `/user/messages` | Real-time chat with technicians |
| UserProfile | `/user/profile` | Edit profile and upload avatar |
| UserReviews | `/user/reviews` | Reviews written by the user |

### Technician Dashboard (Role: `technician`)
| Page | Route | Description |
|---|---|---|
| TechDashboard | `/technician/dashboard` | Stats, earnings, and pending requests |
| TechBookings | `/technician/bookings` | Incoming and completed jobs |
| TechMessages | `/technician/messages` | Real-time chat with customers |
| TechProfile | `/technician/profile` | Edit bio, skills, hourly rate |
| TechEarnings | `/technician/earnings` | Revenue charts and payment history |
| TechAvailability | `/technician/availability` | Set weekly schedule |

### Admin Dashboard (Role: `admin`)
| Page | Route | Description |
|---|---|---|
| AdminDashboard | `/admin/dashboard` | Global analytics with Recharts |
| AdminServices | `/admin/services` | Full CRUD for services & categories |
| AdminUsers | `/admin/users` | User management with activate/deactivate |
| AdminTechnicians | `/admin/technicians` | Technician approval and management |
| AdminBookings | `/admin/bookings` | All platform bookings |
| AdminReports | `/admin/reports` | Revenue reports and charts |

### Context Providers
| Context | Purpose |
|---|---|
| `AuthContext` | JWT management, login/logout, user state, Axios interceptors |
| `SocketContext` | Socket.io client initialization and reconnection |
| `ThemeContext` | Dark/light mode toggle via Tailwind's `dark` class |

---

## ☁️ Image Storage (Cloudinary)

All image uploads are handled via **Cloudinary** cloud storage.

### How It Works
1. User uploads an image via the frontend (avatar, service image, or category image).
2. `multer` parses the multipart form data.
3. `multer-storage-cloudinary` uploads the file directly to Cloudinary.
4. **All images are automatically converted to WebP format** for optimal performance.
5. The full Cloudinary secure URL is saved to the MongoDB document.
6. The frontend `uploadUrl.js` utility detects absolute URLs and passes them directly to `<img>` tags.

### Cloudinary Folder Structure
```
fixify/
├── avatars/      # User and technician profile pictures
├── services/     # Service card images
├── categories/   # Category images
└── misc/         # Other uploads
```

---

## 🛡️ Security

| Feature | Implementation |
|---|---|
| Password Hashing | bcryptjs with 12 salt rounds |
| Authentication | JWT access + refresh token pair |
| Authorization | Role-based middleware (`user`, `technician`, `admin`) |
| HTTP Headers | Helmet (CSP, X-Frame-Options, XSS Protection) |
| Rate Limiting | express-rate-limit (configurable window and max) |
| CORS | Whitelisted frontend origin only |
| File Upload | Type validation (JPG, PNG, WEBP only), 5MB max |
| Input Validation | express-validator on API inputs |
| Password Security | Passwords excluded from all query results via `select: false` |

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (free tier works)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/fixify.git
cd fixify
```

### 2. Backend Setup
```bash
cd server
npm install

# Create .env file (see Environment Variables section below)

# Seed demo data (optional but recommended)
node seedDemo.js

# Start backend server (port 5000)
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install

# Start Vite dev server (port 5173)
npm run dev
```

### 4. Open the App
Navigate to `http://localhost:5173` in your browser.

---

## 🔑 Environment Variables

Create a `server/.env` file with the following:

```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/fixify

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100

# File Upload
MAX_FILE_SIZE=5242880
```

---

## 👥 Demo Accounts

Run `node seedDemo.js` in the server directory to populate demo data. All passwords are `password`.

| Role | Email | Use Case |
|---|---|---|
| **Admin** | `admin@fixithub.pk` | Full platform management |
| **User** | `ahmed@example.com` | Booking, reviews, messaging |
| **User** | `fatima@example.com` | Booking, messaging |
| **Technician** | `usman@example.com` | Accept jobs, earnings tracking |
| **Technician** | `ali@example.com` | Profile management, chat |

The seeder populates: 5 users, 4 categories, 6 services, 2 technician profiles, 3 bookings, 3 reviews, 8 chat messages, and 7 notifications — all with Cloudinary-hosted images.

---

## 🌍 Deployment Guide

### Backend → Render / Railway
1. Create a Web Service pointing to the `server/` directory.
2. Build command: `npm install`
3. Start command: `npm start`
4. Set all environment variables from the section above.
5. Set `NODE_ENV=production` and `CLIENT_URL=https://your-frontend.vercel.app`.

### Frontend → Vercel / Netlify
1. Create a project pointing to the `client/` directory.
2. Framework: Vite (auto-detected).
3. Build command: `npm run build` — Output directory: `dist`.
4. Environment variables:
   - `VITE_API_BASE_URL=https://your-backend.onrender.com/api`
   - `VITE_UPLOADS_URL=https://your-backend.onrender.com`

---

## 🔮 Future Roadmap

- **Mobile App:** React Native app using the existing Express API
- **Payment Integration:** Stripe, JazzCash, and EasyPaisa gateway integration
- **Geolocation:** Map-based technician tracking during service visits
- **AI Chatbot:** Automated customer support triage
- **Multi-Language:** Urdu and regional language localization
- **Push Notifications:** Firebase Cloud Messaging for mobile

---

## 📄 License

This project was developed for educational and portfolio purposes. Open-sourced under the MIT License.

---

**Built with ❤️ in Pakistan** | Fixify © 2026