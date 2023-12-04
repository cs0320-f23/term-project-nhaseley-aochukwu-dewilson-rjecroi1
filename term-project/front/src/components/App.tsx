import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "../styles/App.css";
import Navbar from "./Navbar";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";
import RegistrationPage from "./RegistrationPage";
import ListingsPage from "./Listings";
import firebase from "firebase/compat/app"; // Use 'compat' for compatibility mode
import "firebase/compat/firestore";
import AdminPage from "./AdminPage";
// import { addDoc, collection, getDocs } from "firebase/compat/firestore";
import "firebase/firestore";
import RentersHomePage from "./LandLordsHomepage";
import LandLordsHomePage from "./LandLordsHomepage";

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
  const [renterName, setRenterName] = useState<string>("");
  const [renterEmail, setRenterEmail] = useState<string>("");
  const [renterPass, setRenterPass] = useState<string>("");
  const [renterPhone, setRenterPhone] = useState<string>("");
  const [renterError, setRenterError] = useState<string>("");
  const [adminEmail, setAdminEmail] = useState<string>("");
  const [adminPass, setAdminPass] = useState<string>("");
  const [adminError, setAdminError] = useState<string>("");
  const [adminName, setAdminName] = useState<string>("");

  return (
    <div className="app">
      <BrowserRouter>
        <Navbar> </Navbar>
        {/* <button onClick={addToDB}> Test add to database </button>
        <button onClick={readingFromDB}> Test reading from database </button> */}
        <Routes>

          <Route path= "/LandLordsHomepage" element={<LandLordsHomePage></LandLordsHomePage>}> </Route>
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
                renterName={renterName}
                setRenterName={setRenterName}
                renterPass={renterPass}
                setRenterPass={setRenterPass}
                renterEmail={renterEmail}
                setRenterEmail={setRenterEmail}
                renterPhone={renterPhone}
                setRenterPhone={setRenterPhone}
                renterError={renterError}
                setRenterError={setRenterError}
                adminEmail={adminEmail}
                setAdminEmail={setAdminEmail}
                adminPass={adminPass}
                setAdminPass={setAdminPass}
                adminError={adminError}
                setAdminError={setAdminError}
            ></LoginPage>}></Route>
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
                renterName={renterName}
                setRenterName={setRenterName}
                renterPass={renterPass}
                setRenterPass={setRenterPass}
                renterEmail={renterEmail}
                setRenterEmail={setRenterEmail}
                renterPhone={renterPhone}
                setRenterPhone={setRenterPhone}
                renterError={renterError}
                setRenterError={setRenterError}
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
            element={<ListingsPage></ListingsPage>}
          ></Route>
          <Route path="/admin" element={<AdminPage db={db}></AdminPage>}>
          </Route>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
