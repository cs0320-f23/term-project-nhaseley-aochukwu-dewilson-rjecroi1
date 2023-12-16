import "../styles/AdminPage.css";
import firebase from "firebase/compat/app";
import { useEffect, useState } from "react";

interface AdminProps {
  db: firebase.firestore.Firestore;
  userLoggedIn: boolean;
  adminEmail: string;
}

interface User {
  name: string;
  email: string;
  verified?: boolean;
  numListings?: number;
}

export default function AdminPage(props: AdminProps) {
  const [interns, setInterns] = useState<User[]>([]);
  const [landlords, setLandlords] = useState<User[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);

  useEffect(() => {
    readUsersFromDB();
  }, []);

  async function readUsersFromDB() {
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
        location.reload();
      })
      .catch((error) => {
        console.error("Error updating email: ", error);
      });
  }
  return !props.userLoggedIn ? (
    <h2> Please log in. </h2>
  ) : !props.adminEmail ? (
    <h2>Only admin can have acess to this page. Please log in as an admin.</h2>
  ) : (
    <div className="admin-page">
      <div id="user-list">
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
      <div id="user-list">
        <h2>Landlords</h2>
        <div className="all-landlords">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {landlords.map((landlord) => (
                <tr key={landlord.email}>
                  <td>{landlord.name}</td>
                  <td>{landlord.email}</td>
                  <td>
                    {landlord.verified ? (
                      "Verified"
                    ) : (
                      <button
                        onClick={() => {
                          verifyLandlord(landlord.email);
                        }}
                      >
                        Verify
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div id="user-list">
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
