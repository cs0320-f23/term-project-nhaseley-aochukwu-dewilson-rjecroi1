import React from "react";
import "../styles/LoginPage.css";
import "../styles/RegistrationForm.css";
import { GoogleAuth, GoogleUser } from "gapi.auth2";
import { useNavigate } from "react-router-dom";

import firebase from "firebase/compat/app";
import { Dispatch, SetStateAction } from "react";

interface LoginProps {
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
  adminEmail: string;
  setAdminEmail: Dispatch<SetStateAction<string>>;
  adminPass: string;
  setAdminPass: Dispatch<SetStateAction<string>>;
  adminError: string;
  setAdminError: Dispatch<SetStateAction<string>>;
}

export default function LoginPage(props: LoginProps) {
  const navigate = useNavigate();

  async function handleAdminLogin(event: React.FormEvent) {
    event.preventDefault(); // prevents page from re-rendering
    // check if user with this email already in db

    const querySnapshot = await props.db
      .collection("admins")
      .where("email", "==", props.adminEmail)
      .get();
    if (!props.adminEmail || !props.adminPass) {
      // missing input
      props.setAdminError("Please be sure to input all fields.");
    } else if (querySnapshot.empty) {
      props.setAdminError("This admin email does not exist in database.");
    } else if (props.adminPass === querySnapshot.docs[0].data().password) {
      // login successfully
      navigate("/admin");
    } else {
      props.setAdminError("Invalid credentials.");
    }
  }

  function handleGoogleSignIn() {
    return new Promise((resolve, reject) => {
      gapi.load("auth2", () => {
        gapi.auth2
          .init({
            client_id: "Y642860876099-0tmtpntka1f3jhl7nro5e0nnsbi7th2s", // client ID from Google cloud
            scope: "profile email", // specify the scopes you need. what does this mean
          })
          .then(() => {
            const authInstance = gapi.auth2.getAuthInstance();
            resolve(authInstance);
          })
          .catch((error: any) => {
            reject(error);
          });
      });
    });
  }
  return (
    <div className="login-page">
      <h2>This is the login form!</h2>
      <div className="login-forms">
        <form
          className="login-form"
          aria-label="You can login as a student here"
        >
          <h2>Intern</h2>
          <label></label>
          <input
            className="student-email"
            aria-label="You can enter your email here (must be Brown)"
            placeholder="Enter Brown email here"
            value={props.studentEmail}
            onChange={(ev) => props.setStudentEmail(ev.target.value)}
          ></input>
          <input
            className="student-password"
            aria-label="You can enter your password here"
            placeholder="Enter password here"
            type="password"
            value={props.studentPass}
            onChange={(ev) => props.setStudentPass(ev.target.value)}
          ></input>

          <button
            type="submit"
            id="intern-submit"
            onClick={(ev) => checkRecordsforIntern(ev, props)}
          >
            Login
          </button>
          <button
            className="demo-student-login"
            onClick={(ev) => {
              ev.preventDefault();
              props.setStudentEmail("nya_haseley-ayende@brown.edu");
              props.setStudentPass("password");
            }}
          >
            Demo Login
          </button>
        </form>

        <form
          className="renter-login-form"
          aria-label="You can login as a renter here"
        >
          <h2> Renter </h2>
          <label></label>
          <input
            className="renter-email"
            aria-label="You can enter your email here"
            placeholder="Enter email here"
            value={props.renterEmail}
            onChange={(ev) => props.setRenterEmail(ev.target.value)}
          ></input>
          <input
            className="renter-password"
            aria-label="You can enter your password here"
            placeholder="Enter password here"
            type="password"
            value={props.renterPass}
            onChange={(ev) => props.setRenterPass(ev.target.value)}
          ></input>
          <button
            type="submit"
            id="landlord-submit"
            onClick={(ev) => checkRecordsforLandlord(ev, props)}
          >
            Login
          </button>
          <button
            className="demo-landlord-login"
            onClick={(ev) => {
              ev.preventDefault();
              props.setRenterEmail("john@gmail.com");
              props.setRenterPass("password");
            }}
          >
            Demo Login
          </button>
        </form>

        <form
          className="admin-login-form"
          aria-label="You can login as an admin here"
        >
          <h2> Admin </h2>
          <label></label>
          <input
            className="admin-email"
            aria-label="You can enter your email here (must be Brown)"
            placeholder="Enter email here"
            value={props.adminEmail}
            onChange={(ev) => props.setAdminEmail(ev.target.value)}
          ></input>
          <input
            className="admin-password"
            aria-label="You can enter your password here"
            placeholder="Enter password here"
            type="password"
            value={props.adminPass}
            onChange={(ev) => props.setAdminPass(ev.target.value)}
          ></input>
          <button
            className="admin-login-button"
            onClick={(ev) => handleAdminLogin(ev)}
          >
            Login
          </button>
          <button
            className="demo-admin-login"
            onClick={(ev) => {
              ev.preventDefault();
              props.setAdminEmail("nya_haseley-ayende@brown.edu");
              props.setAdminPass("password");
            }}
          >
            Demo Login
          </button>
        </form>
      </div>
    </div>
  );

  async function checkRecordsforIntern(
    event: React.FormEvent,
    props: LoginProps
  ) {
    event.preventDefault();

    const querySnapshot = await props.db
      .collection("interns")
      .where("email", "==", props.studentEmail)
      .get();
    if (!props.studentEmail || !props.studentPass) {
      props.setError("Please be sure to input all fields.");
    } else if (querySnapshot.empty) {
      props.setError("This intern does not exist in our database.");
    } else if (props.studentPass === querySnapshot.docs[0].data().password) {
      // allow successful login
      handleGoogleSignIn();
      // navigate("/listings");
    } else {
      // wrong user or password
      props.setError("Invalid login credentials.");
    }
  }

  async function checkRecordsforLandlord(
    event: React.FormEvent,
    props: LoginProps
  ) {
    event.preventDefault();

    // which is correct?
    const querySnapshot = await props.db
      .collection("renters")
      .where("email", "==", props.adminEmail)
      .get();
    if (!props.renterEmail || !props.renterPass) {
      props.setError("Please be sure to input all fields.");
    } else if (querySnapshot.empty) {
      props.setError("This renter does not exist in our database.");
    } // FIGURE OUT LANDLORD VERIFICATION
    else if ("false" === querySnapshot.docs[0].data().verified) {
      props.setError("This landlord is not verified in our database.");
    } else if (props.renterPass === querySnapshot.docs[0].data().password) {
      // allow successful login
      navigate("/LandLordsHomepage");
    } else {
      // wrong user or password
      props.setError("Invalid login credentials.");
    }
    // old shit

    // which is correct?
    const emailExists = await props.db
      .collection("renters")
      .where("email", "==", props.renterEmail)
      .get()
      .then((querySnapshot) => !querySnapshot.empty);

    const passwordRight = await props.db
      .collection("renters")
      .where("email", "==", props.renterEmail)
      .where("password", "==", props.renterPass)
      .get()
      .then((querySnapshot) => !querySnapshot.empty);

    // is this actually getting the user's input and comparing it to the password in the system for the email?
    if (!passwordRight) {
      props.setError("Please enter correct password.");
    } else if (!props.renterEmail || !props.renterPass) {
      props.setError("Please be sure to input all fields.");
    } //else if (props.adminPass === querySnapshot.docs[0].data().password)
  }
}

// handleGoogleSignIn()
//   .then((authInstance: any) => {
//     // Authentication successful, you can now use `authInstance` for further actions
//     console.log("Authentication successful");
//   })
//   .catch((error: any) => {
//     // Handle initialization/authentication errors
//     console.error("Error initializing Google Sign-In:", error);
//   });

// Event listener for the login button
// const loginButton = document.getElementById(
//   "intern-submit"
// ) as HTMLButtonElement; // Replace 'yourLoginButtonId' with your actual button ID
// if (loginButton) {
//   loginButton.addEventListener("click", () => {
//     handleGoogleSignIn();
//   });
// }
