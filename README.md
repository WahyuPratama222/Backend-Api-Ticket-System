<div align="center">
  <h1>🎫 Ticket System API</h1>

  <p>
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
    <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
    <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
    <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
    <img src="https://img.shields.io/badge/Bcrypt-003A8F?style=for-the-badge&logo=letsencrypt&logoColor=white" />
    <img src="https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white" />
  </p>

  <p>
    <strong>RESTful API untuk sistem tiket event dengan autentikasi dan otorisasi berbasis role</strong><br />
  </p>

  <p>
    <img src="https://img.shields.io/badge/Status-Active-success" />
    <img src="https://img.shields.io/badge/Version-1.0.0-blue" />
  </p>
</div>

---

## 🌟 Gambaran Umum

> Backend service untuk sistem manajemen tiket event dengan fokus pada **keamanan autentikasi**, **kontrol akses berbasis role**, dan **real-time stock validation**

Ticket System API adalah backend service yang menyediakan fitur lengkap untuk manajemen event dan pemesanan tiket, dilengkapi dengan sistem autentikasi JWT, role-based access control, dan validasi stok real-time menggunakan database transaction & locking.

Aplikasi ini dirancang dengan pendekatan **RESTful API**, menerapkan **best practice Express & Prisma**, serta memperhatikan aspek **keamanan, konsistensi data, dan skalabilitas**.

---

## ✨ Fitur Utama

### 🚀 Kenapa Project Ini? 
- Implementasi **JWT Authentication** untuk secure access control
- **Role-Based Authorization** (Customer & Organizer)
- **Real-time Stock Validation** dengan Prisma transaction & row locking
- **Rate Limiting** untuk mencegah abuse
- **Input Validation** dengan Zod schema
- Struktur kode yang clean dan maintainable

### 🔹 Fungsionalitas Inti
- 👥 **Manajemen User** (Customer & Organizer)
- 🔐 **Autentikasi & Otorisasi** berbasis JWT + bcrypt
- 🎉 **Manajemen Event** (Organizer only)
- 🎫 **Sistem Booking Tiket** (Customer only, dengan stok real-time)
- 🎟️ **Manajemen Tiket** (Generate, track, mark as used)

### 🔹 Sorotan Teknis
- 🎯 **Database Transaction** dengan Prisma
- 🔒 **Row-Level Locking** untuk mencegah race condition
- ✅ **Input Validation** di setiap endpoint dengan Zod
- 🛡️ **JWT Authentication** dengan role-based middleware
- 🚦 **Rate Limiting** untuk auth & booking endpoints
- 🏗️ **Clean Architecture** dengan separation of concerns
- 📝 **Comprehensive Documentation** di README & Postman Collection

---

