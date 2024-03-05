import React from "react";
import { Outlet } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../cotexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
    <div>
      <h1>Consumer Dashboard</h1>
      <Outlet />
    </div>
  );
};

export default ConsumerDash;
