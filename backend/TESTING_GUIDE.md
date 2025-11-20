# 🧪 Testing Guide - Bluetooth Weight Scale API

This guide provides comprehensive instructions for testing the Bluetooth Weight Scale API.

## 🚀 Quick Start Testing

### 1. Setup Environment

```bash
# Navigate to backend directory
cd backend

# Run interactive setup
npm run setup

# Install dependencies (if not done already)
npm install
```

### 2. Start the Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000` (or your configured port).

### 3. Verify Server is Running

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Bluetooth Weight Scale API is running",
  "timestamp": "2024-11-17T07:00:00.000Z",
  "environment": "development"
}
```

## 📊 Database Setup for Testing

### Option 1: Use Test Data Seeder

```bash
# Seed test data (creates users and measurements)
npm run seed

# Clear test data
npm run seed:clear
```

This creates:
- 2 test users with different profiles
- 60 weight measurements (30 for each user) over the last 30 days
- Realistic data patterns (weight loss, maintenance)

### Option 2: Manual Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE weight_scale_db;
```

2. Start the server (it will auto-create tables in development mode)

3. Use the API endpoints to create your own test data

## 🔧 Testing Methods

### Method 1: Using cURL Commands

#### Test User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "firstName": "Test",
    "lastName": "User",
    "height": 1.75,
    "dateOfBirth": "1990-01-15",
    "gender": "male"
  }'
```

#### Test User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

Save the JWT token from the response for authenticated requests.

#### Test Weight Measurement Creation
```bash
curl -X POST http://localhost:5000/api/weight/measurements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "weight": 75.5,
    "unit": "kg",
    "bodyFat": 18.5,
    "muscleMass": 35.2,
    "boneMass": 3.1,
    "waterPercentage": 62.5,
    "notes": "Morning measurement"
  }'
```

#### Test Statistics Endpoint
```bash
curl -X GET "http://localhost:5000/api/weight/measurements/stats?period=week" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Method 2: Using Postman

1. Import the provided Postman collection:
   - File: `postman_collection.json`
   - Contains all API endpoints with sample data
   - Automatically saves JWT tokens for authenticated requests

2. Set collection variables:
   - `baseUrl`: `http://localhost:5000`
   - `jwt_token`: (automatically set after login)

3. Test flow:
   - Run "Register User" or "Login User"
   - JWT token is automatically saved
   - Test other endpoints with authentication

### Method 3: Using Frontend Integration

For React Native integration, use the following pattern:

