import React from 'react';
import { Users, Building2, Calendar, Filter } from 'lucide-react';

const StatsCards = ({ totalStudents, filteredCount, students }) => {
  // Compute unique departments and unique years from current records
  const departmentsCount = new Set(students.map((s) => s.department)).size;
  const isFiltering = filteredCount !== totalStudents;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-info">
          <div className="stat-label">Total Students</div>
          <div className="stat-value">{totalStudents}</div>
        </div>
        <div className="stat-icon indigo">
          <Users size={24} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <div className="stat-label">Active Departments</div>
          <div className="stat-value">{departmentsCount}</div>
        </div>
        <div className="stat-icon emerald">
          <Building2 size={24} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <div className="stat-label">Academic Batches</div>
          <div className="stat-value">4 Years</div>
        </div>
        <div className="stat-icon violet">
          <Calendar size={24} />
        </div>
      </div>

      {isFiltering && (
        <div className="stat-card" style={{ borderColor: 'var(--primary-border)' }}>
          <div className="stat-info">
            <div className="stat-label">Matching Results</div>
            <div className="stat-value" style={{ color: 'var(--primary)' }}>
              {filteredCount}
            </div>
          </div>
          <div className="stat-icon amber">
            <Filter size={24} />
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsCards;
