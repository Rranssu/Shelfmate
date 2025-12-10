import React, { useState, useEffect } from 'react';
import './styles/inventorySummary.css';

function InventorySummary({ libraryUid }) {
  const [summary, setSummary] = useState({
    totalBooks: 0,
    availableBooks: 0,
    borrowedBooks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!libraryUid) return;

    const fetchSummary = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/inventory-summary?libraryUid=${libraryUid}`);
        const data = await response.json();
        
        if (response.ok) {
          setSummary(data);
        }
      } catch (error) {
        console.error('Error fetching inventory summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [libraryUid]);

  if (loading) {
    return <div className="inventory-summary-container"><p>Loading stats...</p></div>;
  }

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