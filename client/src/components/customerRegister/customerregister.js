import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseConfig";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { Box } from "@mui/material";

import register_svg from "../../asserts/register_svg.svg";
import axios from "axios";
function CustomerRegister() {
  const style = {
    bgcolor: "background.paper",
    boxShadow: 24,
    justifyContent: "center",
    alignItems: "center",
    p: 2,
  };
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [phone, setPhone] = useState(null);
  const [role, setRole] = useState(null);
  const [address, setAddress] = useState(null);
  const [city, setCity] = useState(null);
  const { currentUser, signOutUser, signIn, loginUser } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const register = async (e) => {
    e.preventDefault();
    if (
      email == null ||
      password == null ||
      phone == null ||
      role == null ||
      address == null ||
      city == null
    ) {
      toast.error("All the fields are cumpulsory !" + error, {
        toastId: "RegisterNullError",
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }
    const { data, error } = await signIn(
      email,
      password,
      phone,
      role,
      address,
      city
    );
    if (error) {
      toast.error("Error in signup : \n" + error, {
        toastId: "SignUpError",
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      console.log("Error in signup : \n", error);
    }
    if (!error) {
      console.log(data);
      toast.success("Registered Successfully !", {
        toastId: "RegisteredSuccessfully",
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      if (data.user.user_metadata.role == "CompanyWorker") {
        console.log(data.user.email);
        axios
          .post(" /companyemailreg", { 
            email: data.user.email, 
            city:data.user.user_metadata.city, 
            address:data.user.user_metadata.address,
            phone:data.user.user_metadata.phone 
          })
          .then((response) => {
            console.log("registered employee", response.data);
          })
          .catch((error) => {
            console.error("Error in registration ", error);
          });
        navigate("/company/");
      } else {
        console.log(data.user.email);
        axios
          .post(" /customeremailreg", { 
            email: data.user.email, 
            city:data.user.user_metadata.city, 
            address:data.user.user_metadata.address,
            phone:data.user.user_metadata.phone
          })
          .then((response) => {
            console.log("registered customer", response.data);
          })
          .catch((error) => {
            console.error("Error in registration ", error);
          });
        navigate("/customer/");
      }
    }
  };
  const handleChnage = (e) => {
    setRole(e.target.value);
  };
  return (
    <div className="w-full h-full min-h-dvh py-36 bg-slate-800 backdrop-filter backdrop-blur-lg bg-opacity-70 flex flex-col justify-center items-center h-full">
      <Box sx={style} flexDirection={"column"} boxShadow={3} borderRadius={1}>
        <div className="flex justify-center items-center w-full flex-row">
          <div className="flex justify-center flex-col items-center  w-full px-12 py-4 gap-4">
            <h1 className="text-xl font-bold">CREATE ACCOUNT</h1>
            <form
              className="custom_shadows  flex flex-col justify-center items-start gap-5 w-fit"
              onSubmit={(e) => register(e)}
            >
              <div>
                <label>Email</label>
                <br />
                <input
                  required
                  type="text"
                  placeholder="enter email"
                  value={email}
                  className="border border-black-100 p-2 w-60"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <div>
                <label>Phone no</label>
                <br />
                <input
                  required
                  type="number"
                  placeholder="enter phone no"
                  value={phone}
                  className="border border-black-100 p-2 w-60"
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                />
              </div>

              <div>
                <label>Password</label>
                <br />
                <input
                  required
                  type="password"
                  placeholder="enter password"
                  className="border border-black-100 p-2 w-60"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
              <div>
                <label>Address</label>
                <br />
                <input
                  required
                  type="string"
                  placeholder="enter address"
                  value={address}
                  className="border border-black-100 p-2 w-60"
                  onChange={(e) => {
                    setAddress(e.target.value);
                  }}
                />
              </div>
              <div>
                <label>City</label>
                <br />
                <input
                  required
                  type="string"
                  placeholder="enter city"
                  value={city}
                  className="border border-black-100 p-2 w-60"
                  onChange={(e) => {
                    setCity(e.target.value);
                  }}
                />
              </div>
              <div className="text-start mt-0 flex flex-col justify-start items-start">
                <br />
                <label>
                  <input
                    type="radio"
                    value="CompanyWorker"
                    name="role"
                    onChange={handleChnage}
                  />
                  CompanyWorker
                  <br />
                </label>
                <label>
                  <input
                    type="radio"
                    value="customer"
                    name="role"
                    onChange={handleChnage}
                  />
                  Customer
                </label>
              </div>
              <button className="bg-red-500 py-2 px-11 text-white w-60 ">
                Create Account
              </button>
            </form>
            <div>
              <p>
                Already have an account?{" "}
                <span className="text-red-900">
                  <Link to="/login">Login here</Link>
                </span>
              </p>
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
}

export default CustomerRegister;
