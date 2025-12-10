import React from 'react';
import Overview from './overview';
import RecentEntry from './recentEntry';
import InventorySummary from './inventorySummary';
import './styles/adminDashboard.css';

function AdminDashboard({ libraryUid }) { 
    return (
        <main className="admin-dashboard">
            <div className="dashboard-content">
                <div className="dashboard-grid">
                    {/* 2. Pass prop down */}
                    <Overview libraryUid={libraryUid} />
                    <RecentEntry libraryUid={libraryUid} />
                    <InventorySummary libraryUid={libraryUid} />
                </div>
            </div>
        </main>
    );
}

export default AdminDashboard;