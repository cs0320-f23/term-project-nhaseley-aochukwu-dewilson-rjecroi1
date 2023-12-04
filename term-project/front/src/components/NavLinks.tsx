import { Link } from "react-router-dom";

export default function NavLinks(){
    return (
        <div className="navLinks"> 
        <Link className="nav-listings" to="/listings" > Listings</Link>
        <Link className="nav-login" to="/login"> Login </Link>
        <Link className="nav-register" to="/register"> Register </Link>
        <Link className="nav-landlords-homepage" to="/LandLordsHomepage"> LandLords Homepage</Link> 
        {/*<Link className="nav-profile" to="/profile"> Profile </Link> */}
        </div>
    )
}


//4th link -->  link to the renter homepage 