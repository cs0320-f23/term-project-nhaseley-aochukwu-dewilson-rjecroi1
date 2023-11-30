import "../styles/RentersHomePage.css"; // Import the CSS file

export default function RentersHomePage() {
      const mockListings = [
        {
          id: 1,
          title: "Beautiful Apartment",
          address: "78 Brown st",
          bedrooms: 2,
          details: "Lorem ipsum dolor sit amet",
        },
        {
          id: 2,
          title: "Cozy House",
          address: "34 Brown st",
          bedrooms: 3,
          details: "Consectetur adipiscing elit",
        },
      ];

  return (
    <div className="Renters-HomePage">
      <div className="listings-section">
        <h2>My Listings</h2>
        <div className="listing-boxes">
          {mockListings.map((listing) => (
            <div key={listing.id} className="listing-box">
              <h3>{listing.title}</h3>
              <p>Address: {listing.address}</p>
              <p>Bedrooms: {listing.bedrooms}</p>
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
            placeholder="Enter Title Here"
          ></input>
          <input
            className="Address"
            aria-label="You can enter your address here (must be a valid address)"
            placeholder="Enter Address Here"
          ></input>
          <input
            className="Bedrooms "
            aria-label="You can enter number of bedrooms Here"
            placeholder="Enter number of bedrooms here"
          ></input>
          <input
            className="Details"
            aria-label="You can enter any neccessary details"
            placeholder="Description and Details: Lorem ipsum dolor sit amet"
          ></input>
        </form>
      </div>
    </div>
  );
}
