import "../styles/RentalInfoPage.css"; // Import the CSS file
import { useParams } from "react-router-dom";

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

export default function RentalInfoPage(props: RentalInfoPageProps) {
  const { id } = useParams<{ id: string }>();
  const selectedListing = props.allListings.find(
    (listing) => listing.id === id
  );
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
