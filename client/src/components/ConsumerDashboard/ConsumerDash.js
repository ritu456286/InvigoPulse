import React from "react";
import { Outlet } from "react-router-dom";
const ConsumerDash = () => {
  return (
    <div>
      <h1>Consumer Dashboard</h1>
      <Outlet />
    </div>
  );
};

export default ConsumerDash;
