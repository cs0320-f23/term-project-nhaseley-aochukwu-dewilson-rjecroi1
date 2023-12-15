/**
 * RentalInfoPage Component
 *
 * This component displays detailed information for a selected rental listing.
 * It receives a list of all listings as props and filters the relevant listing based on the provided ID.
 * If the listing is found, it displays information such as address, bedrooms, details, and price.
 * If the listing is not found, it shows an error message.
 */
import "../styles/RentalInfoPage.css"; // Import the CSS file
import { useParams } from "react-router-dom";


// Interface defining the structure of a Listing object
interface Listing {
  address: string;
  bedrooms: string;
  details: string;
  id: string;
  imgUrl: string;
  price: number;
  title: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
}

interface RentalInfoPageProps {
  allListings: Listing[];
}

// Interface defining the properties for the RentalInfoPage component
export default function RentalInfoPage(props: RentalInfoPageProps) {
  // Gets the 'id' parameter from the route
  const { id } = useParams<{ id: string }>();

  // Finds the selected listing based on the provided ID
  const selectedListing = props.allListings.find(
    (listing) => listing.id === id
  );

  // If the selected listing is not found, display an error message
  if (!selectedListing) {
    return <div>No information found for rental {id}</div>;
  }
  
  //go through all the listing using the props and display information for lisitng that matches
  return (
    <div>
      <div className="rental-img">
        <img
          src={selectedListing.imgUrl}
          alt={"Image for listing ${id}"}
          className="listing img"
        ></img>
        <div className="rental-info">
          <div className="container">
            <p>
              <span className="bold-text">Address: </span>
              {selectedListing.address}
            </p>
            <p>
              <span className="bold-text"> Bedrooms: </span>
              {selectedListing.bedrooms}
            </p>
            <p>
              <span className="bold-text"> Details: </span>{" "}
              {selectedListing.details}
            </p>
            <p>
              <span className="bold-text">Price: </span> {selectedListing.price}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
