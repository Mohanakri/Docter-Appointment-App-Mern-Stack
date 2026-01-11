# 🔐 TypeScript Authentication API with Doctor Registration

A production-ready REST API built with TypeScript, Express, MongoDB, and JWT authentication. Supports both regular user registration and specialized doctor registration with profile management.

## 📁 Project Structure

```
src/
├── services/
│   ├── auth/
│   │   ├── auth.controller.ts    # Auth request handlers
│   │   ├── auth.service.ts       # Auth business logic
│   │   └── auth.routes.ts        # Auth endpoints
│   ├── user/
│   │   ├── user.controller.ts    # User/Doctor request handlers
│   │   ├── user.service.ts       # User/Doctor business logic
│   │   ├── user.routes.ts        # User/Doctor endpoints
│   │   ├── user.model.ts         # User Mongoose schema
│   │   └── doctor.model.ts       # Doctor Mongoose schema
│   └── payment/
│       ├── payment.controller.ts
│       ├── payment.service.ts
│       └── payment.routes.ts
├── utils/
│   ├── logger.ts                 # Winston logger
│   └── database.ts               # MongoDB connection
├── middleware/
│   ├── auth.middleware.ts        # JWT verification
│   └── rateLimit.middleware.ts   # Rate limiting
└── app.ts                        # Express app setup
```

## 🚀 Features

### Authentication
- ✅ User registration with email validation
- ✅ Secure password hashing (bcrypt)
- ✅ JWT access tokens (15 min expiry)
- ✅ Refresh tokens (7 day expiry)
- ✅ Password change functionality
- ✅ Role-based access control (user/doctor/admin)

### User Management
- ✅ Regular user registration
- ✅ Doctor registration with specialized fields
- ✅ Profile retrieval and updates
- ✅ Account deletion
- ✅ Email verification status

### Doctor Features
- ✅ Specialization tracking
- ✅ License number validation
- ✅ Years of experience
- ✅ Qualifications list
- ✅ Consultation fee
- ✅ Available days and time slots
- ✅ Rating and reviews system
- ✅ Verification status
- ✅ Search and filter doctors

### Security
- ✅ Helmet.js for security headers
- ✅ CORS configuration
- ✅ Rate limiting on sensitive endpoints
- ✅ Password strength validation
- ✅ JWT token expiration
- ✅ Protected routes with middleware

## 📦 Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your settings
nano .env

# Create logs directory
mkdir logs

# Start MongoDB (if running locally)
mongod

# Run in development
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## 🔧 Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# JWT Secrets (CHANGE THESE!)
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret-key

# Database
MONGODB_URI=mongodb://localhost:27017/auth-app

# CORS
CORS_ORIGIN=http://localhost:3000
```

## 📡 API Endpoints

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login user | Public |
| GET | `/profile` | Get current user | Private |
| POST | `/refresh` | Refresh access token | Public |
| POST | `/logout` | Logout user | Private |
| PUT | `/change-password` | Change password | Private |

### User Endpoints (`/api/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register regular user | Public |
| POST | `/register-doctor` | Register doctor | Public |
| GET | `/profile` | Get own profile | Private |
| GET | `/:id` | Get user by ID | Public |
| PUT | `/profile` | Update profile | Private |
| GET | `/doctors/list` | Get all doctors | Public |
| GET | `/doctors/:id` | Get doctor details | Public |
| PUT | `/doctors/profile` | Update doctor profile | Private (Doctor) |
| DELETE | `/account` | Delete account | Private |

## 📝 Request Examples

### Register Regular User
```bash
POST /api/users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe",
  "phone": "1234567890"
}
```

### Register Doctor
```bash
POST /api/users/register-doctor
Content-Type: application/json

{
  "email": "doctor@example.com",
  "password": "SecurePass123",
  "name": "Dr. Jane Smith",
  "phone": "9876543210",
  "specialization": "Cardiology",
  "licenseNumber": "MED123456",
  "yearsOfExperience": 10,
  "qualifications": ["MBBS", "MD Cardiology"],
  "consultationFee": 500,
  "clinicAddress": "123 Medical Center, City",
  "availableDays": ["Monday", "Tuesday", "Wednesday"],
  "availableTimeSlots": [
    { "start": "09:00", "end": "12:00" },
    { "start": "14:00", "end": "17:00" }
  ],
  "bio": "Experienced cardiologist with 10 years of practice"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

### Get Profile (Protected)
```bash
GET /api/auth/profile
Authorization: Bearer <your_jwt_token>
```

### Search Doctors
```bash
GET /api/users/doctors/list?specialization=Cardiology&isVerified=true&page=1&limit=10
```

## 🗄️ Database Models

### User Model
```typescript
{
  email: string (unique, required)
  password: string (hashed, required)
  name: string (required)
  role: 'user' | 'doctor' | 'admin'
  phone: string (optional)
  avatar: string (optional)
  isEmailVerified: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Doctor Model
```typescript
{
  userId: ObjectId (ref: User)
  specialization: string (required)
  licenseNumber: string (unique, required)
  yearsOfExperience: number (required)
  qualifications: string[] (required)
  clinicAddress: string (optional)
  consultationFee: number (required)
  availableDays: string[]
  availableTimeSlots: [{ start: string, end: string }]
  bio: string (optional)
  isVerified: boolean
  rating: number (0-5)
  totalReviews: number
  createdAt: Date
  updatedAt: Date
}
```

## 🔒 Security Best Practices

1. **Password Security**
   - Minimum 8 characters
   - Hashed with bcrypt (12 salt rounds)
   - Never returned in API responses

2. **JWT Tokens**
   - Access token: 15 minutes expiry
   - Refresh token: 7 days expiry
   - Stored on client-side only

3. **Rate Limiting**
   - Registration: 5 requests per 15 minutes
   - Login: 10 requests per 15 minutes
   - Password change: 5 requests per hour

4. **Input Validation**
   - Email format validation
   - Phone number validation
   - Required field checks
   - Mongoose schema validation

5. **Security Headers**
   - Helmet.js for HTTP security
   - CORS configured properly
   - No sensitive data in logs

## 🧪 Testing

```bash
# Test user registration
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234","name":"Test User"}'

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'

# Test protected route
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📊 Logging

Logs are stored in the `logs/` directory:
- `error.log` - Error level logs only
- `all.log` - All logs (debug, info, warn, error)

Console output is colorized in development mode.

## 🚧 Next Steps

- [ ] Implement email verification
- [ ] Add password reset functionality
- [ ] Implement appointment booking system
- [ ] Add doctor review and rating system
- [ ] Implement file upload for avatars
- [ ] Add search with Elasticsearch
- [ ] Implement real-time chat
- [ ] Add payment integration
- [ ] Create admin dashboard
- [ ] Add API documentation (Swagger)

## 📄 License

MIT

## 👨‍💻 Author

Your Name

---

**Note**: Remember to change the JWT secrets in production and use environment variables for all sensitive data!