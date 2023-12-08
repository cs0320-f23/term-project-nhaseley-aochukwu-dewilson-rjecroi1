import { Link } from "react-router-dom";
import NavLinks from "./NavLinks";
import { Dispatch, SetStateAction } from "react";
import "../styles/Navbar.css";
interface NavBarProps {
  userLoggedIn: boolean;
  setUserLoggedIn: Dispatch<SetStateAction<boolean>>;
}

export default function Navbar(props: NavBarProps) {
  return (
    <div className="navbar">
      <Link className="nav-home" to="/">
        Home
      </Link>
      <NavLinks userLoggedIn={props.userLoggedIn} setUserLoggedIn={props.setUserLoggedIn}></NavLinks>
    </div>
  );
}
