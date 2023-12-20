import { Link } from "react-router-dom";
import NavLinks from "./NavLinks";
import "../styles/Navbar.css";
import { Dispatch, SetStateAction } from "react";

/**
 * Navbar Component
 *
 * This component represents the navigation bar at the top of the application.
 * It includes links to the home page and additional navigation links (NavLinks).
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

interface NavBarProps {
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

export default function Navbar(props: NavBarProps) {
  return (
    <div className="navbar">
      <Link className="nav-home" to="/">
        Home
      </Link>
      <NavLinks
        userLoggedIn={props.userLoggedIn}
        setUserLoggedIn={props.setUserLoggedIn}
        adminEmail={props.adminEmail}
        // props needed to reset on sign out
        setStudentName={props.setStudentName}
        setStudentEmail={props.setStudentEmail}
        setStudentPass={props.setStudentPass}
        setStudentAddress={props.setStudentAddress}
        setError={props.setError}
        setLandlordName={props.setLandlordName}
        setLandlordEmail={props.setLandlordEmail}
        setLandlordPass={props.setLandlordPass}
        setLandlordPhone={props.setLandlordPhone}
        setLandlordError={props.setLandlordError}
        setAdminEmail={props.setAdminEmail}
        setAdminPass={props.setAdminPass}
        setAdminError={props.setAdminError}
        setAdminName={props.setAdminName}
        setListingTitle={props.setListingTitle}
        setListingURL={props.setListingURL}
        setListingAddress={props.setListingAddress}
        setListingBedrooms={props.setListingBedrooms}
        setListingDetails={props.setListingDetails}
        setListingPrice={props.setListingPrice}
        setAllListings={props.setAllListings}
      ></NavLinks>
    </div>
  );
}
