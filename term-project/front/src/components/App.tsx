import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "../styles/App.css";
import "firebase/compat/firestore";
import firebase from "firebase/compat/app"; // Use 'compat' for compatibility mode
import Navbar from "./Navbar";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";
import RegistrationPage from "./RegistrationPage";
import ListingsPage from "./Listings";
import AdminPage from "./AdminPage";
import LandLordsHomePage from "./LandLordsHomepage";
import RentalInfoPage from "./RentalInfoPage";

const firebaseConfig = {
  apiKey: "AIzaSyB9n45pzHpWOXhKQeFxStBn2GJyJsPdXIE",
  authDomain: "fir-test-75302.firebaseapp.com",
  databaseURL: "https://fir-test-75302-default-rtdb.firebaseio.com",
  projectId: "fir-test-75302",
  storageBucket: "fir-test-75302.appspot.com",
  messagingSenderId: "854015278347",
  appId: "1:854015278347:web:a0bca5acbdf1da2326360e",
  measurementId: "G-911WFH5ZC5",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();

console.log("FIREBASE DATABASE: ", db);

function App() {
  const [studentName, setStudentName] = useState<string>("");
  const [studentEmail, setStudentEmail] = useState<string>("");
  const [studentPass, setStudentPass] = useState<string>("");
  const [studentAddress, setStudentAddress] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [landlordName, setLandlordName] = useState<string>("");
  const [landlordEmail, setLandlordEmail] = useState<string>("");
  const [landlordPass, setLandlordPass] = useState<string>("");
  const [landlordPhone, setLandlordPhone] = useState<string>("");
  const [landlordError, setLandlordError] = useState<string>("");
  const [adminEmail, setAdminEmail] = useState<string>("");
  const [adminPass, setAdminPass] = useState<string>("");
  const [adminError, setAdminError] = useState<string>("");
  const [adminName, setAdminName] = useState<string>("");
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);

  return (
    <div className="app">
      <BrowserRouter>
        <Navbar userLoggedIn ={userLoggedIn} setUserLoggedIn={setUserLoggedIn}></Navbar>
        <Routes>
          <Route
            path="/LandLordsHomepage"
            element={<LandLordsHomePage></LandLordsHomePage>}
          ></Route>
          <Route path="/" element={<HomePage></HomePage>}></Route>
          <Route
            path="/login"
            element={
              <LoginPage
                studentName={studentName}
                setStudentName={setStudentName}
                studentPass={studentPass}
                setStudentPass={setStudentPass}
                studentEmail={studentEmail}
                setStudentEmail={setStudentEmail}
                studentAddress={studentAddress}
                setStudentAddress={setStudentAddress}
                db={db}
                error={error}
                setError={setError}
                landlordName={landlordName}
                setLandlordName={setLandlordName}
                landlordPass={landlordPass}
                setLandlordPass={setLandlordPass}
                landlordEmail={landlordEmail}
                setLandlordEmail={setLandlordEmail}
                landlordPhone={landlordPhone}
                setLandlordPhone={setLandlordPhone}
                landlordError={landlordError}
                setLandlordError={setLandlordError}
                adminEmail={adminEmail}
                setAdminEmail={setAdminEmail}
                adminPass={adminPass}
                setAdminPass={setAdminPass}
                adminError={adminError}
                setAdminError={setAdminError}
                userLoggedIn={userLoggedIn}
                setUserLoggedIn={setUserLoggedIn}
              ></LoginPage>
            }
          ></Route>
          <Route
            path="/register"
            element={
              <RegistrationPage
                studentName={studentName}
                setStudentName={setStudentName}
                studentPass={studentPass}
                setStudentPass={setStudentPass}
                studentEmail={studentEmail}
                setStudentEmail={setStudentEmail}
                studentAddress={studentAddress}
                setStudentAddress={setStudentAddress}
                db={db}
                error={error}
                setError={setError}
                landlordName={landlordName}
                setLandlordName={setLandlordName}
                landlordPass={landlordPass}
                setLandlordPass={setLandlordPass}
                landlordEmail={landlordEmail}
                setLandlordEmail={setLandlordEmail}
                landlordPhone={landlordPhone}
                setLandlordPhone={setLandlordPhone}
                landlordError={landlordError}
                setLandlordError={setLandlordError}
                adminEmail={adminEmail}
                setAdminEmail={setAdminEmail}
                adminPass={adminPass}
                setAdminPass={setAdminPass}
                adminError={adminError}
                setAdminError={setAdminError}
                adminName={adminName}
                setAdminName={setAdminName}
              ></RegistrationPage>
            }
          ></Route>
          <Route
            path="/listings"
            element={<ListingsPage studentAddress={studentAddress} db={db}></ListingsPage>}
          ></Route>
          <Route
            path="/admin"
            element={<AdminPage db={db}></AdminPage>}
          ></Route>
          <Route
            path="/info/:id"
            element={<RentalInfoPage></RentalInfoPage>}
          ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
