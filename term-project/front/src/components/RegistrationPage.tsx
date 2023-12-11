import { Dispatch, SetStateAction } from "react";
import "../styles/RegistrationForm.css";
import firebase from "firebase/compat/app";

interface RegistrationProps {
  studentName: string;
  setStudentName: Dispatch<SetStateAction<string>>;
  
  studentEmail: string;
  setStudentEmail: Dispatch<SetStateAction<string>>;
  studentPass: string;
  setStudentPass: Dispatch<SetStateAction<string>>;
  studentAddress: string; // work addr coordinates
  setStudentAddress: Dispatch<SetStateAction<string>>;
  db: firebase.firestore.Firestore;
  error: string;
  setError: Dispatch<SetStateAction<string>>;
  landlordName: string;
  setLandlordName: Dispatch<SetStateAction<string>>;
  landlordEmail: string;
  setLandlordEmail: Dispatch<SetStateAction<string>>;
  landlordPass: string;
  setLandlordPass: Dispatch<SetStateAction<string>>;
  landlordPhone: string;
  setLandlordPhone: Dispatch<SetStateAction<string>>;
  landlordError: string;
  setLandlordError: Dispatch<SetStateAction<string>>;
  adminEmail: string;
  setAdminEmail: Dispatch<SetStateAction<string>>;
  adminPass: string;
  setAdminPass: Dispatch<SetStateAction<string>>;
  adminError: string;
  setAdminError: Dispatch<SetStateAction<string>>;
  adminName: string;
  setAdminName: Dispatch<SetStateAction<string>>;
}

