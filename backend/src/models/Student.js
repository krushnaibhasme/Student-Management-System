const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    rollNumber: {
      type: String,
      required: [true, 'Roll number is required'],
      unique: true,
      trim: true,
      uppercase: true,
      match: [/^[A-Za-z0-9\-_]+$/, 'Roll number can only contain letters, numbers, hyphens, and underscores']
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address'
      ]
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      enum: {
        values: [
          'Computer Science',
          'Information Technology',
          'Electronics & Communication',
          'Mechanical Engineering',
          'Civil Engineering',
          'Electrical Engineering',
          'Artificial Intelligence & Data Science',
          'Business Administration',
          'Other'
        ],
        message: '{VALUE} is not a supported department'
      }
    },
    year: {
      type: String,
      required: [true, 'Academic year is required'],
      trim: true,
      enum: {
        values: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
        message: 'Year must be one of: 1st Year, 2nd Year, 3rd Year, 4th Year'
      }
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [
        /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/,
        'Please provide a valid phone number (at least 7 digits, digits and standard punctuation only)'
      ]
    }
  },
  {
    timestamps: true
  }
);

// Helpful index on rollNumber and email for fast lookups
studentSchema.index({ rollNumber: 1 });
studentSchema.index({ email: 1 });
// Compound text index for search by name or roll number
studentSchema.index({ name: 'text', rollNumber: 'text' });

module.exports = mongoose.model('Student', studentSchema);
