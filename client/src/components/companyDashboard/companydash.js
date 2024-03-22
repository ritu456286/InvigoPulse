import React from "react";
import { Outlet } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ResponsiveAppBar from "../navbar/navbar";
const CompanyDash = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const user = sessionStorage.getItem("currentUser");
  const role = sessionStorage.getItem("role");
  const {id}=user;
  useEffect(() => {
    console.log(currentUser);
    
    console.log(role);
    console.log(role=='"customer"');
    if (user == null||role=='"customer"') {
      navigate("/login");
    }
    else{
      navigate("/company/companyprofile");
    }
  }, []);
  return (
    <div>
        <ResponsiveAppBar/>
      <h1>Company Dashboard</h1>
      <Outlet />
    </div>
  );
};

export default CompanyDash;
