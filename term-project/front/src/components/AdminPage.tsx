import "../styles/RegistrationForm.css";
import "../styles/AdminPage.css";
import firebase from "firebase/compat/app";
import { useEffect, useState } from "react";

/**
 * Admin Compenents
 *
 * This compenents allows an admin to verify landlords. Displays lists of
 * landlords and interns
 */

interface AdminProps {
  db: firebase.firestore.Firestore;
  userLoggedIn: boolean;
  adminEmail: string;
}

// Defines the structure of a user object
interface User {
  name: string;
  email: string;
  verified?: boolean;
  numListings?: number;
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
    <h2 className="not-logged-in">Please log in.</h2>
  ) : !props.adminEmail ? (
    <h2>Only admin can have access to this page. Please log in as an admin.</h2>
  ) : (
    <div className="admin-page">
      <div id="intern-user-list">
        <h2>Interns</h2>
        <div className="all-interns">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {interns.map((intern) => (
                <tr key={intern.email}>
                  <td>{intern.name}</td>
                  <td>{intern.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div id="landlord-user-list">
        <h2>Landlords</h2>
        <div className="all-landlords">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {landlords.map((landlord) => (
                <tr key={landlord.email}>
                  <td>{landlord.name}</td>
                  <td>{landlord.email}</td>
                  <td>{landlord.verified ? "Verified" : <button>Verify</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div id="admin-user-list">
        <h2>Administrators</h2>
        <div className="all-admins">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.email}>
                  <td>{admin.name}</td>
                  <td>{admin.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
