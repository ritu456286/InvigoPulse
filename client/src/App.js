import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/homepage/homepage";
import CustomerLogin from "./components/customerLogin/customerlogin";
import CustomerRegister from "./components/customerRegister/customerregister";
import AllProducts from "./components/ConsumerDashboard/allProducts";
import ConsumerDash from "./components/ConsumerDashboard/ConsumerDash";
import { AuthProvider } from "./cotexts/AuthContext";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<CustomerLogin />} />
          <Route path="/register" element={<CustomerRegister />} />
          <Route path="/customer" element={<ConsumerDash />}>
            <Route path="/customer/" element={<AllProducts />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
