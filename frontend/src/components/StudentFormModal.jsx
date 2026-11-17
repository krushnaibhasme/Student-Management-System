import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, AlertCircle } from 'lucide-react';

const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Artificial Intelligence & Data Science',
  'Business Administration',
  'Other'
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const StudentFormModal = ({ isOpen, onClose, onSubmit, initialData = null, isSubmitting = false }) => {
  const isEditMode = Boolean(initialData);

  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    email: '',
    department: 'Computer Science',
    year: '1st Year',
    phone: ''
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  // Populate or reset form when modal opens or initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        rollNumber: initialData.rollNumber || '',
        email: initialData.email || '',
        department: initialData.department || 'Computer Science',
        year: initialData.year || '1st Year',
        phone: initialData.phone || ''
      });
    } else {
      setFormData({
        name: '',
        rollNumber: '',
        email: '',
        department: 'Computer Science',
        year: '1st Year',
        phone: ''
      });
    }
    setErrors({});
    setServerError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.rollNumber.trim()) {
      newErrors.rollNumber = 'Roll number is required';
    } else if (!/^[A-Za-z0-9\-_]+$/.test(formData.rollNumber.trim())) {
      newErrors.rollNumber = 'Only letters, numbers, hyphens, and underscores allowed';
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    if (!formData.year) {
      newErrors.year = 'Academic year is required';
    }

    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'Enter a valid phone number (at least 7 digits)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'rollNumber' ? value.toUpperCase() : value
    }));

    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await onSubmit(formData);
    } catch (err) {
      setServerError(err.message || 'An error occurred while saving student record.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {isEditMode ? <Save size={20} color="#4f46e5" /> : <UserPlus size={20} color="#4f46e5" />}
            <h2 className="modal-title">{isEditMode ? 'Update Student Record' : 'Enroll New Student'}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {serverError && (
              <div
                style={{
                  backgroundColor: 'var(--danger-subtle)',
                  border: '1px solid #fca5a5',
                  color: 'var(--danger-text)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.25rem',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
                <span>{serverError}</span>
              </div>
            )}

            <div className="form-grid">
              {/* Full Name */}
              <div className="form-group col-span-2">
                <label className="form-label" htmlFor="student-name">
                  Full Name <span className="required-star">*</span>
                </label>
                <input
                  id="student-name"
                  name="name"
                  type="text"
                  placeholder="e.g. Aarav Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  autoFocus
                />
                {errors.name && <span className="form-error-text">{errors.name}</span>}
              </div>

              {/* Roll Number */}
              <div className="form-group">
                <label className="form-label" htmlFor="student-roll">
                  Roll Number <span className="required-star">*</span>
                </label>
                <input
                  id="student-roll"
                  name="rollNumber"
                  type="text"
                  placeholder="e.g. CS2024001"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  className={`form-input ${errors.rollNumber ? 'error' : ''}`}
                  style={{ textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}
                />
                {errors.rollNumber && <span className="form-error-text">{errors.rollNumber}</span>}
              </div>

              {/* Academic Year */}
              <div className="form-group">
                <label className="form-label" htmlFor="student-year">
                  Academic Year <span className="required-star">*</span>
                </label>
                <select
                  id="student-year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className={`form-select ${errors.year ? 'error' : ''}`}
                >
                  {YEARS.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
                {errors.year && <span className="form-error-text">{errors.year}</span>}
              </div>

              {/* Email Address */}
              <div className="form-group col-span-2">
                <label className="form-label" htmlFor="student-email">
                  Email Address <span className="required-star">*</span>
                </label>
                <input
                  id="student-email"
                  name="email"
                  type="email"
                  placeholder="e.g. aarav.sharma@college.edu"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                />
                {errors.email && <span className="form-error-text">{errors.email}</span>}
              </div>

              {/* Department */}
              <div className="form-group col-span-2">
                <label className="form-label" htmlFor="student-dept">
                  Department <span className="required-star">*</span>
                </label>
                <select
                  id="student-dept"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={`form-select ${errors.department ? 'error' : ''}`}
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.department && <span className="form-error-text">{errors.department}</span>}
              </div>

              {/* Phone Number */}
              <div className="form-group col-span-2">
                <label className="form-label" htmlFor="student-phone">
                  Phone Number <span className="required-star">*</span>
                </label>
                <input
                  id="student-phone"
                  name="phone"
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                />
                {errors.phone && <span className="form-error-text">{errors.phone}</span>}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="pulse-dot" style={{ backgroundColor: 'white' }}></span>
                  Saving...
                </>
              ) : isEditMode ? (
                'Save Changes'
              ) : (
                'Add Student'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentFormModal;
