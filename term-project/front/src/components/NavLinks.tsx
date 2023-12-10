import { Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";

interface NavLinksProps {
  userLoggedIn: boolean;
  setUserLoggedIn: Dispatch<SetStateAction<boolean>>;
}
export default function NavLinks(props: NavLinksProps) {
  return (
    <div className="navLinks">
      {props.userLoggedIn == true ? (
        <Link className="nav-login" to="/login" onClick={() => 
        props.setUserLoggedIn(false)
        // TODO: set all other fields to their default values
        }>
        Sign Out
      </Link>
      ) : (
        <Link className="nav-login" to="/login">
          Login
        </Link>
      )}
      <Link className="nav-register" to="/register">
        Register
      </Link>
      <Link className="nav-listings" to="/listings">
        Browse
      </Link>
      <Link className="nav-landlords-homepage" to="/LandLordsHomepage">
        My Listings
      </Link>
      {/* TODO: add link for admin page? */}
    </div>
  );
}
