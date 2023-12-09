import "../styles/LandLordsHomepage.css"; // Import the CSS file
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import firebase from "firebase/compat/app";

interface LandLordsHomepageProps {
  db: firebase.firestore.Firestore;

  listingError: string;
  setListingError: Dispatch<SetStateAction<string>>;

  listingTitle: string;
  setListingTitle: Dispatch<SetStateAction<string>>;

  listingURL: string;
  setListingURL: Dispatch<SetStateAction<string>>;

  listingAddress: string;
  setListingAddress: Dispatch<SetStateAction<string>>;

  listingBedrooms: string;
  setListingBedrooms: Dispatch<SetStateAction<string>>;

  listingPrice: string;
  setListingPrice: Dispatch<SetStateAction<string>>;

  listingDetails: string;
  setListingDetails: Dispatch<SetStateAction<string>>;

  landlordEmail: string;

}

export default function LandLordsHomePage(props: LandLordsHomepageProps) {
  interface theListings {
    id: string;
    title: string;
    imgUrl: string;
    address: string;
    bedrooms: string;
    price: string;
    details: string;
  }
  const [postedListings, setPostedListings] = useState<theListings[]>([]);
  const [updatedListings, setUpdatedListings] = useState<theListings[]>([]);

  // Fetch and update listings when the component mounts
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const querySnapshot = await props.db
          .collection("landlords")
          .where("email", "==", props.landlordEmail)
          .get();

        querySnapshot.forEach((doc) => {
          const storedListings = doc.data().listings || [];
          setPostedListings(storedListings);
          setUpdatedListings(storedListings);
        });
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, [props.db, props.landlordEmail]);

  async function handlePosting(event: React.FormEvent) {


    function generateUniqueId() {
      const timestamp = new Date().getTime(); // Get current timestamp
      const random = Math.floor(Math.random() * 1000); // Generate a random number between 0 and 999
      return `${timestamp}_${random}`;
    }

    event.preventDefault(); // prevents page from re-rendering
    if (
      !props.listingTitle ||
      !props.listingURL ||
      !props.listingAddress ||
      !props.listingBedrooms ||
      !props.listingPrice ||
      !props.listingDetails
    ) {
      // missing input
      props.setListingError("Please be sure to input all fields.");
    } else if (
      postedListings.some((listing) => listing.address === props.listingAddress)
    ) {
      props.setListingError("A listing with the same address already exists.");
    } else {
      //post successfully

      const newListing = {
        id: generateUniqueId(), // Generates a random uniqueu id based on time posted 
        title: props.listingTitle,
        imgUrl: props.listingURL,
        address: props.listingAddress,
        bedrooms: props.listingBedrooms,
        price: props.listingPrice,
        details: props.listingDetails,
      };

      const querySnapshot = await props.db
        .collection("landlords")
        .where("email", "==", props.landlordEmail)
        .get();

      querySnapshot.forEach((doc) => {
        const currentListings = doc.data().listings || [];
        const updatedListings = [...currentListings, newListing];
        setUpdatedListings(updatedListings);

        console.log("found landlord");

        // Update the 'listings' field for the specific landlord in Firestore
        doc.ref
          .update({
            listings: updatedListings,
          })
          .then(() => {
            console.log("Listing added successfully");
          })
          .catch((error) => {
            console.error("Error adding listing:", error);
          });
      });
      props.setListingTitle("");
      props.setListingURL("");
      props.setListingAddress("");
      props.setListingBedrooms("");
      props.setListingPrice("");
      props.setListingDetails("");
      props.setListingError("");
    }
  }
  console.log(postedListings);

  return (
    <div className="LandLords-HomePage">
      <div className="listings-section">
        <h2>My Listings</h2>
        <div className="listing-boxes">
          {updatedListings.map((listing) => (
            <div key={listing.id} className="listing-box">
              <h3>{listing.title}</h3>
              <p>Address: {listing.address}</p>
              <p>Bedrooms: {listing.bedrooms}</p>
              <p>Price: {listing.price}</p>
              <p>{listing.details}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="post-listing-section">
        <h2>Post New Listing</h2>
        <form
          className="listings-form"
          aria-label="You can submit your listings here"
        >
          <label></label>
          <input
            className="Title"
            aria-label="You can enter the title of your listing here"
            placeholder="Enter title here"
            value={props.listingTitle}
            onChange={(ev) => props.setListingTitle(ev.target.value)}
          ></input>
          <input
            className="image_url"
            aria-label="You can enter the url of the housing option here "
            placeholder="Enter url of image here"
            value={props.listingURL}
            onChange={(ev) => props.setListingURL(ev.target.value)}
          ></input>
          <input
            className="Address"
            aria-label="You can enter your address here (must be a valid address)"
            placeholder="Enter address here"
            value={props.listingAddress}
            onChange={(ev) => props.setListingAddress(ev.target.value)}
          ></input>
          <input
            className="Bedrooms "
            aria-label="You can enter number of bedrooms Here"
            placeholder="Enter number of bedrooms here"
            value={props.listingBedrooms}
            onChange={(ev) => props.setListingBedrooms(ev.target.value)}
          ></input>
          <input
            className="Price"
            aria-label="You can enter the price of the housing option"
            placeholder="Enter the price here"
            value={props.listingPrice}
            onChange={(ev) => props.setListingPrice(ev.target.value)}
          ></input>
          <input
            className="Details"
            aria-label="You can enter any neccessary details"
            placeholder="Description and Details: Lorem ipsum dolor sit amet"
            value={props.listingDetails}
            onChange={(ev) => props.setListingDetails(ev.target.value)}
          ></input>
          <h3> {props.listingError} </h3>
          <button
            className="student-register-button"
            onClick={(ev) => handlePosting(ev)}
          >
            Post
          </button>
          <button
            type="button"
            className="demo-landlord-registration-for-listing-test-here"
            onClick={(ev) => {
              console.log("Button clicked!");
              ev.preventDefault();
              props.setListingTitle("Modern house");
              props.setListingURL("someurl/.com");
              props.setListingAddress("98 poise point ave");
              props.setListingBedrooms("3");
              props.setListingPrice("5000");
              props.setListingDetails("very strong very sturdy house");
            }}
          >
            Demo Posting
          </button>
        </form>
      </div>
    </div>
  );
}
