# 🚀 Complete Setup Guide - Bluetooth Weight Scale App

This guide will help you set up both the backend and frontend for the Bluetooth Weight Scale application.

## 📋 Prerequisites

### System Requirements
- **Node.js**: v18 or higher
- **npm**: v8 or higher
- **MySQL**: v5.7 or higher
- **React Native CLI**: Latest version
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)

### Development Environment
- **Physical Android/iOS device** (recommended for Bluetooth testing)
- **Local network access** (backend and mobile device on same network)

## 🗄️ Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup

#### Create MySQL Database
```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database
CREATE DATABASE weight_scale_db;

-- Create user (optional)
CREATE USER 'weight_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON weight_scale_db.* TO 'weight_user'@'localhost';
FLUSH PRIVILEGES;
```

### 4. Environment Configuration

#### Create .env file
```bash
# Use the auto-generator
npm run setup:env

# Or manually create .env file
cp .env.example .env
```

#### Update .env with your settings
```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=weight_scale_db
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT Configuration (auto-generated)
JWT_SECRET=your_generated_secret
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:8081
```

### 5. Run Database Migrations
```bash
# Run migrations to create tables
npm run migrate

# Check migration status
npm run migrate:status
```

### 6. Seed Test Data (Optional)
```bash
# Create test users and measurements
npm run seed

# Clear test data if needed
npm run seed:clear
```

### 7. Start Backend Server
```bash
# Development mode (auto-restart)
npm run dev

# Production mode
npm start
```

### 8. Verify Backend
```bash
# Test health endpoint
curl http://localhost:3001/health

# Expected response:
# {"success":true,"message":"Bluetooth Weight Scale API is running",...}
```

## 📱 Frontend Setup

### 1. Navigate to Root Directory
```bash
cd ..  # From backend directory
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure API Connection

#### Find Your Local IP Address
```bash
# On macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# On Windows
ipconfig | findstr "IPv4"

# Example output: 192.168.1.100
```

#### Update API Configuration
Edit `src/utils/constants.js`:
```javascript
export const API_CONFIG = {
  BASE_URL: 'http://192.168.1.100:3001/api', // Replace with YOUR IP
  TIMEOUT: 10000,
};
```

### 4. Platform-Specific Setup

#### Android Setup
```bash
# Ensure Android SDK is installed
# Add to ~/.bashrc or ~/.zshrc:
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Reload shell configuration
source ~/.bashrc  # or source ~/.zshrc
```

#### iOS Setup (macOS only)
```bash
# Install CocoaPods dependencies
cd ios
pod install
cd ..
```

### 5. Start Metro Bundler
```bash
npm start
```

### 6. Run the App

#### Android
```bash
# Connect Android device or start emulator
# Enable USB debugging on device

# Run app
npm run android
```

#### iOS
```bash
# Connect iOS device or start simulator
npm run ios
```

## 🔧 Configuration & Testing

### 1. Test Backend API

#### Using cURL
```bash
# Register a test user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "firstName": "Test",
    "lastName": "User",
    "height": 1.75,
    "dateOfBirth": "1990-01-15",
    "gender": "male"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

#### Using Postman
1. Import `backend/postman_collection.json`
2. Set base URL to `http://localhost:3001`
3. Test all endpoints

### 2. Test Mobile App

#### Authentication Flow
1. Open app on device
2. Register new account
3. Login with credentials
4. Verify navigation to home screen

#### Bluetooth Testing
1. Navigate to Weight tab
2. Tap "Connect Scale"
3. Grant Bluetooth permissions
4. Scan for devices
5. Test with actual Bluetooth scale (if available)

## 🚨 Troubleshooting

### Backend Issues

#### Port Already in Use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or use different port
PORT=3002 npm run dev
```

#### Database Connection Error
```bash
# Check MySQL is running
sudo service mysql start  # Linux
brew services start mysql  # macOS

# Test connection
mysql -u root -p -e "SELECT 1"
```

#### Migration Errors
```bash
# Reset migrations (DANGER: deletes data)
npm run migrate:undo:all
npm run migrate

