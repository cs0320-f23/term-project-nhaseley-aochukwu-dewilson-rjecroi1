import { useEffect, useState } from "react";
import "../styles/Listings.css";
import { Link } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import { ACCESS_TOKEN } from "../private/MapboxToken.tsx";
import "mapbox-gl/dist/mapbox-gl.css";
import Box from "@mui/material/Box";
import firebase from "firebase/compat/app";

import Slider from "@mui/material/Slider";
function valuetext(value: number) {
  return `${value} miles`;
}
interface ListingPageProps {
  db: firebase.firestore.Firestore;
  studentAddress: string;
  userLoggedIn: boolean;
  studentEmail: string;
}
interface Landlord {
  listings: Listing[];
}
interface Listing {
  address: string;
  bedrooms: string; // TODO: CHANGE TO INT
  details: string;
  id: string;
  imgUrl: string;
  price: string; // TODO: CHANGE TO INT
  title: string;
  // TODO: add date posted on postNewListing?
}
interface Coordinate {
  latitude: number;
  longitude: number;
  distance: number;
}

export default function ListingsPage(props: ListingPageProps) {
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [distance, setDistance] = useState<number>(10); // Initial distance value

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const landlordSnapshot = await props.db.collection("landlords").get();

        const allListingsArray: Listing[] = [];

        landlordSnapshot.forEach((landlordDoc) => {
          const landlordData = landlordDoc.data() as Landlord;
          const landlordListings = landlordData.listings || [];

          allListingsArray.push(...landlordListings);
        });

        setAllListings(allListingsArray);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, []);

  console.log("ALL LISTINGS: ", allListings);

  const mockListingInfo = [
    {
      id: 1,
      address: "69 Brown St Providence RI",
      latlong: [41.82682, -71.402931],
      datePosted: "May 5, 2023",
      url: "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L2pvYjcyMC0xMTMtdi5qcGc.jpg",
    },
    // {
    //   id: 2,
    //   address: "315 Thayer St Providence RI",
    //   latlong: [42.3787, -71.0616],
    //   datePosted: "September 5, 2023",
    //   url: "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA4L2pvYjk1MC0xMDctdi5qcGc.jpg",
    // },
    {
      id: 3,
      address: "200 Meeting St Providence RI",
      latlong: [41.8274129, -71.3993247],
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
    // Use the load event to ensure the map is ready
    map.on("load", () => {
      allListings.forEach(async (listing) => {
        const popupContent = `
          <div>
            <h3>${listing.address}</h3>
            <p> ${listing.title} </p>
            <a href="/info/${listing.id}">See More</a>
          </div>`;
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);

        try {
          const coordinateConverted = await getDistance(listing.address);
          console.log("API RES: ", coordinateConverted);
          if (
            coordinateConverted.latitude &&
            coordinateConverted.longitude &&
            coordinateConverted.distance <= distance
          ) {
            new mapboxgl.Marker()
              .setLngLat([
                coordinateConverted.latitude,
                coordinateConverted.longitude,
              ])
              .setPopup(popup)
              .addTo(map);
          } else {
            console.log("NO LAT/LONG FIELDS FOUND");
          }
        } catch (error) {
          console.error("Error creating marker:", error);
        }
      });

      // Remove the map when the component is unmounted
      return () => map.remove();
    });
  }, [allListings]);

  // using mock data:
  // useEffect(() => {
  //   mapboxgl.accessToken = ACCESS_TOKEN;
  //   const map = new mapboxgl.Map({
  //     container: "mapbox",
  //     style: "mapbox://styles/mapbox/streets-v11",
  //     center: [-71.057083, 42.361145],
  //     zoom: 12,
  //   });

  //   mockListingInfo.forEach((listing) => {
  //     const popupContent = `
  //     <div>
  //       <h3>${listing.address}</h3>
  //       <p>Date Posted: ${listing.datePosted}</p>
  //       <a href="/info/${listing.id}">See More</a>
  //     </div>`;
  //     const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);

  //     new mapboxgl.Marker()
  //       .setLngLat([listing.latlong[1], listing.latlong[0]])
  //       .setPopup(popup) // Move setPopup here, remove the misplaced semicolon
  //       .addTo(map);
  //   });

  //   return () => map.remove();
  // }, [mockListingInfo])

  // call server backend to get distance between selected address and student's work address
  async function getDistance(selectedAddress: string): Promise<Coordinate> {
    try {
      const response = await fetch(
        "http://localhost:4500/filter?address=" +
          selectedAddress +
          "&workAddress=" +
          props.studentAddress
      );
      const result = await response.json();
      console.log("API: ", selectedAddress, props.studentAddress, result);

      if (
        result.converted_selected_latitude &&
        result.converted_selected_longitude &&
        result.distance
      ) {
        return {
          latitude: result.converted_selected_latitude,
          longitude: result.converted_selected_longitude,
          distance: parseFloat(result.distance),
        };
      } else {
        throw new Error(
          "Could not find distance between selected address and student's work address"
        ); // throw?
      }
    } catch (error) {
      console.error("Error fetching distance: ", error);
      throw error; // throw?
    }
  }

  return !props.userLoggedIn ? (
    <h2> Please log in. </h2>
  ) : !props.studentEmail ? (
    <h2>
      Only students can have acess to this page. Please log in as a student.
    </h2>
  ) : (
    <div>
      <div id="listings-page">
        <div id="mapbox" className="map"></div>
        <div className="row">
          {allListings.map((listing) => (
            <div key={listing.id} className="listing-info">
              <Link to={`/info/${listing.id}`}>
                <img src={listing.imgUrl} alt={`Listing for ${listing.id}`} />
              </Link>
              <p>Address: {listing.address}</p>
              {/* <p>Date Posted: {listing.datePosted}</p> */}
            </div>
          ))}
        </div>

        {/* SideBar */}
        <div className="sidenav">
          <label>Distance</label>
          <Box
            className="slider"
            sx={{ width: 250, margin: "10px 0", color: "grey" }}
          >
            <Slider
              aria-label="Distance"
              defaultValue={30}
              value={distance}
              getAriaValueText={valuetext}
              valueLabelDisplay="auto"
              step={10}
              marks
              min={10}
              max={100}
              onChange={(event, newValue) => setDistance(newValue as number)}
            />
          </Box>
        </div>
      </div>
    </div>
  );
}
