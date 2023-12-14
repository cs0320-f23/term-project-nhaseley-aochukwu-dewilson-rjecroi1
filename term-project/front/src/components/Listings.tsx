import { useEffect, useState } from "react";
import "../styles/Listings.css";
import { Link } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import { ACCESS_TOKEN } from "../private/MapboxToken.tsx";
import "mapbox-gl/dist/mapbox-gl.css";
import Box from "@mui/material/Box";
import firebase from "firebase/compat/app";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

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
  latitude?: number;
  longitude?: number;
  distance?: number;
}
interface Coordinate {
  latitude?: number;
  longitude?: number;
  distance?: number;
  error?: string;
  status?: string;
}

export default function ListingsPage(props: ListingPageProps) {
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [distance, setDistance] = useState<number>(8); // Initial distance value
  const [price, setPrice] = useState<number>(1000); // Initial distance value
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

        setAllListings(allListingsArray);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, [props.db, props.studentEmail, props.userLoggedIn, distance]);

  console.log("ALL LISTINGS: ", allListings);

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

  const [mapInitialized, setMapInitialized] = useState(false);
  const [sliderValue, setSliderValue] = useState(30);
  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };

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
    map.on("load", () => {
      allListings.forEach((listing) => {
        if (
          listing.latitude &&
          listing.longitude &&
          listing.distance &&
          listing.distance <= distance
        ) {
          const popupContent = `
        <div>
             <h3>${listing.address}</h3>
              <p> ${listing.title} </p>
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
  }, []);

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
          {allListings.map((listing) =>
            listing.distance && listing.price ? (
              listing.distance <= distance && parseFloat(listing.price) <= price ? (
                <div key={listing.id} className="listing-info">
                  <Link to={`/info/${listing.id}`}>
                    <img
                      src={listing.imgUrl}
                      alt={`Listing for ${listing.id}`}
                    />
                  </Link> 
                  <p>Address: {listing.address}</p>
                  {/* <p>Date Posted: {listing.datePosted}</p> */}
                </div>
              ) : null
            ) : null
          )}
        </div>

        {/* SideBar */}
        <div className="sidenav">
          <div className="distance-slider">
            <label>Distance</label>
            <Box
              className="slider"
              sx={{ width: 250, margin: "10px 0", color: "grey" }}
            >
              <Slider
                aria-label="Distance"
                value={distance}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                step={3}
                marks
                min={0}
                max={20}
                onChange={(event, newValue) => setDistance(newValue as number)}
              />
            </Box>
          </div>
          <div className="price-slider">
            <label>Price</label>
            <Box
              className="slider"
              sx={{ width: 250, margin: "10px 0", color: "grey" }}
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
