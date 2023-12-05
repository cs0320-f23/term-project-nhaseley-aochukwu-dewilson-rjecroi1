import React from "react";
import "../styles/Listings.css";
import { Link } from "react-router-dom";


export default function ListingsPage() {
  const mockListingInfo = [
    {
      id: 1,
      address: "78 Brown St.",
      datePosted: "May 5, 2023",
      url: "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L2pvYjcyMC0xMTMtdi5qcGc.jpg"
    },
    {
      id: 2,
      address: "34 Brown St.",
      datePosted: "September 5, 2023",
      url: "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA4L2pvYjk1MC0xMDctdi5qcGc.jpg"
    },
    {
      id: 3,
      address: "46 Caliente Rd.",
      datePosted: "January 5, 2023",
      url: "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L2pvYjcxNy0wNTItdi5qcGc.jpg",
    },
  ];

  return (
    
    <div id="listings-page">
        <div className="row">
          {mockListingInfo.map(
            (listing) => (
              <div key={listing.id} className="listing-info">
                  <Link to={`/info/${listing.id}`}>
                    <img src={listing.url} alt={`Listing for ${listing.id}`} />
                  </Link>
                <p>Address: {listing.address}</p>
                <p>Date Posted: {listing.datePosted}</p>
              </div>
            )
          )}
      </div>

      {/* Side Control */}
      <div className="sidenav">
        <label>Distance</label>
        <div className="distance-slider">
          <div className="sliderValue">
            <span>100</span>
          </div>
          <div className="field">
            <div className="value left">0</div>
            <input type="range" min="10" max="100" step="1" />
            <div className="value-right">100</div>
          </div>
        </div>
      </div>
    </div>
  );
}
