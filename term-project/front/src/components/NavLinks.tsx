/**
 * NavLinks Component
 *
 * This component represents a set of navigation links displayed in the Navbar.
 * It includes links for user authentication (Login, Register) and additional
 * links for browsing listings and accessing a landlord's homepage.
 */
import { Link } from "react-router-dom";

export default function NavLinks() {
  return (
    <div className="navLinks">
      <Link className="nav-login" to="/login">
        {" "}
        Login{" "}
      </Link>
      <Link className="nav-register" to="/register">
        {" "}
        Register{" "}
      </Link>
      <Link className="nav-listings" to="/listings">
        {" "}
        Browse{" "}
      </Link>
      <Link className="nav-landlords-homepage" to="/LandLordsHomepage">
        {" "}
        My Listings{" "}
      </Link>
    </div>
  );
}
