import "../styles/RentalInfoPage.css"; // Import the CSS file
import { useParams } from "react-router-dom";

/**
 * RentalInfoPage Component
 *
 * This component displays detailed information for a selected rental listing.
 * It receives a list of all listings as props and filters the relevant listing based on the provided ID.
 * If the listing is found, it displays information such as address, bedrooms, details, and price.
 * If the listing is not found, it shows an error message.
 */

// Interface defining the structure of a Listing object
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

interface RentalInfoPageProps {
  allListings: Listing[];
  userLoggedIn: boolean;
}

// Interface defining the properties for the RentalInfoPage component
export default function RentalInfoPage(props: RentalInfoPageProps) {
  // Gets the 'id' parameter from the route
  const { id } = useParams<{ id: string }>();
  console.log("all in rental: ", props.allListings)
  // Finds the selected listing based on the provided ID
  const selectedListing = props.allListings.find(
    (listing) => listing.id === id
  );
  console.log(selectedListing)

  // If the selected listing is not found, display an error message
  if (!selectedListing) {
    if (!props.userLoggedIn){
       return <h2> Please log in. </h2>
    } else {
    return <h3>No information found for a rental. Please return to browsing page</h3>;
    }
  }
  
  return (
    <div className="rental-info-page">
      <div className="rental-img">
        <img
          src={selectedListing.imgUrl}
          alt={"Image for listing ${id}"}
          className="listing img"
        ></img>
        <div className="rental-info">
          <div className="container">
            <div className="rental-info-header">
              <p>
              <span className="bold-text">{selectedListing.title} </span>
            </p>
            <p>
              Posted on {selectedListing.datePosted}
            </p>
            </div>
            <p>
              <span className="bold-text">Address: </span>
              {selectedListing.address}
            </p>
            <p>
              <span className="bold-text"> Bedrooms: </span>
              {selectedListing.bedrooms}
            </p>
            <p>
              <span className="bold-text"> Details: </span>
              {selectedListing.details}
            </p>
            
            <p>
              <span className="bold-text">Price: </span> {selectedListing.price}
            </p>
            {selectedListing.distance ?
            <p>
              <span className="bold-text"> Distance from your work: </span>
              {selectedListing.distance} mi
            </p>: null}
            {selectedListing.duration ? <p>
              <span className="bold-text"> Commute from your work: </span>
              {selectedListing.duration} mins
            </p> : null}
            
          </div>
        </div>
      </div>
    </div>
  );
}
