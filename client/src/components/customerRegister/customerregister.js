import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseConfig";
import { AuthContext } from "../../cotexts/AuthContext";
import { toast } from "react-toastify";
function CustomerRegister() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [phone, setPhone] = useState(null);
  const [role, setRole] = useState(null);
  const { currentUser, signOutUser, signIn, loginUser } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const register = async (e) => {
    e.preventDefault();
    if (email == null || password == null || phone == null || role == null) {
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
    const { data, error } = await signIn(email, password, phone, role);
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
      if (data.user.user_metadata.role == "service_provider") {
        navigate("/manage/business");
      } else {
        navigate("/dashboard/user");
      }
    }
  };
  const handleChnage = (e) => {
    setRole(e.target.value);
  };
  return (
    <div className="w-screen h-fit py-12 flex flex-col justify-center items-center gap-12">
      <h1 className="text-center bold text-5xl  p">Create Account</h1>
      <div className="flex flex-row justify-center items-center gap-12">
        <div>
          <form
            className="p-12 custom_shadows  flex flex-col justify-center items-start gap-5 w-fit"
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
          <button
            className="bg-red-500 py-2 px-11 w-full text-white"
            onClick={() => navigate("/login/user")}
          >
            Already have an account, Login
          </button>
        </div>
        {/*the image*/}
        {/* <img src={ServiceImg} /> */}
      </div>
    </div>
  );
}

export default CustomerRegister;
