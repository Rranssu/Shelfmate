import './styles/navbar.css'
import { Link } from "react-router-dom";
import { FaMoneyBill } from "react-icons/fa";
import { IoBusinessSharp } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaSchool } from "react-icons/fa";

function Navbar() {
  return(
    <nav className="navbar">
      <div className="logo-container">
        <img src="/logo.webp" alt="" className="logo"/>
        <div className="shelfmate items">Shelf Mate</div>
      </div>
      <div>
        <a href="#prcng" className="buttons money">
          <FaMoneyBill />
          <span className="label">Pricing</span>
        </a>
        <a href="prtnrs" className="buttons partnersB">
          <IoBusinessSharp />
          <span className="label">Partners</span>
        </a>
        <a href="abt" className="buttons aboutB">
          <FaUser />
          <span className="label">About</span>
        </a>           
        <Link to="/register" className="school buttons registerB">
          <FaSchool />
          <span className="label">Register</span>
        </Link>
      </div>
    </nav> 
  );
}

export default Navbar;
