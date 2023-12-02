import "../styles/RegistrationForm.css";
import firebase from "firebase/compat/app";
import { useEffect } from "react";

interface AdminProps {
    db: firebase.firestore.Firestore;
}

export default function AdminPage(props: AdminProps) {
  
//    useEffect(() => {
//     readUsersFromDB()
//   }, []);

  async function readUsersFromDB() {
    props.db
      .collection("interns")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(
            `${doc.id} => ${doc.data().email}}`
          );
        });
      });

    props.db
      .collection("landlords")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(
            `${doc.id} => ${doc.data().email}}`
          );
        });
      });

    
  }
  return <div> this is the admin page!</div>;
}
