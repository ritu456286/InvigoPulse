import * as React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import useMediaQuery from '@mui/material/useMediaQuery';
import AdbIcon from "@mui/icons-material/Adb";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext } from "react";
import { toast } from "react-toastify";
const pages = ["Customer Sales", "Customer Orders", "Customer Cart", 'Offers Sales',];
const settings = ["Profile", "Account", "Dashboard", "Logout"];
function ResponsiveAppBarcust() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { currentUser, signOutUser, signIn, loginUser } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const logOut = async () => {
    await signOutUser();
    toast.success("Logged out successfully !", {
      toastId: "Logout",
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    navigate("/login");
  };
  
  return (
    <nav className="flex backdrop-filter backdrop-blur-lg bg-opacity-30 border-b border-gray-200 justify-evenly fixed px-5 right-0 left-0 top-0 mb-20 bg-white z-10">
      <div className="flex justify-between w-full">
        <h3 className="text-lg font-bold py-3">InvigoPulse</h3>
        <div className="flex w-auto space-x-4 text-gray-900 gap-4">
          <Link
            to="/customer/"
            className="font-semibold py-3 hover:border-b-2 hover:border-red-600"
          >
            Browse
          </Link>
          <Link
            to="/customer/customercart"
            className="font-semibold py-3 hover:border-b-2 hover:border-red-600"
          >
            My Cart
          </Link>
          <Link
            to="/customer/offerssales"
            className="font-semibold py-3 hover:border-b-2 hover:border-red-600"
          >
            
            Offers and Sales
          </Link>
          <Link
            to="/customer/customerorders"
            className="font-semibold py-3 hover:border-b-2 hover:border-red-600"
          >
            My Orders
          </Link>
          <Link
            to="/customer/customerprofile"
            className="font-semibold py-3 hover:border-b-2 hover:border-red-600"
          >
            My Profile
          </Link>
          <button
            className=" my-2 align-middle text-white w-auto bg-gradient-to-r py-3 from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 text-center"
            onClick={() => {
              logOut();
            }}
          >
            <p>Logout</p>
          </button>
        </div>
      </div>

      {/* {(currentUser.user_metadata.role == 'service_provider') &&
          <Link to="/dashboard/provider">Provider Dashboard</Link>}*/}
    </nav>
  );
}
export default ResponsiveAppBarcust;
