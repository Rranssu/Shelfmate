import React, { useState } from 'react';
import RegisterForm from '../components/registerForm.jsx'; // Import RegisterForm
import LoginForm from '../components/loginForm.jsx'; // Import LoginForm
import './styles/register.css';
import Pic from '../assets/books.jpg'

function Register() {
  const [isLogin, setIsLogin] = useState(false); // State to toggle between register and login

  return (
    <section className="register">
      <div className="register-left">
        <img src={Pic} alt="Register/Login Hero Image" className="register-image" />
      </div>
      <div className="register-right">
        <div className="register-content">
          {/* Toggle Button */}
          <div className="toggle-container">
            <button 
              className={`toggle-btn ${!isLogin ? 'active' : ''}`} 
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
            <button 
              className={`toggle-btn ${isLogin ? 'active' : ''}`} 
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
          </div>
          {/* Conditionally Render Form */}
          {isLogin ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </section>
  );
}

export default Register;
