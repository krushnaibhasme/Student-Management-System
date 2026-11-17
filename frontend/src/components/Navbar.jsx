import React from 'react';
import { GraduationCap, Server, RefreshCw } from 'lucide-react';

const Navbar = ({ isBackendHealthy, isRefreshing, onRefresh }) => {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand-wrapper">
          <div className="brand-icon">
            <GraduationCap size={24} />
          </div>
          <div>
            <div className="brand-title">EduManage</div>
            <div className="brand-subtitle">Student Information System</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            className={`status-badge ${isBackendHealthy ? 'online' : 'offline'}`}
            title={
              isBackendHealthy
                ? 'Backend REST API is connected and healthy'
                : 'Connecting to Backend REST API...'
            }
          >
            <span className="pulse-dot"></span>
            <span>{isBackendHealthy ? 'API Online' : 'Connecting API'}</span>
          </div>

          <button
            className="btn btn-secondary"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh student records"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
          >
            <RefreshCw size={14} className={isRefreshing ? 'pulse-dot' : ''} />
            <span style={{ display: 'inline-block' }}>Sync</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
