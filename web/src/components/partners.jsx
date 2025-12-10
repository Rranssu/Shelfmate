import React from 'react';
import './styles/partners.css';
import wmsu from '../assets/wmsu.jpg';
import mit from '../assets/mit.png';
import harvard from '../assets/harvard.png';


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
            <img src={ wmsu } alt="Partner 1 Logo" className="partner-logo" />
            <h3 className="partner-name">Western Mindanao State University</h3>
            <p className="partner-description">A leading University of Mindanao Providing better Higher Education.</p>
          </div>
          <div className="partner-card">
            <img src={mit} alt="Partner 2 Logo" className="partner-logo" />
            <h3 className="partner-name">Massachusetts Institute of Technology</h3>
            <p className="partner-description">MIT has played a significant role in the development of many areas of modern technology and science.</p>
          </div>
          <div className="partner-card">
            <img src={harvard} alt="Partner 3 Logo" className="partner-logo" />
            <h3 className="partner-name">Harvard University</h3>
            <p className="partner-description">Harvard University is devoted to excellence in teaching, learning, and research, and to developing leaders in many disciplines who make a difference globally.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Partners;

