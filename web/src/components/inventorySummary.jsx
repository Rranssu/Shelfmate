import React from 'react';
import './styles/inventorySummary.css';

function InventorySummary() {
  const summary = {
    totalBooks: 500,
    availableBooks: 450,
    borrowedBooks: 50
  };

  return (
    <div className="inventory-summary-container">
      <h2>Inventory Summary</h2>
      <div className="summary-stats">
        <div className="summary-item">
          <p className="summary-number">{summary.totalBooks}</p>
          <p className="summary-label">Total Books</p>
        </div>
        <div className="summary-item">
          <p className="summary-number">{summary.availableBooks}</p>
          <p className="summary-label">Available</p>
        </div>
        <div className="summary-item">
          <p className="summary-number">{summary.borrowedBooks}</p>
          <p className="summary-label">Borrowed</p>
        </div>
      </div>
    </div>
  );
}

export default InventorySummary;