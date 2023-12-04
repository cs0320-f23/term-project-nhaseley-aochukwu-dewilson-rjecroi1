import "../styles/RegistrationForm.css";
import firebase from "firebase/compat/app";
import { useEffect, useState } from "react";

interface AdminProps {
  db: firebase.firestore.Firestore;
}

interface User {
  name: string;
  email: string;
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
            // not adding password
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
  return (
    <div className="admin-page">
      this is the admin page!
      <div className="all-interns">
        {interns.map((intern) => (
          <div key={intern.name}>
            <strong>Name:</strong> {intern.name}, <strong>Email:</strong>
            {intern.email}
          </div>
        ))}
      </div>
      <div className="all-landlords">
        {landlords.map((landlord) => (
          <div key={landlord.name}>
            <strong>Name:</strong> {landlord.name}, <strong>Email:</strong>
            {landlord.email}
          </div>
        ))}
      </div>
      <div className="all-admins">
        {admins.map((admin) => (
          <div key={admin.name}>
            <strong>Name:</strong> {admin.name}, <strong>Email:</strong>
            {admin.email}
          </div>
        ))}
      </div>
    </div>
  );
}
