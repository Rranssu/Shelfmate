import React, { useEffect, useRef } from 'react';
import './styles/hero.css';

function Hero() {
  const textRef = useRef(null);

  useEffect(() => {
    const words = ['Books', 'Harry Potter', 'The Chronicles of Narnia', 'Percy Jackson', 'One Piece'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 150; //
    const deletingSpeed = 100;
    const delayBetweenWords = 2000;

    const typeWriter = () => {
      const currentWord = words[wordIndex];
      const currentText = isDeleting
        ? currentWord.substring(0, charIndex--)
        : currentWord.substring(0, charIndex++);

      if (textRef.current) {
        textRef.current.textContent = currentText;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        setTimeout(() => (isDeleting = true), delayBetweenWords);
      } else if (isDeleting && charIndex < 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        charIndex = 0;
      }

      const speed = isDeleting ? deletingSpeed : typingSpeed;
      setTimeout(typeWriter, speed);
    };

    typeWriter();
  }, []);

  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          Discover the World of <span ref={textRef} className="animated-text"></span>
          <span className="cursor">|</span>
        </h1>
        <button className="get-started-btn">Get Started</button>
      </div>
    </section>
  );
}

export default Hero;
