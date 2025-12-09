import React from 'react';
import './styles/pricing.css';

function Pricing() {
  return (
    <section className="pricing">
      <div className="pricing-content">
        <h1 className="pricing-title">Pricing</h1>
        <p className="pricing-description">
          At Shelf Mate, we believe in making knowledge accessible to everyone. That's why our platform is completely free—no hidden fees, no subscriptions, and no costs whatsoever.
        </p> 
        <button className="pricing-btn">Get Started for Free</button>
      </div>
    </section>
  );
}

export default Pricing;
