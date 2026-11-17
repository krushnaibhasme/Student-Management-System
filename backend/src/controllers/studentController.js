const Student = require('../models/Student');

/**
 * @desc    Get all students with optional search & filter
 * @route   GET /api/students
 * @access  Public
 */
const getStudents = async (req, res, next) => {
  try {
    const { search, department, year, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const query = {};

    // Search by name or rollNumber using regex (case-insensitive)
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { rollNumber: searchRegex }];
    }

    // Filter by department
    if (department && department !== 'All') {
      query.department = department;
    }

    // Filter by year
    if (year && year !== 'All') {
      query.year = year;
    }

    // Sorting
    const sort = {};
    const validSortFields = ['name', 'rollNumber', 'department', 'year', 'createdAt'];
    const selectedField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    sort[selectedField] = sortOrder === 'asc' ? 1 : -1;

    const students = await Student.find(query).sort(sort);
    const totalCount = await Student.countDocuments();

    res.status(200).json({
      success: true,
      count: students.length,
      total: totalCount,
      data: students
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single student by ID
 * @route   GET /api/students/:id
 * @access  Public
 */
const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found with ID: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new student
 * @route   POST /api/students
 * @access  Public
 */
const createStudent = async (req, res, next) => {
  try {
    const { name, rollNumber, email, department, year, phone } = req.body;

    // Manual quick validation check before database query
    if (!name || !rollNumber || !email || !department || !year || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, rollNumber, email, department, year, phone'
      });
    }

    // Check if roll number already exists
    const existingRoll = await Student.findOne({ rollNumber: rollNumber.trim().toUpperCase() });
    if (existingRoll) {
      return res.status(409).json({
        success: false,
        message: `Roll number '${rollNumber.trim().toUpperCase()}' is already assigned to ${existingRoll.name}`
      });
    }

    // Check if email already exists
    const existingEmail = await Student.findOne({ email: email.trim().toLowerCase() });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: `Email '${email.trim().toLowerCase()}' is already registered with student ${existingEmail.name}`
      });
    }

    const student = await Student.create({
      name: name.trim(),
      rollNumber: rollNumber.trim().toUpperCase(),
      email: email.trim().toLowerCase(),
      department: department.trim(),
      year: year.trim(),
      phone: phone.trim()
    });

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: student
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a student
 * @route   PUT /api/students/:id
 * @access  Public
 */
const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, rollNumber, email, department, year, phone } = req.body;

    // Check if student exists
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found with ID: ${id}`
      });
    }

    // If updating rollNumber, check if it's already used by another student
    if (rollNumber && rollNumber.trim().toUpperCase() !== student.rollNumber) {
      const rollConflict = await Student.findOne({
        rollNumber: rollNumber.trim().toUpperCase(),
        _id: { $ne: id }
      });
      if (rollConflict) {
        return res.status(409).json({
          success: false,
          message: `Roll number '${rollNumber.trim().toUpperCase()}' is already assigned to another student`
        });
      }
    }

    // If updating email, check if it's already used by another student
    if (email && email.trim().toLowerCase() !== student.email) {
      const emailConflict = await Student.findOne({
        email: email.trim().toLowerCase(),
        _id: { $ne: id }
      });
      if (emailConflict) {
        return res.status(409).json({
          success: false,
          message: `Email '${email.trim().toLowerCase()}' is already used by another student`
        });
      }
    }

    const updatedData = {
      ...(name && { name: name.trim() }),
      ...(rollNumber && { rollNumber: rollNumber.trim().toUpperCase() }),
      ...(email && { email: email.trim().toLowerCase() }),
      ...(department && { department: department.trim() }),
      ...(year && { year: year.trim() }),
      ...(phone && { phone: phone.trim() })
    };

    const updatedStudent = await Student.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: updatedStudent
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a student
 * @route   DELETE /api/students/:id
 * @access  Public
 */
const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found with ID: ${req.params.id}`
      });
    }

    await Student.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: `Student '${student.name}' (${student.rollNumber}) deleted successfully`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/students/stats
 * @access  Public
 */
const getStudentStats = async (req, res, next) => {
  try {
    const totalStudents = await Student.countDocuments();

    const departmentStats = await Student.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const yearStats = await Student.aggregate([
      { $group: { _id: '$year', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalStudents,
        byDepartment: departmentStats,
        byYear: yearStats
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentStats
};
