/**
 * Admin Compenents 
 * 
 * This compenents allows an admin to verify landlords. Displays lists of 
 * landlords and interns 
 */
import "../styles/RegistrationForm.css";
import firebase from "firebase/compat/app";
import { useEffect, useState } from "react";

interface AdminProps {
  db: firebase.firestore.Firestore;
  userLoggedIn: boolean;
  adminEmail: string;
}

//Defines the structure of a user object
interface User {
  name: string;
  email: string;
  verified?: boolean;
  numListings?:number;
}

// Defines the AdminPage component
export default function AdminPage(props: AdminProps) {
  // State variables to manage lists of interns, landlords, and admins
  const [interns, setInterns] = useState<User[]>([]);
  const [landlords, setLandlords] = useState<User[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);

  // Fetch user data from the database when the component mounts
  useEffect(() => {
    readUsersFromDB();
  }, []);

  // Function to read user data from the database
  async function readUsersFromDB() {
    // Reads interns data from Firestore and update state
    props.db
      .collection("interns")
      .get()
      .then((querySnapshot) => {
        const internsArray: User[] = [];
        querySnapshot.forEach((doc) => {
          const internData: User = {
            name: doc.data().name,
            email: doc.data().email,
            // not adding password
          };
          internsArray.push(internData);
        });

        setInterns(internsArray);
      });

    // Reads landlords data from Firestore and update state
    props.db
      .collection("landlords")
      .get()
      .then((querySnapshot) => {
        const landlordsArray: User[] = [];
        querySnapshot.forEach((doc) => {
          const landlordData: User = {
            name: doc.data().name,
            email: doc.data().email,
            verified: doc.data().verified,
            numListings: doc.data().listings.length,
          };
          landlordsArray.push(landlordData);
        });

        setLandlords(landlordsArray);
      });

    // Reads admins data from Firestore and update state
    props.db
      .collection("admins")
      .get()
      .then((querySnapshot) => {
        const adminsArray: User[] = [];
        querySnapshot.forEach((doc) => {
          const adminData: User = {
            name: doc.data().name,
            email: doc.data().email,
          };
          adminsArray.push(adminData);
        });

        setAdmins(adminsArray);
      });
  }

  // Function to verify a landlord by updating their verification status in the database
  function verifyLandlord(email: string) {
    const adminRef = props.db.collection("landlords");

    adminRef
      .where("email", "==", email)
      .get()
      .then((adminSnapshot) => {
        const updatePromises = adminSnapshot.docs.map(async (doc) => {
          await adminRef.doc(doc.id).update({
            verified: true,
          });
        });

        return Promise.all(updatePromises);
      })

      .then(() => {
        // Reload the page after updating the verification status
        location.reload();
      })
      .catch((error) => {
        console.error("Error updating email: ", error);
      });
  }
  // Render different UI based on user login status and admin access
  // Render the main UI for the admin page, displaying lists of interns, landlords, and admins
  return !props.userLoggedIn ? (
    <h2> Please log in. </h2>
  ) : !props.adminEmail ? (
    <h2>Only admin can have acess to this page. Please log in as an admin.</h2>
  ) : (
    <div className="admin-page">
      this is the admin page!
      <div className="all-interns">
        {interns.map((intern) => (
          <div key={intern.email}>
            <strong>Name:</strong> {intern.name}, <strong>Email:</strong>
            {intern.email}
          </div>
        ))}
      </div>
      <div className="all-landlords">
        {landlords.map((landlord) => (
          <div key={landlord.email}>
            <strong>Name:</strong> {landlord.name}, <strong>Email:</strong>
            {landlord.email}, <strong>Verification Status: </strong>{" "}
            {landlord.verified ? "Verified" : "Not Verified"}
            {landlord.verified !== true && (
              <button
                onClick={() => {
                  verifyLandlord(landlord.email);
                }}
              >
                Verify
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="all-admins">
        {admins.map((admin) => (
          <div key={admin.email}>
            <strong>Name:</strong> {admin.name}, <strong>Email:</strong>
            {admin.email}
          </div>
        ))}
      </div>
    </div>
  );
}
