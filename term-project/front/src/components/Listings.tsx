import React from "react";
import "../styles/Listings.css";

export default function ListingsPage() {
  const mockListingInfo = [
    {
      id: 1,
      address: "78 Brown St.",
      datePosted: "May 5, 2023",
    },
    {
      id: 2,
      address: "34 Brown St.",
      datePosted: "September 5, 2023",
    },
    {
      id: 3,
      address: "46 Caliente Rd.",
      datePosted: "January 5, 2023",
    },
  ];

  return (
    <div id="listings-page">
      {/* First Row */}
      <div id="content">
        <div className="row">
          <img
            src="https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L2pvYjcxNy0wNTItdi5qcGc.jpg"
            alt="Example Listing 1"
          />
          {mockListingInfo.map(
            (listingImage) =>
              listingImage.id == 3 && (
                <div key={listingImage.id} className="listing-info">
                  <p>Address: {listingImage.address}</p>
                  <p>Date Posted: {listingImage.datePosted}</p>
                </div>
              )
          )}
        </div>
        <div className="row">
          <img
            src="https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA4L2pvYjk1MC0xMDctdi5qcGc.jpg"
            alt="Example Listing 2"
          />
          {mockListingInfo.map(
            (listingImage) =>
              listingImage.id == 2 && (
                <div key={listingImage.id} className="listing-info">
                  <p>Address: {listingImage.address}</p>
                  <p>Date Posted: {listingImage.datePosted}</p>
                </div>
              )
          )}
        </div>
        <div className="row">
          <img
            src="https://images.rawpixel.com/image_400/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvcGQ0My0wNjAzLTAyMy1uYW1fMS5qcGc.jpg"
            alt="Example Listing 3"
          />
          {mockListingInfo.map(
            (listingImage) =>
              listingImage.id == 1 && (
                <div key={listingImage.id} className="listing-info">
                  <p>Address: {listingImage.address}</p>
                  <p>Date Posted: {listingImage.datePosted}</p>
                </div>
              )
          )}
        </div>
      </div>

      {/* Second Row */}
      <div id="content">
        <div className="row">
          <img src="https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L2pvYjcyMC0xMTMtdi5qcGc.jpg" />
          {mockListingInfo.map(
            (listingImage) =>
              listingImage.id == 1 && (
                <div key={listingImage.id} className="listing-info">
                  <p>Address: {listingImage.address}</p>
                  <p>Date Posted: {listingImage.datePosted}</p>
                </div>
              )
          )}
        </div>
        <div className="row">
          <img src="https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA4L2pvYjk1MC0xMDctdi5qcGc.jpg" />
          {mockListingInfo.map(
            (listingImage) =>
              listingImage.id == 3 && (
                <div key={listingImage.id} className="listing-info">
                  <p>Address: {listingImage.address}</p>
                  <p>Date Posted: {listingImage.datePosted}</p>
                </div>
              )
          )}
        </div>
        <div className="row">
          <img src="https://images.rawpixel.com/image_400/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvcGQ0My0wNjAzLTAyMy1uYW1fMS5qcGc.jpg" />
          {mockListingInfo.map(
            (listingImage) =>
              listingImage.id == 2 && (
                <div key={listingImage.id} className="listing-info">
                  <p>Address: {listingImage.address}</p>
                  <p>Date Posted: {listingImage.datePosted}</p>
                </div>
              )
          )}
        </div>
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
