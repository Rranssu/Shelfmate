import React from 'react';
import './styles/about.css';

function About() {
  return (
    <section className="about">
      <div className="about-content">
        <h1 className="about-title">About Us</h1>
        <p className="about-description">
          Shelf Mate is dedicated to democratizing access to literature. Founded with a passion for books, we connect readers with stories that inspire, educate, and entertain—all for free.
        </p>
        <div className="about-grid">
          <div className="about-card">
            <h3 className="about-name">Our Mission</h3>
            <p className="about-description">To make high-quality books accessible to everyone, fostering a global community of lifelong learners without any barriers or costs.</p>
          </div>
          <div className="about-card">
            <h3 className="about-name">Our Team</h3>
            <p className="about-description">A diverse group of book enthusiasts, developers, and educators working together to curate and deliver the best reading experiences.</p>
          </div>
          <div className="about-card">
            <h3 className="about-name">Our Vision</h3>
            <p className="about-description">A world where every person has the power of knowledge at their fingertips, inspiring creativity and change through the magic of books.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
