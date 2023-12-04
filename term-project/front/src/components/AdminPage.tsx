import "../styles/RegistrationForm.css";
import firebase from "firebase/compat/app";
import { useEffect, useState } from "react";

interface AdminProps {
  db: firebase.firestore.Firestore;
}

interface User {
  name: string;
  email: string;
  verified?: boolean;
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
  console.log("landlords; ", landlords);

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
  return (
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
              <button onClick={() => {verifyLandlord(landlord.email);}
              }>
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