```javascript
// API service example
class WeightScaleAPI {
  constructor(baseURL = 'http://localhost:5000') {
    this.baseURL = baseURL;
    this.token = null;
  }

  async login(email, password) {
    const response = await fetch(`${this.baseURL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    if (data.success) {
      this.token = data.data.token;
      return data.data.user;
    }
    throw new Error(data.message);
  }

  async createMeasurement(measurementData) {
    const response = await fetch(`${this.baseURL}/api/weight/measurements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify(measurementData)
    });
    
    return response.json();
  }

  async getStatistics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(
      `${this.baseURL}/api/weight/measurements/stats?${queryString}`,
      {
        headers: { 'Authorization': `Bearer ${this.token}` }
      }
    );
    
    return response.json();
  }
}
```

## 🧪 Test Scenarios

### Authentication Flow Testing

1. **User Registration**
   - ✅ Valid registration data
   - ❌ Invalid email format
   - ❌ Weak password
   - ❌ Duplicate email
   - ❌ Invalid height range

2. **User Login**
   - ✅ Valid credentials
   - ❌ Invalid email
   - ❌ Wrong password
   - ❌ Non-existent user

3. **Protected Routes**
   - ✅ Valid JWT token
   - ❌ Missing token
   - ❌ Invalid token
   - ❌ Expired token

### Weight Management Testing

1. **Create Measurements**
   - ✅ Valid measurement data
   - ✅ BMI auto-calculation
   - ❌ Invalid weight range
   - ❌ Invalid body metrics
   - ❌ Missing required fields

2. **Retrieve Measurements**
   - ✅ Get all measurements with pagination
   - ✅ Get latest measurement
   - ✅ Get by date range
   - ✅ Get specific measurement by ID
   - ❌ Access other user's data

3. **Statistics Calculation**
   - ✅ Basic statistics (avg, min, max)
   - ✅ BMI calculations
   - ✅ Trend analysis
   - ✅ Period grouping (week/month)
   - ✅ Weight change tracking

4. **Data Export**
   - ✅ JSON format export
   - ✅ CSV format export
   - ✅ Date range filtering

### Error Handling Testing

1. **Validation Errors**
   - Test all input validation rules
   - Verify error message format
   - Check field-specific error details

2. **Authentication Errors**
   - Missing/invalid tokens
   - Expired tokens
   - Unauthorized access attempts

3. **Database Errors**
   - Duplicate key constraints
   - Foreign key violations
   - Connection failures

## 📈 Performance Testing

### Load Testing with Artillery

Create `artillery-config.yml`:
```yaml
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "API Load Test"
    requests:
      - get:
          url: "/health"
      - post:
          url: "/api/auth/login"
          json:
            email: "john.doe@example.com"
            password: "TestPass123!"
```

Run load test:
```bash
npx artillery run artillery-config.yml
```

### Memory and CPU Monitoring

Monitor server performance:
```bash
# Install htop for system monitoring
sudo apt install htop

# Monitor Node.js process
htop -p $(pgrep -f "node.*server.js")
```

## 🔍 Debugging Tips

### Enable Debug Logging

Set environment variable:
```bash
NODE_ENV=development npm run dev
```

### Database Query Logging

The API logs all SQL queries in development mode. Check console output for:
- Query execution times
- Parameter binding
- Connection status

### API Response Debugging

Add request logging middleware temporarily:
```javascript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});
```

## ✅ Test Checklist

### Basic Functionality
- [ ] Server starts without errors
- [ ] Database connection established
- [ ] Health endpoint responds
- [ ] User registration works
- [ ] User login returns JWT token
- [ ] Protected routes require authentication
- [ ] Weight measurements can be created
- [ ] Statistics are calculated correctly

### Data Integrity
- [ ] Passwords are hashed
- [ ] BMI is calculated automatically
- [ ] User data isolation (users can't access others' data)
- [ ] Input validation prevents invalid data
- [ ] Database constraints are enforced

### Security
- [ ] JWT tokens expire correctly
- [ ] CORS is configured properly
- [ ] SQL injection protection (Sequelize ORM)
- [ ] Password strength requirements enforced
- [ ] Sensitive data not exposed in responses

### Error Handling
- [ ] Consistent error response format
- [ ] Appropriate HTTP status codes
- [ ] Validation errors include field details
- [ ] Database errors are handled gracefully
- [ ] Authentication errors are clear

### Performance
- [ ] Response times under 200ms for simple queries
- [ ] Pagination works for large datasets
- [ ] Database queries are optimized
- [ ] Memory usage remains stable

## 🚨 Common Issues and Solutions

### Database Connection Issues
```
Error: Unable to connect to the database
```
**Solution**: Check MySQL is running and credentials in `.env` are correct.

### JWT Token Issues
```
Error: Access denied. Invalid token format
```
**Solution**: Ensure token is sent as `Bearer TOKEN` in Authorization header.

### Validation Errors
```
Error: Validation failed
```
**Solution**: Check the `errors` array in response for specific field requirements.

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution**: Change PORT in `.env` or kill process using port 5000.

## 📞 Support

If you encounter issues:

1. Check server logs for detailed error messages
2. Verify environment configuration
3. Test with provided sample data
4. Use Postman collection for consistent testing
5. Check database connection and table creation

---

**Happy Testing! 🎉**
