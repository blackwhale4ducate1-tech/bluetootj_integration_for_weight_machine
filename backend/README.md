# Bluetooth Weight Scale Backend API

A complete Node.js backend API for a Bluetooth weight scale application with user authentication, weight measurement tracking, and comprehensive statistics.

## 🚀 Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **Weight Tracking**: Store and manage weight measurements with additional body metrics
- **Statistics**: Comprehensive weight statistics and trend analysis
- **Data Export**: Export measurements in JSON or CSV format
- **Input Validation**: Robust validation using express-validator
- **Error Handling**: Consistent error responses and global error handling
- **Database**: MySQL with Sequelize ORM
- **Security**: CORS protection, input sanitization, and secure password storage

## 📋 Tech Stack

- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Environment**: dotenv
- **Logging**: morgan
- **CORS**: cors middleware

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js           # Sequelize configuration
├── models/
│   ├── index.js              # Model initialization & associations
│   ├── User.js               # User model
│   └── WeightMeasurement.js  # Weight measurement model
├── controllers/
│   ├── authController.js     # Authentication logic
│   └── weightController.js   # Weight measurement logic
├── middlewares/
│   ├── authMiddleware.js     # JWT verification
│   └── errorHandler.js       # Global error handling
├── routes/
│   ├── authRoutes.js         # Authentication endpoints
│   └── weightRoutes.js       # Weight measurement endpoints
├── utils/
│   ├── jwtHelper.js          # JWT utilities
│   └── validators.js         # Input validation schemas
├── .env.example              # Environment variables template
├── .gitignore
├── package.json
├── server.js                 # Main application entry point
└── README.md                 # This file
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### 1. Clone and Install Dependencies

```bash
cd backend
npm install
```

### 2. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE weight_scale_db;
CREATE USER 'your_username'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON weight_scale_db.* TO 'your_username'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` file:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=weight_scale_db
DB_USER=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:8081
```

### 4. Start the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📊 Database Schema

### Users Table
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- email (VARCHAR(255), UNIQUE, NOT NULL)
- password (VARCHAR(255), NOT NULL) -- bcrypt hashed
- firstName (VARCHAR(100))
- lastName (VARCHAR(100))
- height (DECIMAL(5,2)) -- in meters for BMI calculation
- dateOfBirth (DATE)
- gender (ENUM: 'male', 'female', 'other')
- createdAt (DATETIME)
- updatedAt (DATETIME)
```

### WeightMeasurements Table
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- userId (INT, FOREIGN KEY references Users.id)
- weight (DECIMAL(5,2), NOT NULL) -- in kg or lbs
- unit (ENUM: 'kg', 'lbs', DEFAULT 'kg')
- bmi (DECIMAL(4,2)) -- calculated BMI
- bodyFat (DECIMAL(4,2)) -- body fat percentage
- muscleMass (DECIMAL(5,2)) -- muscle mass in kg
- boneMass (DECIMAL(4,2)) -- bone mass in kg
- waterPercentage (DECIMAL(4,2)) -- water percentage
- timestamp (DATETIME, DEFAULT CURRENT_TIMESTAMP)
- notes (TEXT) -- optional user notes
- createdAt (DATETIME)
- updatedAt (DATETIME)
```

## 🔗 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | User login | No |
| GET | `/profile` | Get user profile | Yes |
| PUT | `/profile` | Update user profile | Yes |
| POST | `/change-password` | Change password | Yes |
| POST | `/logout` | Logout user | Yes |

### Weight Measurement Routes (`/api/weight`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/measurements` | Create new measurement | Yes |
| GET | `/measurements` | Get all measurements | Yes |
| GET | `/measurements/latest` | Get latest measurement | Yes |
| GET | `/measurements/:id` | Get specific measurement | Yes |
| GET | `/measurements/range` | Get measurements by date range | Yes |
| GET | `/measurements/stats` | Get weight statistics | Yes |
| PUT | `/measurements/:id` | Update measurement | Yes |
| DELETE | `/measurements/:id` | Delete measurement | Yes |
| GET | `/measurements/export` | Export measurements | Yes |

### System Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information |
| GET | `/health` | Health check |

## 📝 API Usage Examples

### User Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "height": 1.75,
    "dateOfBirth": "1990-01-15",
    "gender": "male"
  }'