## 📋 Daftar Isi
1. [Prasyarat](#prasyarat)
2. [Instalasi](#instalasi)
3. [Setup Database](#setup-database)
4. [Konfigurasi Environment](#konfigurasi-environment)
5. [Menjalankan Aplikasi](#menjalankan-aplikasi)
6. [Struktur Proyek](#struktur-proyek)
7. [API Endpoints](#api-endpoints)
8. [Arsitektur & Keamanan](#arsitektur--keamanan)
9. [Fitur Keamanan](#fitur-keamanan)
10. [Business Logic](#business-logic)
11. [Testing dengan Postman](#testing-dengan-postman)
12. [Troubleshooting](#troubleshooting)

---

## 🔧 1. Prasyarat

Pastikan environment pengembangan telah memenuhi kebutuhan berikut:
- **Node.js** >= 18.x
- **MySQL** >= 8.0
- **npm** >= 6.x
- **Git** (untuk clone repository)

---

## 📦 2. Instalasi

Clone repository dan install seluruh dependency:

```bash
git clone <repository-url>
cd backend-api-ticket-system
npm install
```

---

## 🗄️ 3. Setup Database

Project ini menggunakan **Prisma ORM** untuk mengelola database.

### 🔹 Setup Database

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database dengan data dummy
npm run db:seed

# Reset database (drop + migrate + seed)
npm run db:reset
```

### 🔹 Prisma Commands

```bash
# Open Prisma Studio (Database GUI)
npm run db:studio
```

---

## ⚙️ 4. Konfigurasi Environment

Buat file `.env` di root project dengan template berikut:

```env
# Server Configuration
SERVER_PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL="mysql://root:your_password@localhost:3306/ticket_system"

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# CORS Configuration
CLIENT_URL=http://localhost:3000,http://localhost:5173
```

> ⚠️ **Penting**: Ganti `your_password` dan `JWT_SECRET` dengan nilai yang aman!

### Penjelasan Environment Variables

| Variable | Deskripsi | Default | Required |
|----------|-----------|---------|----------|
| `SERVER_PORT` | Port server Express | 5000 | No |
| `NODE_ENV` | Environment mode | development | Yes |
| `DATABASE_URL` | MySQL connection string | - | Yes |
| `JWT_SECRET` | Secret key untuk JWT | - | Yes |
| `JWT_EXPIRES_IN` | JWT token expiration | 7d | No |
| `CLIENT_URL` | Allowed CORS origins (comma separated) | - | Yes |

---

## 🚀 5. Menjalankan Aplikasi

### Mode Development (dengan auto-reload)
```bash
npm run dev
```

### Mode Production
```bash
npm start
```

### Default User untuk Testing (dari seeder)

| Email | Password | Role |
|-------|----------|------|
| john@customer.com | password123 | Customer |
| jane@customer.com | password123 | Customer |
| alice@customer.com | password123 | Customer |
| organizer@events.com | password123 | Organizer |
| concert@events.com | password123 | Organizer |

Server akan berjalan di: `http://localhost:5000`

---

## 📁 6. Struktur Proyek

```
backend-api-ticket-system/
├── config/
│   ├── cors.js                # Konfigurasi CORS
│   ├── rateLimit.js           # Rate limiting config
│   └── security.js            # Security headers config
├── controllers/               # HTTP request handlers
│   ├── authController.js
│   ├── bookingController.js
│   ├── eventController.js
│   ├── ticketController.js
│   └── userController.js
├── middlewares/              # Express middleware
│   ├── authMiddleware.js     # JWT auth & role authorization
│   ├── errorHandler.js       # Global error handler
│   └── requestLogger.js      # Request logging
├── prisma/
│   ├── migrations/           # Database migrations
│   ├── schema.prisma         # Prisma schema definition
│   ├── client.js             # Prisma client instance
│   └── seed.js               # Database seeder
├── routers/                  # Express routes
│   ├── authRoutes.js
│   ├── bookingRoutes.js
│   ├── eventRoutes.js
│   ├── ticketRoutes.js
│   ├── userRoutes.js
│   └── index.js              # Main router
├── services/                 # Business logic layer
│   ├── authService.js
│   ├── bookingService.js
│   ├── eventService.js
│   ├── ticketService.js
│   └── userService.js
├── utils/                    # Utility functions
│   ├── generateTickets.js   # Ticket code generator
│   └── token.js              # JWT token utilities
├── validations/              # Zod validation schemas
│   ├── authValidation.js
│   ├── bookingValidation.js
│   ├── eventValidation.js
│   ├── ticketValidation.js
│   └── userValidation.js
├── .env.example              # Template environment variables
├── .gitignore                # Git ignore rules
├── app.js                    # Express app configuration
├── package.json              # NPM dependencies & scripts
├── README.md                 # Project documentation
└── server.js                 # Application entry point
```

### Penjelasan Layer Arsitektur

1. **Routes** → Mendefinisikan endpoint dan HTTP methods
2. **Controllers** → Handle request/response HTTP
3. **Validations** → Zod schema untuk validasi input
4. **Services** → Business logic, database operations, transactions
5. **Middlewares** → Authentication, authorization, error handling
6. **Utils** → Helper functions yang reusable

---

## 🔌 7. API Endpoints

> Dokumentasi lengkap endpoint sesuai dengan requirements **"Secure the Crowd!"**

### Base URL
```
http://localhost:5000
```

---

### 🏥 Health Check & Root

#### 1. Health Check
```http
GET /health
```

**Response Success (200)**
```json
{
  "status": "success",
  "message": "Server berjalan dengan baik",
  "timestamp": "2025-12-28T10:30:00.000Z",
  "environment": "development"
}
```

#### 2. API Root
```http
GET /
```

**Response Success (200)**
```json
{
  "status": "success",
  "message": "Selamat Datang di API Sistem Ticket",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "auth": "/login",
    "users": "/users",
    "events": "/events",
    "bookings": "/bookings",
    "tickets": "/tickets"
  }
}
```

---

### 🔐 Authentication

#### 3. Login
```http
POST /login
```

**Rate Limit:** 5 requests per 15 minutes

**Request Body**
```json
{
  "email": "john@customer.com",
  "password": "password123"
}
```

**Response Success (200)**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@customer.com",
    "role": "customer",
    "createdAt": "2025-12-28T10:00:00.000Z",
    "updatedAt": "2025-12-28T10:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Error (400) - Validation Error**
```json
{
  "status": "fail",
  "message": "Kesalahan validasi",
  "errors": [
    {
      "field": "email",
      "message": "Email tidak valid"
    }
  ]
}
```

**Response Error (401) - Invalid Credentials**
```json
{
  "status": "fail",
  "message": "Email atau password salah"
}
```

**Response Error (429) - Rate Limit Exceeded**
```json
{
  "status": "error",
  "message": "Terlalu banyak percobaan login, coba lagi dalam 15 menit"
}
```

---

### 👥 Users

#### 4. Create User (Register)
```http
POST /users
```

**Request Body**
```json
{
  "name": "New Customer",
  "email": "newcustomer@mail.com",
  "password": "password123",
  "role": "customer"
}
```

**Field Validations:**
- `name`: string, min 1 character
- `email`: valid email format
- `password`: string, min 8 characters
- `role`: enum ["customer", "organizer"]

**Response Success (201)**
```json
{
  "id": 6,
  "name": "New Customer",
  "email": "newcustomer@mail.com",
  "role": "customer",
  "createdAt": "2025-12-28T11:00:00.000Z",
  "updatedAt": "2025-12-28T11:00:00.000Z"
}
```

**Response Error (400) - Email Already Exists**
```json
{
  "status": "fail",
  "message": "email sudah digunakan"
}
```

#### 5. Get All Users
```http
GET /users
```

**Response Success (200)**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@customer.com",
    "role": "customer",
    "createdAt": "2025-12-28T10:00:00.000Z",
    "updatedAt": "2025-12-28T10:00:00.000Z"
  },
  {
    "id": 4,
    "name": "Event Organizer Pro",
    "email": "organizer@events.com",
    "role": "organizer",
    "createdAt": "2025-12-28T10:00:00.000Z",
    "updatedAt": "2025-12-28T10:00:00.000Z"
  }
]
```

#### 6. Get User By ID
```http
GET /users/:id
```

**Example:** `GET /users/1`

**Response Success (200)**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@customer.com",
  "role": "customer",
  "createdAt": "2025-12-28T10:00:00.000Z",
  "updatedAt": "2025-12-28T10:00:00.000Z"
}
```

**Response Error (404)**
```json
{
  "status": "fail",
  "message": "User tidak ditemukan"
}
```

**Response Error (400) - Invalid ID**
```json
{
  "status": "fail",
  "message": "Kesalahan validasi",
  "errors": [
    {
      "field": "id",
      "message": "User ID harus bilangan bulat positif"
    }
  ]
}
```

#### 7. Update User (Partial)
```http
PATCH /users/:id
```

**Request Body** (semua field optional)
```json
{
  "name": "Updated Name",
  "password": "newpassword123"
}
```

**Response Success (200)**
```json
{
  "id": 1,
  "name": "Updated Name",
  "email": "john@customer.com",
  "role": "customer",
  "createdAt": "2025-12-28T10:00:00.000Z",
  "updatedAt": "2025-12-28T11:30:00.000Z"
}
```

#### 8. Delete User (Soft Delete)
```http
DELETE /users/:id
```

**Response Success (204 No Content)**

---

### 🎉 Events

> **Note:** Create, Update, dan Delete event **HANYA untuk Organizer** (authenticated)

#### 9. Create Event (Organizer Only)
```http
POST /events
Authorization: Bearer <organizer_token>
```

**Request Headers**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body**
```json
{
  "title": "Rock Concert 2026",
  "location": "Jakarta International Stadium",
  "capacity": 5000,
  "price": 500000,
  "date": "2026-12-31T19:00:00Z"
}
```

**Field Validations:**
- `title`: string, min 1 character
- `location`: string, min 1 character
- `capacity`: integer, min 5
- `price`: integer, min 0
- `date`: valid date, must be in the future

**Response Success (201)**
```json
{
  "id": 3,
  "title": "Rock Concert 2026",
  "location": "Jakarta International Stadium",
  "capacity": 5000,
  "availableSeat": 5000,
  "price": 500000,
  "status": "available",
  "date": "2026-12-31T19:00:00.000Z",
  "createdAt": "2025-12-28T11:00:00.000Z",
  "updatedAt": "2025-12-28T11:00:00.000Z"
}
```

**Response Error (401) - Not Authenticated**
```json
{
  "status": "fail",
  "message": "Tidak terautentikasi, token tidak ditemukan"
}
```

**Response Error (403) - Not Organizer**
```json
{
  "status": "fail",
  "message": "Akses ditolak, role user tidak sesuai"
}
```

**Response Error (400) - Date in Past**
```json
{
  "status": "fail",
  "message": "Kesalahan validasi",
  "errors": [
    {
      "field": "date",
      "message": "Tanggal event harus di masa depan"
    }
  ]
}
```

#### 10. Get All Events
```http
GET /events
```

**Response Success (200)**
```json
[
  {
    "id": 1,
    "title": "Rock Concert 2025",
    "location": "Jakarta International Stadium",
    "capacity": 5000,
    "availableSeat": 4998,
    "price": 500000,
    "status": "available",
    "date": "2025-12-31T19:00:00.000Z",
    "createdAt": "2025-12-28T10:00:00.000Z",
    "updatedAt": "2025-12-28T10:30:00.000Z"
  },
  {
    "id": 2,
    "title": "Tech Conference 2025",
    "location": "Bali Convention Center",
    "capacity": 1000,
    "availableSeat": 1000,
    "price": 1500000,
    "status": "available",
    "date": "2025-11-15T09:00:00.000Z",
    "createdAt": "2025-12-28T10:00:00.000Z",
    "updatedAt": "2025-12-28T10:00:00.000Z"
  }
]
```

#### 11. Get Event By ID
```http
GET /events/:id
```

**Example:** `GET /events/1`

**Response Success (200)**
```json
{
  "id": 1,
  "title": "Rock Concert 2025",
  "location": "Jakarta International Stadium",
  "capacity": 5000,
  "availableSeat": 4998,
  "price": 500000,
  "status": "available",
  "date": "2025-12-31T19:00:00.000Z",
  "createdAt": "2025-12-28T10:00:00.000Z",
  "updatedAt": "2025-12-28T10:30:00.000Z"
}
```

**Response Error (404)**
```json
{
  "status": "fail",
  "message": "Event tidak ditemukan"
}
```

#### 12. Update Event (Organizer Only)
```http
PATCH /events/:id
Authorization: Bearer <organizer_token>
```

**Request Body** (semua field optional)
```json
{
  "title": "Updated Concert Title",
  "price": 600000,
  "capacity": 6000
}
```

**Response Success (200)**
```json
{
  "id": 1,
  "title": "Updated Concert Title",
  "location": "Jakarta International Stadium",
  "capacity": 6000,
  "availableSeat": 5998,
  "price": 600000,
  "status": "available",
  "date": "2025-12-31T19:00:00.000Z",
  "createdAt": "2025-12-28T10:00:00.000Z",
  "updatedAt": "2025-12-28T12:00:00.000Z"
}
```

**Response Error (403) - Not Event Owner**
```json
{
  "status": "fail",
  "message": "Bukan pemilik event"
}
```

**Response Error (400) - Capacity Too Small**
```json
{
  "status": "fail",
  "message": "Capacity tidak boleh kurang dari 2"
}
```

#### 13. Delete Event (Organizer Only)
```http
DELETE /events/:id
Authorization: Bearer <organizer_token>
```

**Response Success (204 No Content)**

**Response Error (400) - Event Not Available**
```json
{
  "status": "fail",
  "message": "Event tidak tersedia"
}
```

---

### 🎫 Bookings

> **Note:** Semua endpoint booking **memerlukan authentication** (Customer role)

#### 14. Create Booking (Customer Only)
```http
POST /bookings
Authorization: Bearer <customer_token>
```

**Rate Limit:** 10 requests per 5 minutes

**Request Body**
```json
{
  "eventId": 1,
  "quantity": 2,
  "holders": ["John Doe", "Jane Smith"]
}
```

**Field Validations:**
- `eventId`: integer, positive
- `quantity`: integer, min 1
- `holders`: array of strings (optional, length must match quantity)

**Response Success (201)**
```json
{
  "id": 1,
  "eventId": 1,
  "quantity": 2,
  "totalPrice": 1000000,
  "status": "success",
  "createdAt": "2025-12-28T12:00:00.000Z",
  "updatedAt": "2025-12-28T12:00:00.000Z",
  "tickets": [
    {
      "id": 1,
      "holderName": "John Doe",
      "ticketCode": "ABCD-1234-EFGH-5678",
      "status": "unused"
    },
    {
      "id": 2,
      "holderName": "Jane Smith",
      "ticketCode": "IJKL-9012-MNOP-3456",
      "status": "unused"
    }
  ]
}
```

**Response Error (401) - Not Authenticated**
```json
{
  "status": "fail",
  "message": "Tidak terautentikasi, token tidak ditemukan"
}
```

**Response Error (400) - Event Not Found**
```json
{
  "status": "fail",
  "message": "Event tidak ditemukan"
}
```

**Response Error (400) - Event Not Available**
```json
{
  "status": "fail",
  "message": "Event tidak tersedia"
}
```

**Response Error (400) - Insufficient Seats**
```json
{
  "status": "fail",
  "message": "Kursi tidak cukup"
}
```

**Response Error (429) - Rate Limit Exceeded**
```json
{
  "status": "error",
  "message": "Terlalu banyak booking, coba lagi dalam beberapa menit"
}
```

#### 15. Get All Bookings (Authenticated)
```http
GET /bookings
Authorization: Bearer <token>
```

**Response Success (200)**
```json
[
  {
    "id": 1,
    "eventId": 1,
    "quantity": 2,
    "totalPrice": 1000000,
    "status": "success",
    "createdAt": "2025-12-28T12:00:00.000Z",
    "updatedAt": "2025-12-28T12:00:00.000Z",
    "tickets": [
      {
        "id": 1,
        "holderName": "John Doe",
        "ticketCode": "ABCD-1234-EFGH-5678",
        "status": "unused"
      },
      {
        "id": 2,
        "holderName": "Jane Smith",
        "ticketCode": "IJKL-9012-MNOP-3456",
        "status": "unused"
      }
    ]
  }
]
```

#### 16. Get Booking By ID (Authenticated)
```http
GET /bookings/:id
Authorization: Bearer <token>
```

**Example:** `GET /bookings/1`

**Response Success (200)**
```json
{
  "id": 1,
  "eventId": 1,
  "quantity": 2,
  "totalPrice": 1000000,
  "status": "success",
  "createdAt": "2025-12-28T12:00:00.000Z",
  "updatedAt": "2025-12-28T12:00:00.000Z",
  "tickets": [
    {
      "id": 1,
      "holderName": "John Doe",
      "ticketCode": "ABCD-1234-EFGH-5678",
      "status": "unused"
    },
    {
      "id": 2,
      "holderName": "Jane Smith",
      "ticketCode": "IJKL-9012-MNOP-3456",
      "status": "unused"
    }
  ]
}
```

**Response Error (404)**
```json
{
  "status": "fail",
  "message": "Booking tidak ditemukan"
}
```

---

### 🎟️ Tickets

#### 17. Get All Tickets
```http
GET /tickets
```

**Response Success (200)**
```json
[
  {
    "id": 1,
    "bookingId": 1,
    "holderName": "John Doe",
    "ticketCode": "ABCD-1234-EFGH-5678",
    "status": "unused",
    "createdAt": "2025-12-28T12:00:00.000Z",
    "updatedAt": "2025-12-28T12:00:00.000Z"
  },
  {
    "id": 2,
    "bookingId": 1,
    "holderName": "Jane Smith",
    "ticketCode": "IJKL-9012-MNOP-3456",
    "status": "unused",
    "createdAt": "2025-12-28T12:00:00.000Z",
    "updatedAt": "2025-12-28T12:00:00.000Z"
  }
]
```

#### 18. Get Ticket By ID
```http
GET /tickets/:id
```

**Example:** `GET /tickets/1`

**Response Success (200)**
```json
{
  "id": 1,
  "bookingId": 1,
  "holderName": "John Doe",
  "ticketCode": "ABCD-1234-EFGH-5678",
  "status": "unused",
  "createdAt": "2025-12-28T12:00:00.000Z",
  "updatedAt": "2025-12-28T12:00:00.000Z"
}
```

**Response Error (404)**
```json
{
  "status": "fail",
  "message": "Ticket tidak ditemukan"
}
```

#### 19. Mark Ticket as Used
```http
PATCH /tickets/used/:id
```

**Example:** `PATCH /tickets/used/1`

**Response Success (200)**
```json
{
  "id": 1,
  "bookingId": 1,
  "holderName": "John Doe",
  "ticketCode": "ABCD-1234-EFGH-5678",
  "status": "used",
  "createdAt": "2025-12-28T12:00:00.000Z",
  "updatedAt": "2025-12-28T13:00:00.000Z"
}
```

**Response Error (400) - Already Used**
```json
{
  "status": "fail",
  "message": "Ticket sudah digunakan"
}
```

---

## 🏗️ 8. Arsitektur & Keamanan

### Flow Arsitektur

```
Client Request
      ↓
   Rate Limiter (express-rate-limit)
      ↓
   Router (Express)
      ↓
   Auth Middleware (JWT verification + role check)
      ↓
   Controller (HTTP handling)
      ↓
   Validation (Zod schema)
      ↓
   Service (Business Logic & Transaction)
      ↓
   Prisma ORM (with Row Locking)
      ↓
   MySQL Database
      ↓
   Response ke Client
```

### Prinsip Desain

1. **Separation of Concerns**
   - Router: Define routes & apply middleware
   - Controller: Handle HTTP request/response
   - Validation: Input validation dengan Zod
   - Service: Business logic & database operations
   - Middleware: Authentication, authorization, logging

2. **Security First**
   - JWT authentication untuk semua protected routes
   - Role-based authorization (Customer vs Organizer)
   - Password hashing dengan bcrypt (10 rounds)
   - Rate limiting untuk mencegah abuse
   - CORS configuration
   - Helmet security headers

3. **Data Consistency**
   - Database transaction untuk operasi kritikal
   - Row-level locking untuk prevent race condition
   - Input validation di setiap endpoint

---

## 🛡️ 9. Fitur Keamanan

### 1. JWT Authentication
- Token-based authentication
- Token expires dalam 7 hari (configurable)
- Payload berisi: `id` dan `role`
- Secret key disimpan di environment variable

### 2. Role-Based Authorization
**Customer dapat:**
- Membuat booking tiket
- Melihat booking mereka sendiri

**Organizer dapat:**
- Membuat event baru
- Update event milik mereka
- Delete event milik mereka

**Implementation:**
```javascript
// Protect route (authentication required)
router.post("/bookings", protect, createBookingController);

// Authorize specific role
router.post("/events", protect, authorize("organizer"), createEventController);
```

### 3. Password Security
- Hashing dengan bcryptjs (salt rounds: 10)
- Password tidak pernah disimpan dalam plain text
- Password tidak pernah di-return di response API

### 4. Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| Global API | 100 requests | 15 minutes |
| `/login` | 5 requests | 15 minutes |
| `/bookings` | 10 requests | 5 minutes |

### 5. Input Validation
- Semua input divalidasi dengan Zod schema
- Type checking otomatis
- Email format validation
- Enum validation untuk role & status
- Date validation (must be future date for events)

### 6. CORS Configuration
- Whitelist specific origins dari environment
- Credentials support
- Allowed methods: GET, POST, PATCH, DELETE

### 7. Error Handling
- Custom error messages yang user-friendly
- No internal error details exposed di production
- Consistent error response format

---

## 💼 10. Business Logic

### Real-Time Stock Validation

#### Saat Booking Dibuat
```javascript
// Service: bookingService.js
return await prisma.$transaction(async (tx) => {
  // Lock row event untuk mencegah race condition
  const event = await tx.$queryRawUnsafe(
    `SELECT * FROM event WHERE id_event = ? FOR UPDATE`,
    eventId
  );

  // Validasi stok
  if (eventRow.available_seat < quantity) {
    throw new Error("Kursi tidak cukup");
  }

  // Update availableSeat
  await tx.event.update({
    where: { id: eventId },
    data: {
      availableSeat: eventRow.available_seat - quantity,
      status: eventRow.available_seat - quantity === 0 
        ? "unavailable" 
        : eventRow.status
    }
  });

  // Create booking & tickets
  // ...
});
```

**Key Points:**
- ✅ **Row-level locking** dengan `FOR UPDATE` mencegah race condition
- ✅ **Transaction** memastikan atomicity
- ✅ **Auto update status** event menjadi "unavailable" jika kursi habis
- ✅ **Rollback otomatis** jika terjadi error

### Event Status Management

**Event Status:**
- `available`: Ada kursi tersedia
- `unavailable`: Kursi habis atau dihapus oleh organizer

**Auto Status Update:**
- Status berubah ke "unavailable" jika `availableSeat === 0`
- Status tidak bisa diubah manual oleh organizer (system-controlled)

### Ticket Generation

**Ticket Code Format:**
```
ABCD-1234-EFGH-567890
```

- Random alphanumeric (A-Z, 0-9)
- Timestamp di akhir untuk uniqueness
- Formatted dengan dash setiap 4 karakter
- Unique constraint di database

**Holder Names:**
- Default: "Ticket 1", "Ticket 2", dst. jika tidak disediakan
- Dapat custom per ticket saat booking

---

## 🧪 11. Testing dengan Postman

### Setup Postman Collection

1. Import collection: `postman/Ticket System API.postman_collection.json`
2. Collection sudah include auto-save token feature
3. Base URL variable: `{{base_url}}` = `http://localhost:5000`

### Flow Testing Recommended

#### Step 1: Login
```
POST /login
Body: { "email": "john@customer.com", "password": "password123" }
```
→ Token akan auto-saved ke variable `customer_token`

```
POST /login
Body: { "email": "organizer@events.com", "password": "password123" }
```
→ Token akan auto-saved ke variable `organizer_token`

#### Step 2: Create Event (as Organizer)
```
POST /events
Authorization: Bearer {{organizer_token}}
Body: {
  "title": "Test Event",
  "location": "Jakarta",
  "capacity": 100,
  "price": 50000,
  "date": "2026-12-31T19:00:00Z"
}
```

#### Step 3: Book Tickets (as Customer)
```
POST /bookings
Authorization: Bearer {{customer_token}}
Body: {
  "eventId": 1,
  "quantity": 2,
  "holders": ["John", "Jane"]
}
```

#### Step 4: Verify Stock Reduction
```
GET /events/1
```
→ Check `availableSeat` berkurang sesuai quantity

### Test Cases Coverage

✅ **Authentication:**
- Login dengan credentials valid
- Login dengan email tidak terdaftar
- Login dengan password salah
- Rate limiting pada login

✅ **Authorization:**
- Customer tidak bisa create event
- Organizer tidak bisa booking ticket
- Non-owner tidak bisa update/delete event

✅ **Booking Logic:**
- Booking dengan stok cukup
- Booking dengan stok tidak cukup
- Booking pada event unavailable
- Concurrent booking (test race condition)
- Rate limiting pada booking

✅ **Validation:**
- Invalid email format
- Password kurang dari 8 karakter
- Event date di masa lalu
- Capacity kurang dari 5
- Negative price
- Invalid ID (non-integer)

---

## 🛠️ 12. Troubleshooting

### Problem: Error "Access denied for user 'root'@'localhost'"

**Solution:**
```bash
# Login ke MySQL
mysql -u root -p

# Update password
ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_new_password';
FLUSH PRIVILEGES;

# Update DATABASE_URL di .env
DATABASE_URL="mysql://root:your_new_password@localhost:3306/ticket_system"
```

### Problem: Error "connect ECONNREFUSED 127.0.0.1:3306"

**Solution:**
```bash
# Check apakah MySQL service berjalan
# Windows
net start MySQL80

# macOS/Linux
sudo systemctl start mysql
# atau
sudo service mysql start
```

### Problem: JWT Token Invalid/Expired

**Solution:**
- Token expires dalam 7 hari (default)
- Request token baru melalui `/login`
- Pastikan `JWT_SECRET` di `.env` sama dengan yang digunakan saat generate token

### Problem: "Tidak terautentikasi, token tidak ditemukan"

**Solution:**
- Pastikan header `Authorization: Bearer <token>` dikirim
- Check format header (ada spasi setelah "Bearer")
- Token harus valid dan tidak expired

### Problem: "Akses ditolak, role user tidak sesuai"

**Solution:**
- Customer tidak bisa akses endpoint organizer
- Organizer tidak bisa akses endpoint customer
- Login dengan user yang sesuai role requirement endpoint

### Problem: Port 5000 already in use

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9

# Atau ubah port di .env
SERVER_PORT=5001
```

### Problem: Prisma Client Error

**Solution:**
```bash
# Regenerate Prisma Client
npm run db:generate

# Reset database
npm run db:reset
```

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE `user` (
  `id_user` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) UNIQUE NOT NULL,
  `role` ENUM('customer', 'organizer') NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Events Table
```sql
CREATE TABLE `event` (
  `id_event` INT PRIMARY KEY AUTO_INCREMENT,
  `organizer_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `capacity` INT NOT NULL,
  `available_seat` INT NOT NULL,
  `price` INT NOT NULL,
  `status` ENUM('available', 'unavailable') DEFAULT 'available',
  `date` DATETIME NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`organizer_id`) REFERENCES `user`(`id_user`)
);
```

### Bookings Table
```sql
CREATE TABLE `booking` (
  `id_booking` INT PRIMARY KEY AUTO_INCREMENT,
  `customer_id` INT NOT NULL,
  `event_id` INT NOT NULL,
  `total_price` INT NOT NULL,
  `quantity` INT NOT NULL,
  `status` ENUM('pending', 'success', 'failed') DEFAULT 'pending',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `user`(`id_user`),
  FOREIGN KEY (`event_id`) REFERENCES `event`(`id_event`)
);
```

### Tickets Table
```sql
CREATE TABLE `ticket` (
  `id_ticket` INT PRIMARY KEY AUTO_INCREMENT,
  `booking_id` INT NOT NULL,
  `holder_name` VARCHAR(100) NOT NULL,
  `ticket_code` VARCHAR(50) UNIQUE NOT NULL,
  `status` ENUM('unused', 'used') DEFAULT 'unused',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`booking_id`) REFERENCES `booking`(`id_booking`)
);
```

### Relationships
```
User (1) ─── (N) Event
User (1) ─── (N) Booking
Event (1) ─── (N) Booking
Booking (1) ─── (N) Ticket
```

---

## 📝 API Summary Table

| # | Method | Endpoint | Auth | Role | Description |
|---|--------|----------|------|------|-------------|
| 1 | GET | `/health` | ❌ | - | Health check |
| 2 | GET | `/` | ❌ | - | API root info |
| 3 | POST | `/login` | ❌ | - | Login user |
| 4 | POST | `/users` | ❌ | - | Register user |
| 5 | GET | `/users` | ❌ | - | Get all users |
| 6 | GET | `/users/:id` | ❌ | - | Get user by ID |
| 7 | PATCH | `/users/:id` | ❌ | - | Update user |
| 8 | DELETE | `/users/:id` | ❌ | - | Delete user |
| 9 | POST | `/events` | ✅ | Organizer | Create event |
| 10 | GET | `/events` | ❌ | - | Get all events |
| 11 | GET | `/events/:id` | ❌ | - | Get event by ID |
| 12 | PATCH | `/events/:id` | ✅ | Organizer | Update event |
| 13 | DELETE | `/events/:id` | ✅ | Organizer | Delete event |
| 14 | POST | `/bookings` | ✅ | Customer | Create booking |
| 15 | GET | `/bookings` | ✅ | Any | Get all bookings |
| 16 | GET | `/bookings/:id` | ✅ | Any | Get booking by ID |
| 17 | GET | `/tickets` | ❌ | - | Get all tickets |
| 18 | GET | `/tickets/:id` | ❌ | - | Get ticket by ID |
| 19 | PATCH | `/tickets/used/:id` | ❌ | - | Mark ticket as used |

---

## 🎯 Requirements Compliance

### ✅ "Secure the Crowd!" Requirements

#### 1. Framework Implementation
- ✅ Menggunakan **Express.js** framework
- ✅ **Prisma ORM** untuk database management
- ✅ Clean architecture dengan separation of concerns

#### 2. Authentication & Authorization
- ✅ **JWT Authentication** untuk user yang sudah login
- ✅ **Role-based Authorization**:
  - Customer: hanya bisa booking tiket
  - Organizer: hanya bisa create/update/delete event
- ✅ Protected routes dengan middleware

#### 3. Real-Time Stock Validation
- ✅ **Database Transaction** untuk atomicity
- ✅ **Row-Level Locking** (`FOR UPDATE`) untuk prevent race condition
- ✅ Validasi stok tidak minus
- ✅ Auto update event status

#### 4. Input Validation
- ✅ **Zod** schema validation di semua endpoint
- ✅ Type checking, format validation, business rule validation
- ✅ Consistent error response format

#### 5. Documentation
- ✅ **README.md lengkap** dengan:
  - API endpoints documentation
  - Request/Response examples
  - Success & error scenarios
  - Authentication flow
  - Database schema
- ✅ **Postman Collection** included
- ✅ Code structure documentation

---

## 🧾 Penutup

Dokumentasi API ini disusun untuk memberikan panduan lengkap penggunaan Ticket System API dengan fokus pada keamanan, validasi, dan konsistensi data.

Sistem ini telah mengimplementasikan:
- ✅ JWT Authentication & Role-based Authorization
- ✅ Real-time stock validation dengan database locking
- ✅ Comprehensive input validation
- ✅ Clean & maintainable code structure
- ✅ Proper error handling
- ✅ Rate limiting untuk security
- ✅ Complete API documentation

### Tech Stack Summary
- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.x
- **ORM**: Prisma 6.x
- **Database**: MySQL 8.0
- **Authentication**: JWT + bcryptjs
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting

— Wahyu Pratama
