import React from "react";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../cotexts/AuthContext";
import { toast } from "react-toastify";
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
      if (data.user.user_metadata.role == "service_provider") {
        navigate("/dashboard/provider");
      } else {
        navigate("/dashboard/user");
      }
    }
  };
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-12">
      <h1 className="text-center bold text-5xl  p">Login</h1>
      <div className="flex flex-row justify-center items-center gap-12">
        <div>
          <form
            className="p-6 custom_shadows  flex flex-col justify-center items-center gap-5"
            onSubmit={(e) => {
              login(e);
            }}
          >
            <div>
              <label>Email</label>
              <br />
              <input
                type="text"
                placeholder="enter email"
                value={email}
                className="border border-black-100 p-2"
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
                placeholder="enter password"
                className="border border-black-100 p-2"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <button className="bg-red-500 py-2 px-11 text-white">login</button>
          </form>
          <button
            className="bg-red-500 py-2 px-11 w-full text-white"
            onClick={() => navigate("/createuser")}
          >
            Don't have an account, Register
          </button>
        </div>
        {/*the image*/}
        {/* <img src={ServiceImg} /> */}
      </div>
    </div>
  );
}

export default CustomerLogin;
