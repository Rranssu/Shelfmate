import React, { useState } from 'react';
import './styles/navbar.css';
import { Link } from "react-router-dom";
import { FaMoneyBill, FaUser, FaSchool, FaBars, FaTimes } from "react-icons/fa";
import { IoBusinessSharp } from "react-icons/io5";

function Navbar() {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  return(
    <nav className="navbar">
      <div className="logo-container">
        <img src="/logo.webp" alt="" className="logo"/>
        <div className="shelfmate items">Shelf Mate</div>
      </div>

      <div className="menu-icon" onClick={handleClick}>
        {click ? <FaTimes /> : <FaBars />}
      </div>

      <div className={click ? "nav-menu active" : "nav-menu"}>
        <a href="#prcng" className="buttons money" onClick={closeMobileMenu}>
          <FaMoneyBill />
          <span className="label">Pricing</span>
        </a>
        <a href="prtnrs" className="buttons partnersB" onClick={closeMobileMenu}>
          <IoBusinessSharp />
          <span className="label">Partners</span>
        </a>
        <a href="abt" className="buttons aboutB" onClick={closeMobileMenu}>
          <FaUser />
          <span className="label">About</span>
        </a>           
        <Link to="/register" className="buttons registerB school" onClick={closeMobileMenu}>
          <FaSchool />
          <span className="label">Register</span>
        </Link>
      </div>
    </nav> 
  );
}

export default Navbar;