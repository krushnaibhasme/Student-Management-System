import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, student, isDeleting }) => {
  if (!isOpen || !student) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--danger-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <AlertTriangle size={18} color="#ef4444" />
            </div>
            <h2 className="modal-title" style={{ color: 'var(--danger-text)' }}>Confirm Deletion</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: 'var(--text-main)', fontSize: '0.925rem', marginBottom: '1rem' }}>
            Are you sure you want to permanently delete this student record?
          </p>

          <div
            style={{
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '0.875rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}
          >
            <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1rem' }}>
              {student.name}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--primary)' }}>
                {student.rollNumber}
              </span>
              <span>•</span>
              <span>{student.department}</span>
              <span>•</span>
              <span>{student.year}</span>
            </div>
          </div>

          <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '1rem', fontWeight: 500 }}>
            ⚠️ This action cannot be reversed. The student will be removed from MongoDB Atlas.
          </p>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(student._id)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="pulse-dot" style={{ backgroundColor: 'white' }}></span>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Delete Record
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
