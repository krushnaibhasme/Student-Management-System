const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const mongoose = require('mongoose');
const Student = require('../models/Student');
const sampleStudents = require('./seedData');

const seedDatabase = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ Error: MONGODB_URI not found in backend/.env');
    process.exit(1);
  }

  try {
    console.log('⏳ Connecting to MongoDB Atlas...');
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB.');

    // Clear existing records to ensure fresh seed
    console.log('🧹 Clearing existing students collection...');
    await Student.deleteMany({});
    console.log('✅ Cleared collection.');

    // Insert sample records
    console.log('🌱 Inserting sample student records...');
    const inserted = await Student.insertMany(sampleStudents);
    console.log(`🎉 Successfully seeded ${inserted.length} students into the database!`);

    console.log('\nSample Student Records Created:');
    inserted.forEach((student, index) => {
      console.log(`  ${index + 1}. ${student.name} | ${student.rollNumber} | ${student.department} | ${student.year}`);
    });

    console.log('\nDatabase seeding finished successfully.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
