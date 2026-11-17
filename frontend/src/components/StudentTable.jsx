import React from 'react';
import { Mail, Phone, Edit3, Trash2, ArrowUpDown, UserX, Plus } from 'lucide-react';
import { getInitials, getAvatarColor } from '../utils/formatters';
import StudentCard from './StudentCard';

const StudentTable = ({
  students,
  isLoading,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  onAddNew,
  onClearFilters,
  hasActiveFilters
}) => {
  const renderSortIndicator = (field) => {
    if (sortBy !== field) {
      return <ArrowUpDown size={12} style={{ opacity: 0.35, marginLeft: 4 }} />;
    }
    return (
      <span style={{ marginLeft: 4, fontWeight: 'bold', color: 'var(--primary)' }}>
        {sortOrder === 'asc' ? '▲' : '▼'}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="table-card" style={{ padding: '1.5rem' }}>
        <div className="skeleton-row"></div>
        <div className="skeleton-row"></div>
        <div className="skeleton-row"></div>
        <div className="skeleton-row"></div>
        <div className="skeleton-row"></div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="table-card">
        <div className="empty-state">
          <div className="empty-state-icon">
            <UserX size={32} />
          </div>
          <h3 className="empty-state-title">
            {hasActiveFilters ? 'No Matching Students Found' : 'No Students Enrolled Yet'}
          </h3>
          <p className="empty-state-desc">
            {hasActiveFilters
              ? 'Try modifying your search keywords or resetting your department/year filter.'
              : 'Get started by enrolling the first student into the database or run the sample seed data.'}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            {hasActiveFilters ? (
              <button className="btn btn-secondary" onClick={onClearFilters}>
                Clear All Filters
              </button>
            ) : (
              <button className="btn btn-primary" onClick={onAddNew}>
                <Plus size={16} />
                Enroll First Student
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="table-card">
      {/* Desktop & Tablet Table */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th
                onClick={() => onSort('name')}
                style={{ cursor: 'pointer', userSelect: 'none' }}
                title="Click to sort by Name"
              >
                Student Info {renderSortIndicator('name')}
              </th>
              <th
                onClick={() => onSort('rollNumber')}
                style={{ cursor: 'pointer', userSelect: 'none' }}
                title="Click to sort by Roll Number"
              >
                Roll Number {renderSortIndicator('rollNumber')}
              </th>
              <th
                onClick={() => onSort('department')}
                style={{ cursor: 'pointer', userSelect: 'none' }}
                title="Click to sort by Department"
              >
                Department {renderSortIndicator('department')}
              </th>
              <th
                onClick={() => onSort('year')}
                style={{ cursor: 'pointer', userSelect: 'none' }}
                title="Click to sort by Year"
              >
                Year {renderSortIndicator('year')}
              </th>
              <th>Contact Details</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const avatarStyle = getAvatarColor(student.name);

              return (
                <tr key={student._id}>
                  {/* Name and Avatar */}
                  <td>
                    <div className="student-identity">
                      <div
                        className="avatar"
                        style={{ backgroundColor: avatarStyle.bg, color: avatarStyle.text }}
                      >
                        {getInitials(student.name)}
                      </div>
                      <div>
                        <div className="student-name-text">{student.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          ID: {student._id.slice(-6)}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Roll Number */}
                  <td>
                    <span className="student-roll-badge">{student.rollNumber}</span>
                  </td>

                  {/* Department */}
                  <td>
                    <span className="badge badge-dept">{student.department}</span>
                  </td>

                  {/* Academic Year */}
                  <td>
                    <span className="badge badge-year">{student.year}</span>
                  </td>

                  {/* Contact */}
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <a href={`mailto:${student.email}`} className="contact-link" title="Send Email">
                        <Mail size={13} />
                        <span>{student.email}</span>
                      </a>
                      <a href={`tel:${student.phone}`} className="contact-link" title="Call Student">
                        <Phone size={13} />
                        <span>{student.phone}</span>
                      </a>
                    </div>
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="action-btn-group" style={{ justifyContent: 'center' }}>
                      <button
                        className="icon-btn edit"
                        onClick={() => onEdit(student)}
                        title={`Edit ${student.name}`}
                        aria-label="Edit student"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        className="icon-btn delete"
                        onClick={() => onDelete(student)}
                        title={`Delete ${student.name}`}
                        aria-label="Delete student"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List (shown on small screens) */}
      <div className="mobile-cards">
        {students.map((student) => (
          <StudentCard
            key={student._id}
            student={student}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default StudentTable;
