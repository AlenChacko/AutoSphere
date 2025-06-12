import React from "react";
import { Routes, Route } from "react-router-dom";
import Auth from "./pages/user/Auth";
import Home from "./pages/user/Home";
import Cars from "./pages/user/Cars";
import CarDetails from "./pages/user/CarDetails";
import Navbar from "./components/user/Navbar";
import Footer from "./components/user/Footer";

const App = () => {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
         <Route path="/brands/:brand" element={<Cars />} />
         <Route path="/car/:brand/:model" element={<CarDetails />} />

      </Routes>
      <Footer/>
    </div>
  );
};

export default App;
