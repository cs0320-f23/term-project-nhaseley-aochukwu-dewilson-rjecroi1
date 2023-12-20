import { Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";

/**
 * NavLinks Component
 *
 * This component represents a set of navigation links displayed in the Navbar.
 * It includes links for user authentication (Login, Register) and additional
 * links for signing out, browsing listings and accessing a landlord's homepage.
 */

interface Listing {
  address: string;
  bedrooms: number;
  details: string;
  id: string;
  imgUrl: string;
  price: number;
  title: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
  duration?: number;
  datePosted: string;
}
interface NavLinksProps {
  userLoggedIn: boolean;
  setUserLoggedIn: Dispatch<SetStateAction<boolean>>;
  adminEmail: string;
  // props needed to reset on sign out
  setStudentName: Dispatch<SetStateAction<string>>;
  setStudentEmail: Dispatch<SetStateAction<string>>;
  setStudentPass: Dispatch<SetStateAction<string>>;
  setStudentAddress: Dispatch<SetStateAction<string>>;
  setError: Dispatch<SetStateAction<string>>;
  setLandlordName: Dispatch<SetStateAction<string>>;
  setLandlordEmail: Dispatch<SetStateAction<string>>;
  setLandlordPass: Dispatch<SetStateAction<string>>;
  setLandlordPhone: Dispatch<SetStateAction<string>>;
  setLandlordError: Dispatch<SetStateAction<string>>;
  setAdminEmail: Dispatch<SetStateAction<string>>;
  setAdminPass: Dispatch<SetStateAction<string>>;
  setAdminError: Dispatch<SetStateAction<string>>;
  setAdminName: Dispatch<SetStateAction<string>>;
  setListingTitle: Dispatch<SetStateAction<string>>;
  setListingURL: Dispatch<SetStateAction<string>>;
  setListingAddress: Dispatch<SetStateAction<string>>;
  setListingBedrooms: Dispatch<SetStateAction<number>>;
  setListingDetails: Dispatch<SetStateAction<string>>;
  setListingPrice: Dispatch<SetStateAction<number>>;
  setAllListings: Dispatch<SetStateAction<Listing[]>>;
}

export default function NavLinks(props: NavLinksProps) {

  function handleSignOut(){
    props.setUserLoggedIn(false)
    props.setStudentName("")
    props.setStudentEmail("")
    props.setStudentPass("")
    props.setStudentAddress("")
    props.setError("")
    props.setLandlordName("")
    props.setLandlordEmail("")
    props.setLandlordPass("")
    props.setLandlordPhone("")
    props.setLandlordError("")
    props.setAdminEmail("")
    props.setAdminPass("")
    props.setAdminError("")
    props.setAdminName("")
    props.setListingTitle("")
    props.setListingURL("")
    props.setListingAddress("")
    props.setListingBedrooms(0)
    props.setListingDetails("")
    props.setListingPrice(0)
    props.setAllListings([])
  }
  return (
    <div className="navLinks">
      {props.userLoggedIn == true ? (
        <Link
          className="nav-login"
          to="/login"
          onClick={
            () =>handleSignOut()
          }
        >
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
      {props.adminEmail && props.userLoggedIn == true ? (
        <Link className="nav-admin-homepage" to="/admin">
          Admin
        </Link>
      ) : null}
    </div>
  );
}
