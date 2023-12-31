import { useEffect, useState } from "react";
import { Dispatch, SetStateAction } from "react";
import "../styles/Listings.css";
import { Link } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import { ACCESS_TOKEN } from "../private/MapboxToken.tsx";
import "mapbox-gl/dist/mapbox-gl.css";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

/**
 * ListingsPage Component
 *
 * This component displays a list of available housing listings
 * on a map and in a side-by-side view. Users can filter listings
 * by distance and price using sliders.
 */

// Function to display the value for the distance and price sliders
function valuetext(value: number) {
  return `${value} miles`;
}

// Interface defining the structure of a housing listing
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
// Interface defining the properties for the ListingsPage component
interface ListingPageProps {
  db: firebase.firestore.Firestore;
  studentAddress: string;
  userLoggedIn: boolean;
  studentEmail: string;
  allListings: Listing[];
  setAllListings: Dispatch<SetStateAction<Listing[]>>;
}

//Interface defining the structure of a landlord
interface Landlord {
  listings: Listing[];
} 

// Interface defining the structure of geographical coords
interface Coordinate {
  latitude?: number;
  longitude?: number;
  distance?: number;
  duration?: number;
  error?: string;
  status?: string;
}

export default function ListingsPage(props: ListingPageProps) {
  const [distance, setDistance] = useState<number>(2); // Initial distance value
  const [price, setPrice] = useState<number>(1000); // Initial distance value

  // Fetch and update listings when the component mounts
  useEffect(() => {
    if (!props.studentEmail || !props.userLoggedIn) {
      return;
    }

    const fetchListings = async () => {
      try {
        const landlordSnapshot = await props.db.collection("landlords").get();

        const allListingsArray: Listing[] = [];

        const fetchDistancePromises = landlordSnapshot.docs.map(
          async (landlordDoc) => {
            const landlordData = landlordDoc.data() as Landlord;
            const landlordListings = landlordData.listings || [];

            const listingsWithDistance = await Promise.all(
              landlordListings.map(async (listing) => {
                try {
                  const coordinateConverted = await getDistance(
                    listing.address
                  );
                  if (
                    coordinateConverted.latitude &&
                    coordinateConverted.longitude
                  ) {
                    return {
                      ...listing,
                      latitude: coordinateConverted.latitude,
                      longitude: coordinateConverted.longitude,
                      distance: coordinateConverted.distance,
                      duration: coordinateConverted.duration,
                    };
                  } else {
                    console.log("NO LAT/LONG FIELDS FOUND: ", listing);
                    return listing; // Keep the original listing if no valid coordinates are found
                  }
                } catch (error) {
                  console.error("Error getting distance for listing:", error);
                  return listing; // Keep the original listing in case of an error
                }
              })
            );

            allListingsArray.push(...listingsWithDistance);
          }
        );

        await Promise.all(fetchDistancePromises);

        props.setAllListings(allListingsArray);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, [props.userLoggedIn]);

  console.log("ALL LISTINGS: ", props.allListings);

  const mockListingInfo = [
    {
      id: 1,
      address: "170 TREMONT ST STE 1 BOSTON MA",
      lat: 42.353656699999995,
      long: -71.06385039999999,
      datePosted: "May 5, 2023",
      distance: 1.1,
      imgUrl:
        "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L2pvYjcyMC0xMTMtdi5qcGc.jpg",
    },
    {
      id: 2,
      address: "98 SALEM ST BOSTON MA",
      lat: 42.36402799999999,
      long: -71.055697,
      datePosted: "September 5, 2023",
      distance: 0.7,
      imgUrl:
        "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA4L2pvYjk1MC0xMDctdi5qcGc.jpg",
    },
    {
      id: 3,
      address: "196 Sparks Ave Pelham NY",
      lat: 40.908732400000005,
      long: -73.8118781,
      datePosted: "January 5, 2023",
      distance: 195.4,
      imgUrl:
        "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L2pvYjcxNy0wNTItdi5qcGc.jpg",
    },
  ];

  useEffect(() => {
    if (!props.studentEmail || !props.userLoggedIn) {
      return;
    }
    mapboxgl.accessToken = ACCESS_TOKEN;
    const map = new mapboxgl.Map({
      container: "mapbox",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-71.057083, 42.361145],
      zoom: 12,
    });
    // Event listener when the map loads
    map.on("load", () => {
      props.allListings.forEach((listing) => {
        if (
          listing.latitude &&
          listing.longitude &&
          listing.distance &&
          listing.distance <= distance &&
          listing.price &&
          listing.price <= price
        ) {
          // const linkElement = (
          //   <Link to={`/info/${listing.id}`}>See More here</Link>
          // );

          const popupContent = `
        <div>
             <h3>${listing.address}</h3>
             <p> ${listing.title} </p>
             <p> ${listing.distance} mi from your work </p>
             <p> ${listing.duration} mins commute </p> 
             <a href="/info/${listing.id}">See More</a>
        </div>`;
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
            popupContent
          );

          new mapboxgl.Marker()
            .setLngLat([listing.longitude, listing.latitude])
            .setPopup(popup) // Move setPopup here, remove the misplaced semicolon
            .addTo(map);
        }
      });

      return () => map.remove();
    });
  }, [distance, price]);

  // Call server backend to get distance between selected address and student's work address
  async function getDistance(selectedAddress: string): Promise<Coordinate> {
    try {
      const response = await fetch(
        "http://localhost:4500/filter?address=" +
          selectedAddress +
          "&workAddress=" +
          props.studentAddress
      );
      const result = await response.json();
      // console.log("API: ", selectedAddress, props.studentAddress, result);

      if (
        result.converted_selected_latitude &&
        result.converted_selected_longitude &&
        result.distance
      ) {
        return {
          latitude: result.converted_selected_latitude,
          longitude: result.converted_selected_longitude,
          distance: parseFloat(result.distance),
          duration: parseFloat(result.duration),
        };
      } else {
        return {
          error: result.error,
          status: result.status, 
        };
      }
    } catch (error) {
      console.error("Error fetching distance: ", error);
      throw error; // throw?
    } 
  }

  return !props.userLoggedIn ? (
    <h2 className="not-logged-in"> Please log in. </h2>
  ) : !props.studentEmail ? (
    <h2>
      Only students can have acess to this page. Please log in as a student.
    </h2>
  ) : (
    <div>
      <div id="listings-page">
        <div id="mapbox" className="map"></div>
        <div className="row">
          {props.allListings.map((listing) =>
            listing.distance && listing.price ? (
              listing.distance <= distance && listing.price <= price ? (
                <div key={listing.id} className="listing-info">
                  <Link to={`/info/${listing.id}`}>
                    <div
                      className="listing-image-container"
                      onClick={() =>
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        })
                      }
                    >
                      <img
                        src={listing.imgUrl}
                        alt={`Listing for ${listing.id}`}
                      />
                    </div>
                  </Link>
                  <p>
                    <b>Address: </b>
                    {listing.address}
                  </p>
                  <p>
                    <b>Date Posted: </b>
                    {listing.datePosted}
                  </p>
                  <p>
                    <b>Price:</b> ${listing.price}
                  </p>
                  <p>
                    <b>Distance from your work:</b> {listing.distance} mi
                  </p>
                </div>
              ) : null
            ) : null
          )}
        </div>

        {/* SideBar */}
        <div className="sidenav">
          <div className="distance-slider">
            <label>Distance: {distance} mi</label>
            <Box
              className="slider"
              sx={{
                width: "90%",
                margin: "6% 0",
                color: "grey",
                marginLeft: "4%",
              }}
            >
              <Slider
                aria-label="Distance"
                value={distance}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                step={0.5}
                marks
                min={0}
                max={9}
                onChange={(event, newValue) => setDistance(newValue as number)}
              />
            </Box>
          </div>
          <div className="price-slider">
            <label>Price: ${price}</label>
            <Box
              className="slider"
              sx={{
                width: "90%",
                margin: "6% 0",
                color: "grey",
                marginLeft: "4%",
              }}
            >
              <Slider
                aria-label="Price"
                value={price}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                step={100}
                marks
                min={0}
                max={3500}
                onChange={(event, newValue) => setPrice(newValue as number)}
              />
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
}
