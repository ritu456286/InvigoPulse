import React from "react";
import { Outlet } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ResponsiveAppBarcust from "../navbar/navbarcust";
import Footer from "../footer/footer";
import axios from "axios";
const ConsumerDash = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const user = sessionStorage.getItem("currentUser");
  const role = sessionStorage.getItem("role");
  const email = sessionStorage.getItem("email");
  const { id } = user;
  useEffect(() => {
    console.log(currentUser);

    console.log(email);
    if (user == null || role == '"CompanyWorker"') {
      navigate("/login");
    } else {
      navigate("/customer/customerprofile");
    }
  }, []);
  return (
    <div>
    <div className="p-20 flex flex-col items-center justify-center gap-8">
      <ResponsiveAppBarcust />
      <Outlet />
    </div>
    <Footer/></div>
  );
};

export default ConsumerDash;
