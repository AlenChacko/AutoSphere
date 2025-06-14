import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext.jsx";
import { AdminProvider } from "./context/AdminContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserProvider>
      <AdminProvider>
        <App />
      </AdminProvider>
    </UserProvider>
  </BrowserRouter>
);
