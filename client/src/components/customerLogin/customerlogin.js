import React from "react";
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import register_svg from "../../asserts/register_svg.svg";
import axios from "axios";
function CustomerLogin() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const login = async (e) => {
    e.preventDefault();
    if (email == null || password == null) {
      toast.error("Email and Password can't be null", {
        toastId: "LoginNullError",
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      console.log("Email and Password can't be null");
      return;
    }
    const { data, error } = await loginUser(email, password);
    if (error) {
      toast.error("Error in Login :\n" + error, {
        toastId: "ErrorInLogin",
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      console.log("Error in Login :\n", error);
    } else {
      console.log("Login data :\n", data);
      toast.success("Welcome back !", {
        toastId: "WelcomeBack",
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
          .post(" /companyemail", { email: data.user.email })
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
          .post(" /customeremail", { email: data.user.email })
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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-12">
      <h1 className="text-center font-bold text-5xl">Login</h1>
      <div className="flex flex-col md:flex-row justify-center items-center md:items-center gap-12">
        <div className="w-full md:w-100 border border-gray-200 border-2 shadow-lg">
          <form
            className="p-6 custom_shadows flex flex-col justify-center items-center gap-5"
            onSubmit={(e) => {
              login(e);
            }}
          >
            <div>
              <label>Email</label>
              <br />
              <input
                type="text"
                placeholder="Enter email"
                value={email}
                className="border border-black-100 p-2 w-full"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div>
              <label>Password</label>
              <br />
              <input
                type="password"
                placeholder="Enter password"
                className="border border-black-100 p-2 w-full"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <button className="bg-red-500 py-2 px-11 text-white w-full">
              Login
            </button>
          </form>
          <button
            className="bg-red-500 py-2 px-11 w-full text-white"
            onClick={() => navigate("/register")}
          >
            Don't have an account, Register
          </button>
        </div>
        {/* Conditional rendering for the image */}
        {windowWidth >= 1000 && (
          <img
            src={register_svg}
            className="w-100 h-80 md:w-100 md:h-80"
            alt="Register"
          />
        )}
      </div>
    </div>
  );
}

export default CustomerLogin;