export default function RegistrationPage(props: RegistrationProps) {

  async function handleStudentRegistration(event: React.FormEvent) {
    event.preventDefault(); // prevents page from re-rendering

    // check if user with this email already in db
    const emailExists = await props.db
      .collection("interns")
      .where("email", "==", props.studentEmail)
      .get()
      .then((querySnapshot) => !querySnapshot.empty);

    if (emailExists) {
      props.setError("User with this email already exists.");
    } else if (
      !props.studentName ||
      !props.studentEmail ||
      !props.studentPass ||
      !props.studentAddress
    ) {
      // missing input
      props.setError("Please be sure to input all fields.");
    } else if (!props.studentEmail.includes("@brown.edu")){
      props.setError("You must provide your Brown email address.")
    } else {
      // register successfully
      props.db
        .collection("interns")
        .add({
          id: props.db.collection("interns").doc().id, 
          name: props.studentName,
          email: props.studentEmail,
          password: props.studentPass,
          address: props.studentAddress,
        })
        .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
        props.setStudentAddress("")
        props.setStudentEmail("")
        props.setStudentPass("")
        props.setStudentName("")
        props.setError("")
      }
  }

  async function handleLandlordRegistration(event: React.FormEvent) {
    event.preventDefault(); // prevents page from re-rendering
    // check if user with this email already in db
    const emailExists = await props.db
      .collection("landlords")
      .where("email", "==", props.landlordEmail)
      .get()
      .then((querySnapshot) => !querySnapshot.empty);

    if (emailExists) {
      props.setLandlordError("User with this email already exists.");
    } else if (
      !props.landlordName ||
      !props.landlordEmail ||
      !props.landlordPass ||
      !props.landlordPhone
    ) {
      // missing input
      props.setLandlordError("Please be sure to input all fields.");
    } else {
      // register successfully
      props.db
        .collection("landlords")
        .add({
          id: props.db.collection("landlords").doc().id, // add a unique id
          name: props.landlordName,
          email: props.landlordEmail,
          password: props.landlordPass,
          phone: props.landlordPhone,
          verified: false,
          listings: []
        })
        .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
        props.setLandlordPhone("")
        props.setLandlordEmail("")
        props.setLandlordPass("")
        props.setLandlordName("")
        props.setLandlordError("")
      }
  }
  async function handleAdminRegistration(event: React.FormEvent) {
    event.preventDefault(); // prevents page from re-rendering

    // check if user with this email already in db
    const emailExists = await props.db
      .collection("admins")
      .where("email", "==", props.adminEmail)
      .get()
      .then((querySnapshot) => !querySnapshot.empty);

    if (emailExists) {
      props.setAdminError("User with this email already exists.");
    } else if (
      !props.adminEmail ||
      !props.adminPass
    ) {
      // missing input
      props.setAdminError("Please be sure to input all fields.");
    } else {
      // register successfully
      props.db
        .collection("admins")
        .add({
          id: props.db.collection("admins").doc().id, 
          name: props.adminName,
          email: props.adminEmail,
          password: props.adminPass,
        })
        .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
        props.setAdminName("")
        props.setAdminEmail("")
        props.setAdminPass("")
        props.setAdminError("")
      }
  }

  return (
    <div className="registration-page">
      <h2> This is the registration form! </h2>
      <div className="registration-forms">
        <form
          className="student-registration-form"
          aria-label="You can registration as a student here"
        >
          <h2> Intern</h2>
          <label> Intern Registration </label>
          <input
            className="student-name"
            aria-label="You can enter your name here"
            placeholder="Enter your name here"
            value={props.studentName}
            onChange={(ev) => props.setStudentName(ev.target.value)}
          ></input>
          <input
            className="student-email"
            aria-label="You can enter your email here (must be Brown)"
            placeholder="Enter your Brown email here"
            value={props.studentEmail}
            onChange={(ev) => props.setStudentEmail(ev.target.value)}
          ></input>
          <input
            className="student-password"
            aria-label="You can enter your password here"
            placeholder="Enter your password here"
            value={props.studentPass}
            type="password"
            onChange={(ev) => props.setStudentPass(ev.target.value)}
          ></input>
          <input
            className="student-address"
            aria-label="You can enter your work address here"
            placeholder="Enter your Work Address here"
            value={props.studentAddress}
            onChange={(ev) => props.setStudentAddress(ev.target.value)}
          ></input>
          <h3> {props.error} </h3>
          <button
            className="student-register-button"
            onClick={(ev) => handleStudentRegistration(ev)}
          >
            Register
          </button>
          <button
            className="demo-student-registration"
            onClick={(ev) => {
              ev.preventDefault();
              props.setStudentName("nya");
              props.setStudentAddress("3155 Cedar Lane Boston MA");
              props.setStudentEmail("nya_haseley-ayende@brown.edu");
              props.setStudentPass("password");
            }}
          >
            Demo Registration
          </button>
        </form>

        <form
          className="landlord-registration-form"
          aria-label="You can registration as a landlord here"
        >
          <h2>Landlord </h2>
          <label>Landlord Registration </label>
          <input
            className="landlord-name"
            aria-label="You can enter your name here"
            placeholder="Enter your name here"
            value={props.landlordName}
            onChange={(ev) => props.setLandlordName(ev.target.value)}
          ></input>
          <input
            className="landlord-email"
            aria-label="You can enter your email here"
            placeholder="Enter your email here"
            value={props.landlordEmail}
            onChange={(ev) => props.setLandlordEmail(ev.target.value)}
          ></input>
          <input
            className="landlord-password"
            aria-label="You can enter your password here"
            placeholder="Enter your password here"
            value={props.landlordPass}
            type="password"
            onChange={(ev) => props.setLandlordPass(ev.target.value)}
          ></input>
          <input
            className="landlord-phone"
            aria-label="You can enter your phone number here"
            placeholder="Enter your phone number here"
            value={props.landlordPhone}
            onChange={(ev) => props.setLandlordPhone(ev.target.value)}
          ></input>
          <h3> {props.landlordError} </h3>
          <button
            className="landlord-register-button"
            onClick={(ev) => handleLandlordRegistration(ev)}
          >
            Register
          </button>
          <button
            className="demo-landlord-registration"
            onClick={(ev) => {
              ev.preventDefault();
              props.setLandlordName("jamari");
              props.setLandlordPhone("123456789");
              props.setLandlordEmail("john@gmail.com");
              props.setLandlordPass("password");
            }}
          >
            Demo Registration
          </button>
          <button
            className="demo-landlord-registration-for-listing-test"
            onClick={(ev) => {
              ev.preventDefault();
              props.setLandlordName("tessa");
              props.setLandlordPhone("98765432");
              props.setLandlordEmail("tessa@gmail.com");
              props.setLandlordPass("strongPassword");
            }}
          >
            Demo Registration #2
          </button>
        </form>

        <form
          className="admin-registration-form"
          aria-label="You can registration as an admin here"
        >
          <h2> Admin</h2>
          <label> Admin Registration </label>
          <input
            className="admin-name"
            aria-label="You can enter your name here"
            placeholder="Enter your name here"
            value={props.adminName}
            onChange={(ev) => props.setAdminName(ev.target.value)}
          ></input>
          <input
            className="admin-email"
            aria-label="You can enter your email here (must be Brown)"
            placeholder="Enter your Brown email here"
            value={props.adminEmail}
            onChange={(ev) => props.setAdminEmail(ev.target.value)}
          ></input>
          <input
            className="admin-password"
            aria-label="You can enter your password here"
            placeholder="Enter your password here"
            value={props.adminPass}
            type="password"
            onChange={(ev) => props.setAdminPass(ev.target.value)}
          ></input>

          <h3> {props.adminError} </h3>
          <button
            className="admin-register-button"
            onClick={(ev) => handleAdminRegistration(ev)}
          >
            Register
          </button>
          <button
            className="demo-admin-registration"
            onClick={(ev) => {
              ev.preventDefault();
              props.setAdminName("Nya");
              props.setAdminEmail("nya_haseley-ayende@brown.edu");
              props.setAdminPass("password");
            }}
          >
            Demo Registration
          </button>
        </form>
      </div>
    </div>
  );
}
