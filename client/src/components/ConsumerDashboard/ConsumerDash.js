import React from "react";
import { Outlet } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../cotexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ResponsiveAppBarcust from "../navbar/navbarcust";
import axios from "axios";
const ConsumerDash = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const user = sessionStorage.getItem("currentUser");
  const role = sessionStorage.getItem("role");
  const email=sessionStorage.getItem("email");
  const {id}=user;
  useEffect(() => {
    console.log(currentUser);
    
    console.log(email);
    if (user == null||role=='"CompanyWorker"') {
      navigate("/login");
    }
    else{
      navigate("/customer/customerprofile");
    }
  }, []);
  return (
    <div>
      <ResponsiveAppBarcust/>
      <h1>Consumer Dashboard</h1>
      <Outlet />
    </div>
  );
};

export default ConsumerDash;
