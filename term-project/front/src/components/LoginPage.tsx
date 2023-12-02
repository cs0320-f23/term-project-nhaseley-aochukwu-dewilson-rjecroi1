import { Dispatch, SetStateAction } from "react";
import "../styles/RegistrationForm.css";
import { useNavigate } from "react-router-dom";

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

    const emailExists = await props.db
      .collection("admin")
      .where("email", "==", props.adminEmail)
      .get()
      .then((querySnapshot) => !querySnapshot.empty);

    if (emailExists) {
      // login successfully
      navigate("/admin");
    } else if (!props.adminEmail || !props.adminPass) {
      // missing input
      props.setAdminError("Please be sure to input all fields.");
    } else {
      props.setAdminError("Invalid credentials.");
    }
  }

  return (
    <div className="login-page">
      <h2> This is the login form! </h2>
      <div className="login-forms">
        <form
          className="login-form"
          aria-label="You can login as a student here"
        >
          <h2> Intern </h2>
          <label></label>
          <input
            className="student-email"
            aria-label="You can enter your email here (must be Brown)"
            placeholder="Enter Brown email here"
          ></input>
          <input
            className="student-password"
            aria-label="You can enter your password here"
            placeholder="Enter password here"
          ></input>
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
          ></input>
          <input
            className="renter-password"
            aria-label="You can enter your password here"
            placeholder="Enter password here"
          ></input>
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
            value={props.adminPass}
            onChange={(ev) => props.setAdminPass(ev.target.value)}
          ></input>
          <button
            className="admin-login-button"
            onClick={(ev) => handleAdminLogin(ev)}
          >
            Register
          </button>
          <button
            className="demo-admin-login"
            onClick={(ev) => {
              ev.preventDefault();
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
