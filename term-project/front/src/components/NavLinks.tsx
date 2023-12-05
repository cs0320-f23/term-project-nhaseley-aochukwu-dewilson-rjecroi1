import { Link } from "react-router-dom";

export default function NavLinks(){
    return (
        <div className="navLinks"> 
        <Link className="nav-login" to="/login"> Login </Link>
        <Link className="nav-register" to="/register"> Register </Link>
        <Link className="nav-listings" to="/listings" > Browse </Link>
        <Link className="nav-landlords-homepage" to="/LandLordsHomepage"> My Listings</Link> 
        </div>
    )
}