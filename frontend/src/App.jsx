import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Plus, X, ChevronDown, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import StudentTable from './components/StudentTable';
import StudentFormModal from './components/StudentFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import studentApi from './services/api';

const DEPARTMENTS = [
  'All',
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

const YEARS = ['All', '1st Year', '2nd Year', '3rd Year', '4th Year'];

function App() {
  // State
  const [students, setStudents] = useState([]);
  const [totalStudentsCount, setTotalStudentsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isBackendHealthy, setIsBackendHealthy] = useState(false);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch students from backend
  const fetchStudents = useCallback(async (showRefreshingSpinner = false) => {
    if (showRefreshingSpinner) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const response = await studentApi.getStudents({
        search: searchTerm,
        department: selectedDept,
        year: selectedYear,
        sortBy,
        sortOrder
      });

      if (response && response.success) {
        setStudents(response.data || []);
        setTotalStudentsCount(response.total ?? response.data.length);
        setIsBackendHealthy(true);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setIsBackendHealthy(false);
      addToast(error.message || 'Failed to load students from server', 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [searchTerm, selectedDept, selectedYear, sortBy, sortOrder, addToast]);

  // Initial health check and load
  useEffect(() => {
    const init = async () => {
      const healthy = await studentApi.checkHealth();
      setIsBackendHealthy(healthy);
      await fetchStudents();
    };
    init();
  }, [fetchStudents]);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedDept, selectedYear, sortBy, sortOrder]);

  // Check backend health periodically (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(async () => {
      const healthy = await studentApi.checkHealth();
      setIsBackendHealthy(healthy);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Handlers for Add & Edit
  const handleOpenAddModal = () => {
    setStudentToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (student) => {
    setStudentToEdit(student);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmittingForm(true);
    try {
      if (studentToEdit) {
        // Update existing student
        const response = await studentApi.updateStudent(studentToEdit._id, formData);
        addToast(`Updated record for ${response.data.name}`, 'success');
      } else {
        // Create new student
        const response = await studentApi.createStudent(formData);
        addToast(`Enrolled ${response.data.name} successfully!`, 'success');
      }

      setIsFormModalOpen(false);
      setStudentToEdit(null);
      await fetchStudents();
    } catch (error) {
      // Re-throw so modal can display the specific validation or duplicate key message
      throw error;
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Handlers for Delete
  const handleOpenDeleteModal = (student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (studentId) => {
    setIsDeleting(true);
    try {
      await studentApi.deleteStudent(studentId);
      addToast(`Deleted ${studentToDelete.name}'s record`, 'info');
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
      await fetchStudents();
    } catch (error) {
      addToast(error.message || 'Failed to delete student', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Sorting handler
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedDept('All');
    setSelectedYear('All');
  };

  const hasActiveFilters = Boolean(
    searchTerm.trim() !== '' || selectedDept !== 'All' || selectedYear !== 'All'
  );

  return (
    <div>
      {/* Top Navigation */}
      <Navbar
        isBackendHealthy={isBackendHealthy}
        isRefreshing={isRefreshing}
        onRefresh={() => fetchStudents(true)}
      />

      <main className="app-container">
        {/* Hero Section */}
        <div className="hero-section">
          <div>
            <h1 className="hero-title">Student Information Directory</h1>
            <p className="hero-description">
              Manage student records, departments, enrollments, and academic profiles.
            </p>
          </div>

          <button className="btn btn-primary" onClick={handleOpenAddModal}>
            <Plus size={18} />
            <span>Add Student</span>
          </button>
        </div>

        {/* Dashboard Stat Cards */}
        <StatsCards
          totalStudents={totalStudentsCount}
          filteredCount={students.length}
          students={students}
        />

        {/* Search, Filter & Toolbar */}
        <div className="toolbar-card">
          <div className="toolbar-row">
            {/* Search Input */}
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search by student name or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="search-clear-btn"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="filter-group">
              {/* Department Filter */}
              <div className="select-wrapper">
                <select
                  className="filter-select"
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  aria-label="Filter by department"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept === 'All' ? 'All Departments' : dept}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="select-arrow" />
              </div>

              {/* Year Filter */}
              <div className="select-wrapper">
                <select
                  className="filter-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  aria-label="Filter by academic year"
                >
                  {YEARS.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr === 'All' ? 'All Years' : yr}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="select-arrow" />
              </div>

              {hasActiveFilters && (
                <button
                  className="btn btn-ghost"
                  onClick={handleClearFilters}
                  style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Students Table & Card List */}
        <StudentTable
          students={students}
          isLoading={isLoading}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal}
          onAddNew={handleOpenAddModal}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </main>

      {/* Add / Edit Student Modal */}
      <StudentFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setStudentToEdit(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={studentToEdit}
        isSubmitting={isSubmittingForm}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setStudentToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        student={studentToDelete}
        isDeleting={isDeleting}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default App;
