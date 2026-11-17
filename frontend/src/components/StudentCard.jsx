import React from 'react';
import { Mail, Phone, Edit3, Trash2 } from 'lucide-react';
import { getInitials, getAvatarColor } from '../utils/formatters';

const StudentCard = ({ student, onEdit, onDelete }) => {
  const avatarStyle = getAvatarColor(student.name);

  return (
    <div className="mobile-student-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            className="avatar"
            style={{ backgroundColor: avatarStyle.bg, color: avatarStyle.text }}
          >
            {getInitials(student.name)}
          </div>
          <div>
            <div className="student-name-text">{student.name}</div>
            <div className="student-roll-badge">{student.rollNumber}</div>
          </div>
        </div>

        <div className="action-btn-group">
          <button
            className="icon-btn edit"
            onClick={() => onEdit(student)}
            title="Edit student"
            aria-label="Edit student"
          >
            <Edit3 size={15} />
          </button>
          <button
            className="icon-btn delete"
            onClick={() => onDelete(student)}
            title="Delete student"
            aria-label="Delete student"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span className="badge badge-dept">{student.department}</span>
        <span className="badge badge-year">{student.year}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
        <a href={`mailto:${student.email}`} className="contact-link">
          <Mail size={14} />
          <span>{student.email}</span>
        </a>
        <a href={`tel:${student.phone}`} className="contact-link">
          <Phone size={14} />
          <span>{student.phone}</span>
        </a>
      </div>
    </div>
  );
};

export default StudentCard;
