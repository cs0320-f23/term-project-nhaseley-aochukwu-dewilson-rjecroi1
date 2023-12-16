/**
 * Navbar Component
 *
 * This component represents the navigation bar at the top of the application.
 * It includes links to the home page and additional navigation links (NavLinks).
 */

import { Link } from "react-router-dom";
import NavLinks from "./NavLinks";
import "../styles/Navbar.css";
import { Dispatch, SetStateAction } from "react";

interface NavBarProps {
  userLoggedIn: boolean;
  setUserLoggedIn: Dispatch<SetStateAction<boolean>>;
  adminEmail: string;
}

export default function Navbar(props: NavBarProps) {
  return (
    <div className="navbar">
      <Link className="nav-home" to="/">
        Home
      </Link>
      <NavLinks userLoggedIn={props.userLoggedIn} setUserLoggedIn={props.setUserLoggedIn} adminEmail={props.adminEmail}></NavLinks>
    </div>
  );
}