```

### User Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

### Create Weight Measurement

```bash
curl -X POST http://localhost:5000/api/weight/measurements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "weight": 75.5,
    "unit": "kg",
    "bodyFat": 18.5,
    "muscleMass": 35.2,
    "boneMass": 3.1,
    "waterPercentage": 62.5,
    "notes": "Morning measurement after breakfast"
  }'
```

### Get Weight Statistics

```bash
curl -X GET "http://localhost:5000/api/weight/measurements/stats?startDate=2024-01-01&endDate=2024-12-31&period=week" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

Tokens expire in 7 days by default (configurable via `JWT_EXPIRE` environment variable).

## ✅ Input Validation

### User Registration Validation
- **Email**: Valid email format, unique
- **Password**: Minimum 8 characters, must include uppercase, lowercase, and number
- **Height**: Between 0.5 and 3.0 meters
- **Date of Birth**: Valid date, not in future
- **Gender**: One of 'male', 'female', 'other'

### Weight Measurement Validation
- **Weight**: Between 10 and 300 kg
- **Unit**: Either 'kg' or 'lbs'
- **Body Fat**: 0-50%
- **Muscle Mass**: 0-100 kg
- **Bone Mass**: 0-10 kg
- **Water Percentage**: 0-100%
- **Notes**: Maximum 1000 characters

## 📈 Weight Statistics Features

- **Basic Stats**: Total measurements, current/average/min/max weight
- **BMI Calculations**: Current and average BMI
- **Trend Analysis**: Increasing, decreasing, or stable trends
- **Period Grouping**: Weekly, monthly, or daily averages
- **Weight Change**: Change from first to latest measurement

## 🚨 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)",
  "statusCode": 400
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

## 🔧 Development

### Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | development |
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 3306 |
| `DB_NAME` | Database name | weight_scale_db |
| `DB_USER` | Database username | root |
| `DB_PASSWORD` | Database password | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRE` | JWT expiration time | 7d |
| `CORS_ORIGIN` | Allowed CORS origins | localhost:3000,localhost:8081 |

## 🧪 Testing

### Manual Testing with cURL

Test the health endpoint:
```bash
curl http://localhost:5000/health
```

### Testing with Postman

1. Import the API endpoints into Postman
2. Set up environment variables for base URL and JWT token
3. Test authentication flow: register → login → protected endpoints

## 🚀 Deployment

### Production Checklist

1. **Environment Variables**: Set secure values for production
2. **Database**: Use production MySQL instance
3. **JWT Secret**: Use a strong, unique secret key
4. **CORS**: Configure allowed origins for your frontend
5. **HTTPS**: Use HTTPS in production
6. **Process Manager**: Use PM2 or similar for process management
7. **Monitoring**: Set up logging and monitoring
8. **Database Backup**: Configure regular backups

### Example PM2 Configuration

```json
{
  "name": "weight-scale-api",
  "script": "server.js",
  "instances": "max",
  "exec_mode": "cluster",
  "env": {
    "NODE_ENV": "production",
    "PORT": 5000
  }
}
```

## 🤝 Integration with React Native App

The backend is designed to work seamlessly with React Native applications:

1. **Authentication**: Use AsyncStorage to store JWT tokens
2. **API Calls**: Use fetch or axios with proper headers
3. **Error Handling**: Handle API errors gracefully in the mobile app
4. **Offline Support**: Consider implementing offline data storage

### Example React Native Integration

```javascript
// Store token after login
import AsyncStorage from '@react-native-async-storage/async-storage';

const login = async (email, password) => {
  const response = await fetch('http://your-api-url/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  
  if (data.success) {
    await AsyncStorage.setItem('jwt_token', data.data.token);
    return data.data.user;
  }
  
  throw new Error(data.message);
};

// Make authenticated requests
const getProfile = async () => {
  const token = await AsyncStorage.getItem('jwt_token');
  
  const response = await fetch('http://your-api-url/api/auth/profile', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return response.json();
};
```

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:

1. Check the API documentation above
2. Verify your environment configuration
3. Check server logs for detailed error messages
4. Ensure database connection is working

## 🔄 Version History

- **v1.0.0** - Initial release with full API functionality

---

**Happy coding! 🎉**
