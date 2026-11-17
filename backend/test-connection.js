const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Determine correct .env path whether run from root or from backend folder
const envPath = fs.existsSync(path.join(__dirname, '.env'))
  ? path.join(__dirname, '.env')
  : path.join(process.cwd(), 'backend', '.env');

dotenv.config({ path: envPath, override: true });

const testConnection = async () => {
  console.log('=======================================================');
  console.log('🔍 MongoDB Environment Diagnostic & Connection Test');
  console.log('=======================================================');
  console.log(`📁 Loaded environment file: ${envPath}`);

  const uri = process.env.MONGODB_URI;

  if (!uri || uri.trim() === '') {
    console.error('❌ Error: MONGODB_URI is missing or empty in backend/.env');
    process.exit(1);
  }

  // Check for MongoDB Atlas placeholder brackets
  if (uri.includes('<db_password>') || uri.includes('<password>') || uri.includes('<username>')) {
    console.log('⚠️  Notice: MONGODB_URI contains Atlas placeholder text (such as <db_password>).');
    console.log('👉 You must replace <db_password> with your actual database user password.');
    console.log('   (Tip: run "npm run set:password" inside backend to set it securely).');
    process.exit(1);
  }

  // Safely mask credentials in console output
  const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:********@');
  console.log(`📡 Connecting to: ${maskedUri}`);

  try {
    const startTime = Date.now();
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    const latency = Date.now() - startTime;

    console.log('───────────────────────────────────────────────────────');
    console.log('🎉 MongoDB Atlas Connection: SUCCESSFUL!');
    console.log(`⏱️  Ping Latency: ${latency}ms`);
    console.log(`🌐 Cluster Host: ${conn.connection.host}`);
    console.log(`📂 Database Name: ${conn.connection.name}`);
    console.log(`🟢 Status: Ready for queries`);
    console.log('───────────────────────────────────────────────────────');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('───────────────────────────────────────────────────────');
    console.error('❌ MongoDB Connection Failed:');
    console.error(error.message);

    if (error.message.includes('Password contains unescaped characters')) {
      console.error('\n💡 Hint: Special characters in your password (like @, :, /, #, %)');
      console.error('   must be percent-encoded (e.g. encodeURIComponent).');
      console.error('   Run "npm run set:password" to encode and save it automatically.');
    } else if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.error('\n💡 Hint: Authentication failed. Verify that your username and password match');
      console.error('   the database user created in MongoDB Atlas (under Database Access).');
    } else if (error.message.includes('queryTxt ETIMEOUT') || error.message.includes('Server selection timed out')) {
      console.error('\n💡 Hint: Connection timed out. Make sure IP address 0.0.0.0/0');
      console.error('   ("Allow access from anywhere") is added in MongoDB Atlas (Network Access).');
    }
    console.error('───────────────────────────────────────────────────────');
    process.exit(1);
  }
};

testConnection();
