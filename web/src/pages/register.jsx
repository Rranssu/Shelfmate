import React, { useState } from 'react';
import RegisterForm from '../components/registerForm.jsx';
import LoginForm from '../components/loginForm.jsx';
import './styles/register.css';
import Pic from '../assets/books.jpg'

function Register() {
  const [isLogin, setIsLogin] = useState(false);

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
          {isLogin ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </section>
  );
}

export default Register;
