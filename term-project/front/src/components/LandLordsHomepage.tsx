import "../styles/LandLordsHomepage.css"; // Import the CSS file
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import firebase from "firebase/compat/app";

// Defines the props expected by the LandLordsHomePage component
interface LandLordsHomepageProps {
  db: firebase.firestore.Firestore; // Firestore database reference

  // Listing details and setters for state updates
  listingError: string;
  setListingError: Dispatch<SetStateAction<string>>;

  listingTitle: string;
  setListingTitle: Dispatch<SetStateAction<string>>;

  listingURL: string;
  setListingURL: Dispatch<SetStateAction<string>>;

  listingAddress: string;
  setListingAddress: Dispatch<SetStateAction<string>>;

  listingBedrooms: number;
  setListingBedrooms: Dispatch<SetStateAction<number>>;

  listingPrice: number;
  setListingPrice: Dispatch<SetStateAction<number>>;

  listingDetails: string;
  setListingDetails: Dispatch<SetStateAction<string>>;

  landlordEmail: string;
  userLoggedIn: boolean;
}

// Defines the LandLordsHomePage component
export default function LandLordsHomePage(props: LandLordsHomepageProps) {
  interface theListings {
    // Defines the structure of a single listing
    id: string;
    title: string;
    imgUrl: string;
    address: string;
    bedrooms: number;
    price: number;
    details: string;
    datePosted: string;
  }
  // State variables to manage posted and updated listings
  const [postedListings, setPostedListings] = useState<theListings[]>([]);
  const [updatedListings, setUpdatedListings] = useState<theListings[]>([]);

  // Fetches and updates listings when the component mounts
  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Retrieves listings for the specific landlord from Firestore
        const querySnapshot = await props.db
          .collection("landlords")
          .where("email", "==", props.landlordEmail)
          .get();

        // Updates postedListings and updatedListings with retrieved listings data
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

  // Function to handle posting new listings
  async function handlePosting(event: React.FormEvent) {
    // Generates a unique ID for the new listing based on time posted
    function generateUniqueId() {
      const timestamp = new Date().getTime(); // Gets  current timestamp
      const random = Math.floor(Math.random() * 1000); // Generates a random number between 0 and 999
      return `${timestamp}_${random}`;
    }

    event.preventDefault(); // prevents page from re-rendering
    // Checks for missing input or duplicate address
    if (
      !props.listingTitle ||
      !props.listingURL ||
      !props.listingAddress ||
      props.listingBedrooms == 0||
      props.listingPrice == 0 ||
      !props.listingDetails
    ) {
      // Sets an error message for missing input fields
      props.setListingError("Please be sure to input all fields.");
    } else if (
      postedListings.some((listing) => listing.address === props.listingAddress)
    ) {
     
      // Set an error message for duplicate address
      props.setListingError("A listing with the same address already exists.");
    } else {
      //post successfully
      const formattedDate = new Date(new Date().getTime()).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
      const newListing = {
        id: generateUniqueId(), // Generates a random uniqueu id based on time posted
        title: props.listingTitle,
        imgUrl: props.listingURL,
        address: props.listingAddress,
        bedrooms: props.listingBedrooms,
        price: props.listingPrice,
        details: props.listingDetails,
        datePosted: formattedDate,
      };

      // Update Firestore with the new listing for the specific landlord
      const querySnapshot = await props.db
        .collection("landlords")
        .where("email", "==", props.landlordEmail)
        .get();

      querySnapshot.forEach((doc) => {
        const currentListings = doc.data().listings || [];
        const updatedListings = [...currentListings, newListing];
        setUpdatedListings(updatedListings);

        // Update the 'listings' field for the specific landlord in Firestore
        doc.ref
          .update({
            listings: updatedListings,
          })
          .catch((error) => {
            console.error("Error adding listing:", error);
          });
      });

      // Reset input fields and error message
      props.setListingTitle("");
      props.setListingURL("");
      props.setListingAddress("");
      props.setListingBedrooms(0);
      props.setListingPrice(0);
      props.setListingDetails("");
      props.setListingError("");
    }
  }
  console.log(postedListings);

  //Render different UI based on user login status and landlord access & Render the 
  //main UI for landlords to post and view listings
  return !props.userLoggedIn ? (
    <h2 className="not-logged-in"> Please log in. </h2>
  ) : !props.landlordEmail ? (
    <h2>
      Only landlords can have acess to this page. Please log in as a landlord.
    </h2>
  ) : (
    <div className="LandLords-HomePage">
      <div className="post-listing-section">
        <h2>Post New Listing</h2>
        <form
          className="listings-form"
          aria-label="You can submit your listings here"
        >
          <label></label>
          <div id="post-form">
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
              value={props.listingBedrooms || ""}
              type="number"
              onChange={(ev) =>
                props.setListingBedrooms(parseFloat(ev.target.value))
              }
            ></input>
            <input
              className="Price"
              aria-label="You can enter the price of the housing option"
              placeholder="Enter price here"
              value={props.listingPrice || ""}
              type="number"
              onChange={(ev) =>
                props.setListingPrice(parseFloat(ev.target.value))
              }
            ></input>
            <input
              className="Details"
              aria-label="You can enter any neccessary details"
              placeholder="Description and Details: Lorem ipsum dolor sit amet"
              value={props.listingDetails}
              onChange={(ev) => props.setListingDetails(ev.target.value)}
            ></input>
          </div>
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
              ev.preventDefault();
              props.setListingTitle("Modern house");
              props.setListingURL(
                "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L2pvYjcyMC0xMTMtdi5qcGc.jpg"
              );
              props.setListingAddress("1 INTERNATIONAL PL STE P110 BOSTON MA");
              props.setListingBedrooms(3);
              props.setListingPrice(2000);
              props.setListingDetails("very strong very sturdy house");
            }}
          >
            Demo Posting
          </button>
        </form>
      </div>
      <div className="listings-section">
        <h2>My Listings</h2>
        <div className="listing-boxes">
            {updatedListings.map((listing) => (
              <div key={listing.id} className="listing-box">
                <h3>{listing.title}</h3>
                <p>Address: {listing.address}</p>
                <p>Posted: {listing.datePosted}</p>
                <p>Bedrooms: {listing.bedrooms}</p>
                <p>Price: ${listing.price}</p>
                <p>{listing.details}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
