# 🚀 Quick Setup Instructions

## 📋 Prerequisites
- Node.js (v14+)
- MySQL (v5.7+)
- npm or yarn

## ⚡ Quick Setup (3 Steps)

### Step 1: Environment Setup
```bash
# Create .env file with auto-generated JWT secret
npm run setup:env

# Edit .env file with your MySQL credentials
nano .env  # or use your preferred editor
```

**Update these values in `.env`:**
- `DB_PASSWORD=your_mysql_password`
- `DB_USER=your_mysql_username` (if not root)
- `DB_NAME=your_database_name` (if different from weight_scale_db)
- `DB_HOST=your_mysql_host` (if not localhost)

### Step 2: Database Setup
```bash
# Install dependencies
npm install

# Create database (if it doesn't exist)
npx sequelize-cli db:create

# Run migrations to create tables
npm run migrate

# (Optional) Add test data
npm run seed
```

### Step 3: Start Server
```bash
# Development mode (auto-restart)
npm run dev

# Production mode
npm start
```

## 🔧 Your Current .env File

Your `.env` file has been created with:
- ✅ **Auto-generated JWT secret** (secure 64-byte hex)
- ✅ **Default server settings** (port 5000)
- ✅ **MySQL connection template**
- ⚠️ **Needs your MySQL credentials**

## 📊 Database Migration Status

Check your migration status:
```bash
npm run migrate:status
```

## 🧪 Test Your Setup

1. **Health Check:**
   ```bash
   curl http://localhost:5000/health
   ```

2. **Register a User:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "TestPass123!",
       "firstName": "Test",
       "lastName": "User"
     }'
   ```

## 🗂️ What's Been Created

### Migration Files:
- `migrations/20241117070000-create-users.js` - Users table
- `migrations/20241117070001-create-weight-measurements.js` - Weight measurements table

### Configuration:
- `.sequelizerc` - Sequelize CLI configuration
- `config/config.js` - Database configuration for all environments
- `.env` - Your environment variables (with secure JWT secret)

### Scripts Added:
- `npm run migrate` - Run database migrations
- `npm run migrate:status` - Check migration status
- `npm run migrate:undo` - Rollback last migration
- `npm run setup:env` - Create .env file
- `npm run setup:db` - Run migrations + seed data

## 🚨 Troubleshooting

### Database Connection Error
```
Error: Unable to connect to the database
```
**Solution:** Check MySQL is running and credentials in `.env` are correct.

### Migration Error
```
Error: Database does not exist
```
**Solution:** Create database first:
```bash
npx sequelize-cli db:create
```

### Permission Error
```
Error: Access denied for user
```
**Solution:** Check MySQL user permissions:
```sql
GRANT ALL PRIVILEGES ON weight_scale_db.* TO 'your_user'@'localhost';
FLUSH PRIVILEGES;
```

## 🎯 Next Steps

1. ✅ Update `.env` with your MySQL credentials
2. ✅ Run `npm run migrate` to create database tables
3. ✅ Start server with `npm run dev`
4. 🧪 Test API with Postman collection
5. 📱 Connect your React Native app

---

**Your Bluetooth Weight Scale API is ready! 🎉**
