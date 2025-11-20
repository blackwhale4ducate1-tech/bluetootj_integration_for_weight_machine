#!/usr/bin/env node

const fs = require('fs');
const crypto = require('crypto');

// Generate a secure JWT secret
const generateJWTSecret = () => {
  return crypto.randomBytes(64).toString('hex');
};

// Create .env file with default values
const createEnvFile = () => {
  const jwtSecret = generateJWTSecret();
  
  const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=weight_scale_db
DB_USER=root
DB_PASSWORD=your_mysql_password_here

# JWT Configuration
JWT_SECRET=${jwtSecret}
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:8081
`;

  fs.writeFileSync('.env', envContent);
  
  console.log('✅ .env file created successfully!');
  console.log('');
  console.log('📝 Please update the following values in your .env file:');
  console.log('   - DB_PASSWORD: Your MySQL password');
  console.log('   - DB_USER: Your MySQL username (if not root)');
  console.log('   - DB_NAME: Your database name (if different)');
  console.log('   - DB_HOST: Your database host (if not localhost)');
  console.log('');
  console.log('🔐 JWT Secret has been auto-generated for security.');
  console.log('');
  console.log('🚀 Next steps:');
  console.log('   1. Update your database credentials in .env');
  console.log('   2. Install dependencies: npm install');
  console.log('   3. Run migrations: npm run migrate');
  console.log('   4. Start the server: npm run dev');
};

// Check if .env already exists
if (fs.existsSync('.env')) {
  console.log('⚠️  .env file already exists!');
  console.log('If you want to recreate it, delete the existing .env file first.');
} else {
  createEnvFile();
}