# Or create database manually
npx sequelize-cli db:create
```

### Frontend Issues

#### Metro Bundler Issues
```bash
# Clear cache
npx react-native start --reset-cache

# Clear node modules
rm -rf node_modules
npm install
```

#### Android Build Errors
```bash
# Clean build
cd android
./gradlew clean
cd ..

# Rebuild
npm run android
```

#### iOS Build Errors
```bash
# Clean build
cd ios
xcodebuild clean
cd ..

# Reinstall pods
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

#### Bluetooth Not Working
- Use physical device (not emulator)
- Grant location permissions (Android)
- Enable Bluetooth on device
- Check device compatibility

### Network Issues

#### API Connection Failed
```bash
# Check backend is running
curl http://YOUR_IP:3001/health

# Check firewall settings
# Ensure mobile device and computer are on same network
# Try different IP address
```

#### CORS Errors
Update backend `.env`:
```bash
CORS_ORIGIN=http://localhost:3000,http://localhost:8081,http://YOUR_IP:8081
```

## 📊 Development Workflow

### 1. Daily Development
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
npm start

# Terminal 3: Run app
npm run android  # or npm run ios
```

### 2. Database Management
```bash
# View current migrations
npm run migrate:status

# Add new migration
npx sequelize-cli migration:generate --name add-new-feature

# Run new migrations
npm run migrate
```

### 3. Testing Workflow
```bash
# Backend: Use Postman collection
# Frontend: Test on physical device
# Database: Use MySQL Workbench or CLI
```

## 🚀 Production Deployment

### Backend Deployment
```bash
# Set production environment
NODE_ENV=production

# Use PM2 for process management
npm install -g pm2
pm2 start server.js --name "weight-scale-api"

# Or use Docker
docker build -t weight-scale-backend .
docker run -p 3001:3001 weight-scale-backend
```

### Frontend Deployment

#### Android Release
```bash
# Generate release APK
cd android
./gradlew assembleRelease

# APK location: android/app/build/outputs/apk/release/
```

#### iOS Release
```bash
# Archive in Xcode
# Product > Archive
# Upload to App Store Connect
```

## 📚 Additional Resources

### Documentation
- [Backend API Documentation](backend/README.md)
- [Frontend Documentation](README_FRONTEND.md)
- [Testing Guide](backend/TESTING_GUIDE.md)

### Useful Commands
```bash
# Backend
npm run dev          # Start development server
npm run migrate      # Run database migrations
npm run seed         # Add test data

# Frontend
npm start           # Start Metro bundler
npm run android     # Run on Android
npm run ios         # Run on iOS
```

### Development Tools
- **Backend**: Postman, MySQL Workbench, VS Code
- **Frontend**: React Native Debugger, Flipper
- **Database**: phpMyAdmin, Sequel Pro

## ✅ Success Checklist

### Backend Setup Complete ✓
- [ ] MySQL database created
- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Migrations run successfully
- [ ] Server starts without errors
- [ ] Health endpoint responds
- [ ] API endpoints work in Postman

### Frontend Setup Complete ✓
- [ ] Dependencies installed
- [ ] API URL configured correctly
- [ ] App builds successfully
- [ ] Authentication flow works
- [ ] Navigation functions properly
- [ ] Bluetooth permissions granted
- [ ] Can connect to backend API

### Integration Testing ✓
- [ ] User registration works end-to-end
- [ ] Login persists across app restarts
- [ ] Weight measurements save to backend
- [ ] Data syncs between app and server
- [ ] Offline mode works
- [ ] Charts display correctly

## 🎉 You're Ready!

Once all checklist items are complete, you have a fully functional Bluetooth Weight Scale application with:

- ✅ **Secure authentication system**
- ✅ **Real-time Bluetooth connectivity**
- ✅ **Weight measurement tracking**
- ✅ **Health analytics and charts**
- ✅ **Offline support**
- ✅ **Production-ready architecture**

Happy coding! 🚀
