import React from "react";
import { Outlet } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../cotexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ResponsiveAppBarcust from "../navbar/navbarcust";
const ConsumerDash = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const user = sessionStorage.getItem("currentUser");
  useEffect(() => {
    console.log(currentUser);
    console.log(user);
    if (user == null) {
      navigate("/login");
    }
  }, []);
  return (
    <div className="p-20">
      <ResponsiveAppBarcust />
      <Outlet />
    </div>
  );
};

export default ConsumerDash;
