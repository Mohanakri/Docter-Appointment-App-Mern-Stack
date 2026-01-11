# Doctor Appointment Booking System

A production-ready doctor appointment booking system built with Node.js, TypeScript, Express, MongoDB, and JWT authentication.

## Features

- **Authentication & Authorization**
  - User registration and login with JWT tokens
  - Role-based access control (Patient, Doctor, Admin)
  - Password encryption with bcrypt
  - Token refresh mechanism
  - Secure password change functionality

- **User Management**
  - User profiles with role-specific fields
  - Doctor profiles with specialization, availability, and fees
  - Patient profiles with medical history
  - Admin user management

- **Payment System**
  - Multiple payment methods (Card, UPI, Net Banking, Wallet, Cash)
  - Payment status tracking
  - Refund processing
  - Transaction history

- **Security Features**
  - Helmet.js for security headers
  - Rate limiting to prevent abuse
  - CORS configuration
  - Input validation with express-validator
  - Request logging with Winston

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd doctor-appointment-system
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/doctor_appointment

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_token_secret_key
JWT_REFRESH_EXPIRE=30d

# Bcrypt
BCRYPT_ROUNDS=12

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=info
```

4. **Create logs directory**
```bash
mkdir logs
```

5. **Build the project**
```bash
npm run build
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | User login | Public |
| POST | `/refresh-token` | Refresh access token | Public |
| POST | `/change-password` | Change password | Authenticated |
| POST | `/logout` | Logout user | Authenticated |

### Users (`/api/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/profile` | Get current user profile | Authenticated |
| PUT | `/profile` | Update user profile | Authenticated |
| GET | `/doctors` | Get all doctors | Authenticated |
| GET | `/patients` | Get all patients | Doctor/Admin |
| GET | `/:id` | Get user by ID | Admin |
| DELETE | `/:id` | Delete user | Admin |

### Payments (`/api/payments`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/` | Create payment | Authenticated |
| GET | `/my-payments` | Get user's payments | Authenticated |
| GET | `/` | Get all payments | Admin |
| GET | `/:id` | Get payment by ID | Authenticated |
| PUT | `/:id/status` | Update payment status | Admin |
| POST | `/:id/refund` | Process refund | Admin |

## Request/Response Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "role": "patient"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Payment
```bash
POST /api/payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "appointmentId": "appointment_id_here",
  "amount": 500,
  "paymentMethod": "upi"
}
```

## Project Structure

```
src/
├── services/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.routes.ts
│   ├── user/
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.routes.ts
│   │   └── user.model.ts
│   └── payment/
│       ├── payment.controller.ts
│       ├── payment.service.ts
│       ├── payment.routes.ts
│       └── payment.model.ts
├── utils/
│   ├── logger.ts
│   └── database.ts
├── middleware/
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   └── validation.middleware.ts
└── app.ts
```

## Database Models

### User Model
- name, email, password, phone, role
- Doctor-specific: specialization, experience, qualifications, consultationFee, availability
- Patient-specific: dateOfBirth, gender, address

### Payment Model
- appointmentId, patientId, doctorId
- amount, currency, paymentMethod
- status, transactionId, paymentGateway
- paymentDate, refundDate, refundAmount

## Error Handling

The application uses centralized error handling with custom `AppError` class. All errors are logged using Winston and returned with appropriate HTTP status codes.

## Logging

Logs are stored in the `logs/` directory:
- `error.log`: Error-level logs
- `combined.log`: All logs

## Security Best Practices

1. **Environment Variables**: Never commit `.env` file to version control
2. **JWT Secrets**: Use strong, random secrets in production
3. **HTTPS**: Always use HTTPS in production
4. **Rate Limiting**: Adjust rate limits based on your needs
5. **Input Validation**: All inputs are validated using express-validator
6. **Password Hashing**: Passwords are hashed with bcrypt (12 rounds)

## Deployment

### Heroku
```bash
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
git push heroku main
```

### Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## Testing

Run tests:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@example.com or open an issue in the repository.