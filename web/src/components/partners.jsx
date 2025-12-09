import React from 'react';
import './styles/partners.css';

function Partners() {
  return (
    <section className="partners">
      <div className="partners-content">
        <h1 className="partners-title">Our Partners</h1>
        <p className="partners-description">
          We collaborate with leading organizations to bring you the best in literature and learning. Meet our trusted partners who help make Shelf Mate possible.
        </p>
        <div className="partners-grid">
          <div className="partner-card">
            <img src="/logos/partner1.png" alt="Partner 1 Logo" className="partner-logo" />
            <h3 className="partner-name">Partner 1</h3>
            <p className="partner-description">A leading provider of educational resources, dedicated to fostering a love for reading in communities worldwide.</p>
          </div>
          <div className="partner-card">
            <img src="/logos/partner2.png" alt="Partner 2 Logo" className="partner-logo" />
            <h3 className="partner-name">Partner 2</h3>
            <p className="partner-description">Specializing in digital libraries, they ensure seamless access to diverse book collections for all users.</p>
          </div>
          <div className="partner-card">
            <img src="/logos/partner3.png" alt="Partner 3 Logo" className="partner-logo" />
            <h3 className="partner-name">Partner 3</h3>
            <p className="partner-description">An innovator in publishing, partnering with us to promote authors and stories that inspire change.</p>
          </div>
        </div>
        <button className="partners-btn">Learn More</button>
      </div>
    </section>
  );
}

export default Partners;

