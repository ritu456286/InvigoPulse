import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/homepage/homepage";
import CustomerLogin from "./components/customerLogin/customerlogin";
import CompanyLogin from "./components/companyLogin/companylogin";
import CompanyRegister from "./components/companyResgister/companyRegister";
import CustomerRegister from "./components/customerRegister/customerregister";
import { AuthProvider } from "./cotexts/AuthContext";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/customerlogin" element={<CustomerLogin />} />
          <Route path="/customerregister" element={<CustomerRegister />} />
          <Route path="/companylogin" element={<CompanyLogin />} />
          <Route path="/companyregister" element={<CompanyRegister />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
