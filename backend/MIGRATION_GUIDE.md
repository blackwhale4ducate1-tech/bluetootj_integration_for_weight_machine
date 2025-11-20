# 🗄️ Database Migration Guide

This guide explains how to use Sequelize migrations to manage your database schema.

## 📋 Overview

Migrations provide a way to:
- **Version control** your database schema
- **Share database changes** across team members
- **Deploy database updates** safely to production
- **Rollback changes** if needed

## 🚀 Quick Start

### 1. Setup Environment
```bash
# Create .env file with your credentials
node create-env.js

# Edit .env file with your MySQL credentials
# Update: DB_PASSWORD, DB_USER, DB_NAME, DB_HOST
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Migrations
```bash
# Run all pending migrations
npm run migrate

# Check migration status
npm run migrate:status
```

## 📁 Migration Files Created

### `20241117070000-create-users.js`
Creates the Users table with:
- **id** (Primary Key, Auto Increment)
- **email** (Unique, Not Null)
- **password** (Hashed, Not Null)
- **firstName, lastName** (Optional)
- **height** (Decimal, for BMI calculation)
- **dateOfBirth** (Date)
- **gender** (Enum: male/female/other)
- **createdAt, updatedAt** (Timestamps)
- **Indexes**: Unique email index

### `20241117070001-create-weight-measurements.js`
Creates the WeightMeasurements table with:
- **id** (Primary Key, Auto Increment)
- **userId** (Foreign Key to Users)
- **weight** (Decimal, Not Null)
- **unit** (Enum: kg/lbs, Default: kg)
- **bmi** (Calculated BMI)
- **bodyFat, muscleMass, boneMass, waterPercentage** (Body metrics)
- **timestamp** (Measurement time)
- **notes** (Text, Optional)
- **createdAt, updatedAt** (Timestamps)
- **Indexes**: userId+timestamp, userId+createdAt, timestamp

## 🛠️ Available Migration Commands

### Run Migrations
```bash
# Run all pending migrations
npm run migrate

# Check which migrations have been run
npm run migrate:status
```

### Rollback Migrations
```bash
# Undo the last migration
npm run migrate:undo

# Undo all migrations (DANGEROUS!)
npm run migrate:undo:all
```

### Using Sequelize CLI Directly
```bash
# Generate a new migration
npx sequelize-cli migration:generate --name add-new-column

# Run specific migration
npx sequelize-cli db:migrate --to 20241117070000-create-users.js

# Create database (if it doesn't exist)
npx sequelize-cli db:create
```

## 🔧 Configuration

### `.sequelizerc`
Defines paths for Sequelize CLI:
```javascript
{
  'config': 'config/config.js',
  'models-path': 'models',
  'seeders-path': 'seeders', 
  'migrations-path': 'migrations'
}
```

### `config/config.js`
Database configuration for different environments:
- **development**: Local development with logging
- **test**: Test database (appends _test to DB name)
- **production**: Production settings with connection pooling

## 📝 Environment Variables Required

Make sure your `.env` file contains:
```bash
DB_HOST=localhost          # Your MySQL host
DB_PORT=3306              # Your MySQL port
DB_NAME=weight_scale_db   # Your database name
DB_USER=root              # Your MySQL username
DB_PASSWORD=your_password # Your MySQL password
```

## 🚀 Deployment Workflow

### Development
1. Create/modify migrations
2. Run `npm run migrate`
3. Test your changes
4. Commit migration files

### Production
1. Deploy code with migration files
2. Run `npm run migrate` on production server
3. Verify migration status with `npm run migrate:status`

## 🔄 Creating New Migrations

### Generate Migration File
```bash
npx sequelize-cli migration:generate --name your-migration-name
```

### Migration Template
```javascript
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add your migration logic here
    await queryInterface.addColumn('Users', 'newColumn', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    // Add rollback logic here
    await queryInterface.removeColumn('Users', 'newColumn');
  }
};
```

## 🛡️ Best Practices

### Migration Safety
- **Always test** migrations on development first
- **Create backups** before running migrations in production
- **Write rollback logic** in the `down` method
- **Use transactions** for complex migrations

### Naming Conventions
- Use timestamps: `YYYYMMDDHHMMSS-description.js`
- Be descriptive: `create-users`, `add-email-index`, `remove-old-column`
- Use kebab-case for file names

### Schema Changes
- **Add columns**: Always make new columns nullable initially
- **Remove columns**: Consider deprecation period first
- **Rename columns**: Use separate add/remove migrations
- **Indexes**: Add indexes for foreign keys and frequently queried columns

## 🚨 Troubleshooting

### Migration Fails
```bash
# Check migration status
npm run migrate:status

# View detailed error logs
NODE_ENV=development npm run migrate
```

### Database Connection Issues
```bash
# Test database connection
npx sequelize-cli db:create
```

### Reset Database (Development Only)
```bash
# DANGER: This will delete all data!
npm run migrate:undo:all
npm run migrate
```

## 📊 Migration vs Model Sync

### Use Migrations When:
- ✅ Working in a team
- ✅ Deploying to production
- ✅ Need version control of schema changes
- ✅ Want to rollback capabilities

### Use Model Sync When:
- ❌ Prototyping only
- ❌ Development with frequent schema changes
- ❌ No production deployment

## 🎯 Next Steps

1. **Update .env** with your MySQL credentials
2. **Run migrations**: `npm run migrate`
3. **Verify tables**: Check your MySQL database
4. **Start server**: `npm run dev`
5. **Test API**: Use Postman collection or cURL

Your database is now properly set up with migrations! 🎉
