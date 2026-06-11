# Doctor Consultation Platform — Backend API

A production-ready REST API for booking and paying for doctor consultations. Built with Node.js, Express, MongoDB, and Paystack.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB (via Mongoose) |
| Authentication | JWT (JSON Web Tokens) |
| Password Hashing | bcryptjs |
| Payments | Paystack |
| Environment | dotenv |
| Dev Server | nodemon |

---

## Project Structure

```
doctor-platform/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js      # Register, login, get profile
│   ├── doctorController.js    # Doctor profile management
│   ├── bookingController.js   # Booking creation and management
│   └── paymentController.js   # Paystack payment flow
├── middleware/
│   └── authMiddleware.js      # JWT protection + role authorization
├── models/
│   ├── User.js                # Shared user model (patient + doctor)
│   ├── DoctorProfile.js       # Doctor-specific data
│   └── Booking.js             # Consultation bookings
├── routes/
│   ├── authRoutes.js          # /api/auth
│   ├── doctorRoutes.js        # /api/doctors
│   ├── bookingRoutes.js       # /api/bookings
│   └── paymentRoutes.js       # /api/payments
├── services/
│   └── paystackService.js     # Paystack API communication
├── app.js                     # Express configuration
├── server.js                  # Entry point
└── .env                       # Environment variables (never commit)
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/TomRiddle67/Doctor-platform.git
cd Doctor-platform
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create your `.env` file

```bash
touch .env
```

Add the following variables:

```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/doctor-platform
JWT_SECRET=your_random_secret_here
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxx
```

### 4. Start the development server

```bash
npm run dev
```

Visit `http://localhost:5000/api/health` to confirm the server is running.

---

## API Reference

### Auth — `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a patient or doctor |
| POST | `/login` | Public | Login and receive JWT token |
| GET | `/me` | Protected | Get logged-in user profile |

**Register body:**
```json
{
  "name": "Tom Riddle",
  "email": "tom@example.com",
  "password": "123456",
  "role": "patient"
}
```

---

### Doctors — `/api/doctors`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | Get all available doctors |
| POST | `/profile` | Doctor only | Create doctor profile |

**Create profile body:**
```json
{
  "specialization": "Cardiology",
  "qualifications": "MBBS, MD",
  "experience": 5,
  "consultationFee": 5000,
  "bio": "Expert cardiologist",
  "availability": [
    { "day": "Monday", "startTime": "09:00", "endTime": "17:00" }
  ]
}
```

---

### Bookings — `/api/bookings`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Patient only | Create a booking |

**Create booking body:**
```json
{
  "doctorId": "<doctor_profile_id>",
  "date": "2026-06-10",
  "startTime": "10:00",
  "endTime": "11:00",
  "notes": "First consultation"
}
```

---

### Payments — `/api/payments`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/initialize` | Patient only | Initialize Paystack payment |
| GET | `/verify/:reference` | Protected | Verify payment and confirm booking |

**Initialize payment body:**
```json
{
  "bookingId": "<booking_id>"
}
```

---

## Payment Flow

```
1. Patient creates a booking           POST /api/bookings
        ↓
2. Patient initializes payment         POST /api/payments/initialize
        ↓
3. API returns a Paystack checkout URL
        ↓
4. Patient completes payment on Paystack
        ↓
5. Patient verifies payment            GET /api/payments/verify/:reference
        ↓
6. Booking status → confirmed, paymentStatus → paid
```

### Paystack Test Card

```
Card Number:  4084 0840 8408 4081
Expiry:       Any future date
CVV:          408
OTP:          123456
```

---

## Authentication

Protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Get the token from the `/api/auth/login` response.

---

## Role System

| Role | Permissions |
|---|---|
| `patient` | Browse doctors, create bookings, make payments |
| `doctor` | Create and manage their profile |
| `admin` | *(coming soon)* Verify doctors, manage users |

---

## What's Built

- [x] Express server with clean app/server separation
- [x] MongoDB connection module
- [x] Role-based user model with password hashing
- [x] JWT authentication (register, login, protected routes)
- [x] Role authorization middleware
- [x] Doctor profile system with availability
- [x] Booking system with double-booking prevention
- [x] Paystack payment initialization and verification

---

## What's Coming

- [ ] `GET /api/bookings/my` — Patient views their booking history
- [ ] `GET /api/doctors/bookings` — Doctor views their appointments
- [ ] `PATCH /api/bookings/:id/cancel` — Cancel a booking
- [ ] `PATCH /api/doctors/profile` — Doctor updates their profile
- [ ] Email notifications after booking confirmation
- [ ] Admin routes — verify doctors, manage users
- [ ] Pagination on doctor listings
- [ ] Search and filter doctors by specialization

---

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `PAYSTACK_SECRET_KEY` | Paystack secret key (starts with `sk_test_`) |

> **Never commit your `.env` file.** It's listed in `.gitignore` for a reason.

---

## Scripts

```bash
npm run dev     # Start with nodemon (auto-restart on changes)
npm start       # Start without nodemon (production)
```
