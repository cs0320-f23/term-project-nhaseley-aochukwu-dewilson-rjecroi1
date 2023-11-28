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
  renterName: string;
  setRenterName: Dispatch<SetStateAction<string>>;
  renterEmail: string;
  setRenterEmail: Dispatch<SetStateAction<string>>;
  renterPass: string;
  setRenterPass: Dispatch<SetStateAction<string>>;
  renterPhone: string;
  setRenterPhone: Dispatch<SetStateAction<string>>;
  renterError: string;
  setRenterError: Dispatch<SetStateAction<string>>;
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

  async function handleRenterRegistration(event: React.FormEvent) {
    event.preventDefault(); // prevents page from re-rendering

    // check if user with this email already in db
    const emailExists = await props.db
      .collection("renters")
      .where("email", "==", props.renterEmail)
      .get()
      .then((querySnapshot) => !querySnapshot.empty);

    if (emailExists) {
      props.setError("User with this email already exists.");
    } else if (
      !props.renterName ||
      !props.renterEmail ||
      !props.renterPass ||
      !props.renterPhone
    ) {
      // missing input
      props.setRenterError("Please be sure to input all fields.");
    } else {
      // register successfully
      props.db
        .collection("renters")
        .add({
          name: props.renterName,
          email: props.renterEmail,
          password: props.renterPass,
          phone: props.renterPhone,
        })
        .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
        props.setRenterPhone("")
        props.setRenterEmail("")
        props.setRenterPass("")
        props.setRenterName("")
        props.setRenterError("")
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
              props.setStudentAddress("sci li coords");
              props.setStudentEmail("nya_haseley-ayende@brown.edu");
              props.setStudentPass("password");
            }}
          >
            Demo Registration
          </button>
        </form>

        <form
          className="renter-registration-form"
          aria-label="You can registration as a renter here"
        >
          <h2>Renter </h2>
          <label></label>
          <input
            className="renter-name"
            aria-label="You can enter your name here"
            placeholder="Enter your name here"
            value={props.renterName}
            onChange={(ev) => props.setRenterName(ev.target.value)}

          ></input>
          <input
            className="renter-email"
            aria-label="You can enter your email here"
            placeholder="Enter your email here"
            value={props.renterEmail}
            onChange={(ev) => props.setRenterEmail(ev.target.value)}
          ></input>
          <input
            className="renter-password"
            aria-label="You can enter your password here"
            placeholder="Enter your password here"
            value={props.renterPass}
            onChange={(ev) => props.setRenterPass(ev.target.value)}
          ></input>
          <input
            className="renter-phone"
            aria-label="You can enter your phone number here"
            placeholder="Enter your phone number here"
            value={props.renterPhone}
            onChange={(ev) => props.setRenterPhone(ev.target.value)}
          ></input>
          <h3> {props.renterError} </h3>
          <button
            className="renter-register-button"
            onClick={(ev) => handleRenterRegistration(ev)}
          >
            Register
          </button>
          <button
            className="demo-renter-registration"
            onClick={(ev) => {
              ev.preventDefault();
              props.setRenterName("jamari");
              props.setRenterPhone("123456789");
              props.setRenterEmail("john@gmail.com");
              props.setRenterPass("password");
            }}
          >
            Demo Registration
          </button>
        </form>
      </div>
    </div>
  );
}
