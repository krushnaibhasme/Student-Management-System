const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ Error: MONGODB_URI is not defined in your environment variables.');
    console.error('👉 Please create a .env file inside the backend directory with your MongoDB Atlas URI.');
    process.exit(1);
  }

  if (uri.includes('<username>') || uri.includes('<password>')) {
    console.error('❌ Error: MONGODB_URI contains placeholder credentials (<username> / <password>).');
    console.error('👉 Please update backend/.env with your actual MongoDB Atlas username and password.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host} (Database: ${conn.connection.name})`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
