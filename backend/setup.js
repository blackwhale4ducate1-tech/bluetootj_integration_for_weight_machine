#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupEnvironment() {
  console.log('🚀 Bluetooth Weight Scale API Setup\n');
  
  const envPath = path.join(__dirname, '.env');
  
  if (fs.existsSync(envPath)) {
    const overwrite = await question('⚠️  .env file already exists. Overwrite? (y/N): ');
    if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
      console.log('Setup cancelled.');
      rl.close();
      return;
    }
  }
  
  console.log('\n📋 Please provide the following configuration:\n');
  
  // Server configuration
  const port = await question('Server Port (default: 5000): ') || '5000';
  const nodeEnv = await question('Environment (development/production) (default: development): ') || 'development';
  
  // Database configuration
  console.log('\n🗄️  Database Configuration:');
  const dbHost = await question('Database Host (default: localhost): ') || 'localhost';
  const dbPort = await question('Database Port (default: 3306): ') || '3306';
  const dbName = await question('Database Name (default: weight_scale_db): ') || 'weight_scale_db';
  const dbUser = await question('Database Username (default: root): ') || 'root';
  const dbPassword = await question('Database Password: ');
  
  // JWT configuration
  console.log('\n🔐 JWT Configuration:');
  const jwtSecret = await question('JWT Secret (leave empty for auto-generated): ') || generateRandomSecret();
  const jwtExpire = await question('JWT Expiration (default: 7d): ') || '7d';
  
  // CORS configuration
  console.log('\n🌐 CORS Configuration:');
  const corsOrigin = await question('Allowed Origins (default: http://localhost:3000,http://localhost:8081): ') || 'http://localhost:3000,http://localhost:8081';
  
  // Create .env content
  const envContent = `# Server Configuration
PORT=${port}
NODE_ENV=${nodeEnv}

# Database Configuration
DB_HOST=${dbHost}
DB_PORT=${dbPort}
DB_NAME=${dbName}
DB_USER=${dbUser}
DB_PASSWORD=${dbPassword}

# JWT Configuration
JWT_SECRET=${jwtSecret}
JWT_EXPIRE=${jwtExpire}

# CORS Configuration
CORS_ORIGIN=${corsOrigin}
`;

  // Write .env file
  fs.writeFileSync(envPath, envContent);
  
  console.log('\n✅ Environment configuration created successfully!');
  console.log('\n📝 Next steps:');
  console.log('1. Make sure MySQL is running');
  console.log(`2. Create database: CREATE DATABASE ${dbName};`);
  console.log('3. Install dependencies: npm install');
  console.log('4. Start the server: npm run dev');
  console.log('\n🔗 Server will be available at: http://localhost:' + port);
  
  rl.close();
}

function generateRandomSecret() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let result = '';
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Run setup
setupEnvironment().catch(console.error);
