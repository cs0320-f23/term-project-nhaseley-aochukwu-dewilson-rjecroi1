import { Link } from "react-router-dom";
import NavLinks from "./NavLinks";
import "../styles/Navbar.css"

export default function Navbar() {
  return (
    <div className="navbar">
      <Link className="nav-home" to="/"> Home </Link>
      <NavLinks></NavLinks>

    </div>
  );

}
