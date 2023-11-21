import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "../styles/App.css";
import Navbar from "./Navbar";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";
import RegistrationPage from "./RegistrationPage";
import ListingsPage from "./Listings";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Navbar> </Navbar>

        <Routes>
          <Route path="/" element={<HomePage></HomePage>}></Route>
          <Route path="/login" element={<LoginPage></LoginPage>}></Route>
          <Route path="/register" element={<RegistrationPage></RegistrationPage>}> </Route>
          <Route path="/listings" element={<ListingsPage></ListingsPage>}> </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
