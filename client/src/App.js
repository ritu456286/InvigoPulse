import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/homepage/homepage";
import CustomerLogin from "./components/customerLogin/customerlogin";
import CustomerRegister from "./components/customerRegister/customerregister";

import ConsumerDash from "./components/ConsumerDashboard/ConsumerDash";
import { AuthProvider } from "./contexts/AuthContext";
import CompanyPage from "./components/companyDashboard/companydashboard";
// import App1 from './app1';
import CompanyInventory from "./components/companyInventory/companyInventory";
import AddStock from "./components/companyInventory/addstocks";
import CompanySales from "./components/companyOrdersAndSales/companysales";
import ProductSalesPage from "./components/customerSelectType/products";
import CustomerCart from "./components/customerCart/customercart";
import MyOrdersPage from "./components/customerOrders/customerorders";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CompanyDash from "./components/companyDashboard/companydash";
import CompanyProfile from "./components/companyProfile/companyprofile";
import CustomerProfile from "./components/customerprofile/customerprofile";
import CompanyDeadstocks from "./components/companydeadstocks/companydeadstocks";
import ProductOffers from "./components/customeroffers/customeroffers";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<CustomerLogin />} />
          <Route path="/register" element={<CustomerRegister />} />
          <Route path="/customer" element={<ConsumerDash />}>
            <Route path="/customer/" element={<ProductSalesPage />} />
            <Route
              path="/customer/customerprofile"
              element={<CustomerProfile />}
            />
            <Route path="/customer/customercart" element={<CustomerCart />} />
            <Route path="/customer/customerorders" element={<MyOrdersPage />} />
            
            <Route path="/customer/offerssales" element={<ProductOffers />} />
          </Route>
          <Route path="/company/companypage" element={<CompanyPage />} />
          <Route path="/company/" element={<CompanyDash />} />
          <Route
            path="/company/companyinventory"
            element={<CompanyInventory />}
          />
          <Route path="/company/companyaddstock" element={<AddStock />} />
          <Route path="/company/companysales" element={<CompanySales />} />
          <Route
            path="/customer/customersales"
            element={<ProductSalesPage />}
          />
          <Route path="/company/companyprofile" element={<CompanyProfile />} />
          <Route path="/company/companydeadstocks" element={<CompanyDeadstocks/>} />
        </Routes>
      </Router>
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
