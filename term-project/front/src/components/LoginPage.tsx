import React from "react";
import "../styles/LoginPage.css";
import "../styles/RegistrationForm.css";
import { GoogleAuth, GoogleUser } from "gapi.auth2";
import RegistrationProps, { RegistrationProps } from "./RegistrationPage";
import AdminPage from "./AdminPage"
import readUsersFromDB from "./AdminPage"

export default function LoginPage() {
  return (
    <div className="login-page">
      <h2>This is the login form!</h2>
      <div className="login-forms">
        <form
          className="login-form"
          aria-label="You can login as a student here"
        >
          <h2>Intern</h2>
          <label>
            <input
              className="student-email"
              aria-label="You can enter your email here (must be Brown)"
              placeholder="Enter Brown email here"
            />
          </label>
          <input
            className="student-password"
            aria-label="You can enter your password here"
            placeholder="Enter password here"
          />
          <button type="submit" id="intern-submit"
          onClick={(ev) => checkRecordsforLandlord(ev)
          }
          >
            Login
          </button>
        </form>

        <form
          className="renter-login-form"
          aria-label="You can login as a renter here"
        >
          <h2>Renter</h2>
          <label>
            <input
              className="renter-email"
              aria-label="You can enter your email here"
              placeholder="Enter email here"
            />
          </label>
          <label>
            <input
              className="renter-password"
              aria-label="You can enter your password here"
              placeholder="Enter password here"
            />
          </label>
          <button type="submit" id="landlord-submit"
          onClick={(ev) => checkRecordsforLandlord(ev)
          }
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

/**
 * can't use Registration Props unless I use "typeOf"
 */

async function checkRecordsforIntern(event: React.FormEvent, props: RegistrationProps){
  event.preventDefault();
  const emailExists = await props.db
      .collection("interns")
      .where("email", "==", props.studentEmail)
      .get()
      .then((querySnapshot) => !querySnapshot.empty);

      if (!emailExists) {
        props.setError("User with this email does not exist.");
      } else if(
        !props.studentEmail ||
        !props.studentPass ||
      ) {
        // missing input
      props.setError("Please be sure to input all fields.");
      } else if (!props.studentEmail.includes("@brown.edu")){
        props.setError("You must provide your Brown email address.")
      } else{
        // successful login
      }

      

  const passwordRight = await props.db


}


async function checkRecordsforLandlord(props: RegistrationProps){
  const emailExists = await props.db
      .collection("renters")
      .where("email", "==", props.studentEmail)
      .get()
      .then((querySnapshot) => !querySnapshot.empty);

      if (!emailExists) {
        props.setError("User with this email does not exist.");
      }




}

function handleGoogleSignIn() {
  return new Promise((resolve, reject) => {
    gapi.load("auth2", () => {
      gapi.auth2
        .init({
          client_id: "Y642860876099-0tmtpntka1f3jhl7nro5e0nnsbi7th2s", // Replace with your client ID
          scope: "profile email", // Specify the scopes you need
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

handleGoogleSignIn()
  .then((authInstance: any) => {
    // Authentication successful, you can now use `authInstance` for further actions
    console.log("Authentication successful");
  })
  .catch((error: any) => {
    // Handle initialization/authentication errors
    console.error("Error initializing Google Sign-In:", error);
  });

// Event listener for the login button
const loginButton = document.getElementById(
  "intern-submit"
) as HTMLButtonElement; // Replace 'yourLoginButtonId' with your actual button ID
if (loginButton) {
  loginButton.addEventListener("click", () => {
    handleGoogleSignIn();
  });
}
