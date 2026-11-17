const express = require('express');
const router = express.Router();

const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentStats
} = require('../controllers/studentController');

// Dashboard statistics route (must be defined BEFORE /:id to prevent route shadowing)
router.get('/stats', getStudentStats);

// Main collection routes: View all & Create
router.route('/')
  .get(getStudents)
  .post(createStudent);

// Single student routes: View single, Update, Delete
router.route('/:id')
  .get(getStudentById)
  .put(updateStudent)
  .delete(deleteStudent);

module.exports = router;
