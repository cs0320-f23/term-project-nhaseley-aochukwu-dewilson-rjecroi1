import React, { useEffect } from "react";
import "../styles/Listings.css";
import { Link } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import { ACCESS_TOKEN } from "../private/MapboxToken.tsx";
import "mapbox-gl/dist/mapbox-gl.css";

export default function ListingsPage() {
  const mockListingInfo = [
    {
      id: 1,
      address: "78 Brown St.",
      latlong: [42.3355, -71.0457],
      datePosted: "May 5, 2023",
      url: "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L2pvYjcyMC0xMTMtdi5qcGc.jpg",
    },
    {
      id: 2,
      address: "34 Brown St.",
      latlong: [42.3787, -71.0616],
      datePosted: "September 5, 2023",
      url: "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA4L2pvYjk1MC0xMDctdi5qcGc.jpg",
    },
    {
      id: 3,
      address: "46 Caliente Rd.",
      latlong: [42.3407, -71.0706],
      datePosted: "January 5, 2023",
      url: "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L2pvYjcxNy0wNTItdi5qcGc.jpg",
    },
  ];

  useEffect(() => {
    mapboxgl.accessToken = ACCESS_TOKEN;
    const map = new mapboxgl.Map({
      container: "mapbox",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-71.057083, 42.361145],
      zoom: 12,
    });

    mockListingInfo.forEach((listing) => {
      new mapboxgl.Marker()
        .setLngLat([listing.latlong[1], listing.latlong[0]])
        .addTo(map);
    });

    return () => map.remove();
  }, [mockListingInfo]);

  return (
    <div>
      <div id="mapbox" className="map"></div>
      <div id="listings-page">
        <div className="row">
          {mockListingInfo.map((listing) => (
            <div key={listing.id} className="listing-info">
              <Link to={`/info/${listing.id}`}>
                <img src={listing.url} alt={`Listing for ${listing.id}`} />
              </Link>
              <p>Address: {listing.address}</p>
              <p>Date Posted: {listing.datePosted}</p>
            </div>
          ))}
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
