import React from "react";
import "../styles/LoginPage.css";
import "../styles/RegistrationForm.css";
import { useNavigate } from "react-router-dom";

import firebase from "firebase/compat/app";
import { Dispatch, SetStateAction } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// import { GoogleAuthProvider } from "firebase/auth";

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
  userLoggedIn: boolean;
  setUserLoggedIn: Dispatch<SetStateAction<boolean>>;
  setAdminName: Dispatch<SetStateAction<string>>;
}

export default function LoginPage(props: LoginProps) {
  const navigate = useNavigate();

  async function handleAdminLogin(event: React.FormEvent, props) {
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
      try {
        const adminGmail = await handleGoogleSignIn();
        if (adminGmail != null) {
          if (adminGmail == props.adminEmail) {
            props.setUserLoggedIn(true);
            props.setAdminName(querySnapshot.docs[0].data().name);
            navigate("/admin");
          } else {
            props.setAdminError(
              "Please be sure your email matches the one selected on Google Login."
            );
          }
        } else {
          props.setAdminError("Login with Google was unsuccessful.");
        }
      } catch (error) {
        props.setAdminError("An error occurred during Google sign-in.");
        console.error("Error in handleGoogleSignIn:", error);
      }
    } else {
      props.setAdminError("Invalid credentials.");
    }
  }

  async function handleGoogleSignIn() {
    try {
      const data = await signInWithPopup(auth, provider);
      return data.user.email;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      return null;
    }
  }

  const provider = new GoogleAuthProvider();

  const auth = getAuth();

  return props.userLoggedIn ? (
    <h2> You are already logged in!</h2>
  ) : (
    <div className="login-page">
      <p>Fill out the correct login form based on your needs</p>
      <div className="login-forms">
        <form
          className="login-form"
          aria-label="You can login as a student here"
        >
          <h2>Intern</h2>
          <label></label>
          <div id="login-form">
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
          </div>

          <h3> {props.error} </h3>
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
          className="landlord-login-form"
          aria-label="You can login as a landlord here"
        >
          <h2> Landlord </h2>
          <label></label>
          <div id="login-form">
            <input
              className="landlord-email"
              aria-label="You can enter your email here (Must be a Google account)"
              placeholder="Enter email here"
              value={props.landlordEmail}
              onChange={(ev) => props.setLandlordEmail(ev.target.value)}
            ></input>
            <input
              className="landlord-password"
              aria-label="You can enter your password here"
              placeholder="Enter password here"
              type="password"
              value={props.landlordPass}
              onChange={(ev) => props.setLandlordPass(ev.target.value)}
            ></input>
          </div>

          <h3> {props.landlordError} </h3>
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
              props.setLandlordEmail("tessa@gmail.com");
              props.setLandlordPass("strongPassword");
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
          <div id="login-form">
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
          </div>

          <h3> {props.adminError} </h3>
          <button
            className="admin-login-button"
            onClick={(ev) => handleAdminLogin(ev, props)}
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

  async function checkRecordsforIntern(event: React.FormEvent, props) {
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
      try {
        const studentGmail = await handleGoogleSignIn();
        if (studentGmail != null) {
          if (studentGmail == props.studentEmail) {
            props.setStudentAddress(querySnapshot.docs[0].data().address);
            props.setStudentName(querySnapshot.docs[0].data().name);
            props.setUserLoggedIn(true);
            navigate("/listings");
          } else {
            props.setError(
              "Please be sure your email matches the one selected during Google Login."
            );
          }
        } else {
          props.setError("Login with Google was unsuccessful.");
        }
      } catch (error) {
        props.setError("An error occurred during Google sign-in.");
        console.error("Error in handleGoogleSignIn:", error);
      }
    } else {
      // wrong user or password
      props.setError("Invalid login credentials.");
    }
  }

  async function checkRecordsforLandlord(event: React.FormEvent, props) {
    event.preventDefault();
    const querySnapshot = await props.db
      .collection("landlords")
      .where("email", "==", props.landlordEmail)
      .get();
    if (!props.landlordEmail || !props.landlordPass) {
      props.setLandlordError("Please be sure to input all fields.");
    } else if (querySnapshot.empty) {
      props.setLandlordError("This landlord does not exist in our database.");
    } else if (querySnapshot.docs[0].data().verified == "false") {
      props.setLandlordError(
        "This landlord is not yet verified in our database."
      );
    } else if (props.landlordPass === querySnapshot.docs[0].data().password) {
      // allow successful login
      try {
        const landlordGmail = await handleGoogleSignIn();
        if (landlordGmail != null) {
          if (landlordGmail == props.landlordEmail) {
            props.setLandlordName(querySnapshot.docs[0].data().name);
            props.setLandlordPhone(querySnapshot.docs[0].data().phone);
            props.setUserLoggedIn(true);
            navigate("/LandLordsHomepage");
          } else {
            props.setLandlordError(
              "Please be sure your email matches the one selected on Google Login."
            );
          }
        } else {
          props.setLandlordError("Login with Google was unsuccessful.");
        }
      } catch (error) {
        props.setLandlordError("An error occurred during Google sign-in.");
        console.error("Error in handleGoogleSignIn:", error);
      }
    } else {
      // wrong user or password
      props.setLandlordError("Invalid login credentials.");
    }
  }
}
