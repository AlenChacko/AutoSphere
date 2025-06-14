// src/layouts/PlainLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";

const PlainLayout = ({ children }) => {
  return <div>
    <Outlet/>
  </div>;
};

export default PlainLayout;
