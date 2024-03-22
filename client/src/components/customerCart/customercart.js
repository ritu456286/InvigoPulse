import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./customercart.css"; // Import CSS file for styling
import ResponsiveAppBarcust from "../navbar/navbarcust";
import { AuthContext } from "../../contexts/AuthContext";
const CustomerCart = () => {
  const [cartData, setCartData] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false); // State for showing delete popup
  const [showCheckoutPopup, setShowCheckoutPopup] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const email=sessionStorage.getItem("email");
  useEffect(() => {
    fetchCartData(email); // Fetch cart data when component mounts
    console.log(email);
  }, []); // Empty dependency array ensures useEffect runs only once when component mounts

  const fetchCartData = (email) => {
    console.log(email);
    // Fetch data from /customercart endpoint using Axios
    axios.get('/customercart', {
      params: {
        email: email
      }
    })
      .then((response) => {
        // Update state with fetched data
        console.log(response.data);
        setCartData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching customer cart data:", error);
      });
      console.log(cartData);
  };

  const handleCheckout = (item) => {
    // Send a POST request to /customercheckout with the checkout data
    const { stockid,brand, Description, inventoryId, quantity, size, Price, companyemail } = item;
    axios
      .post("/customercheckout", {
        email: email,
        brand,
        Description,
        inventoryId,
        quantity,
        size,
        Price,
        companyemail,
        stockid
      })
      .then((response) => {
        // Handle success, maybe show a message to the user
        console.log("Checkout successful:", response.data);
        setShowCheckoutPopup(true); // Show the popup
        setTimeout(() => {
          setShowCheckoutPopup(false); // Hide the popup after 2 seconds
        }, 2000);
        // After successful checkout, fetch updated cart data
        fetchCartData(email);
      })
      .catch((error) => {
        console.error("Error during checkout:", error);
      });
  };

  const handleDeleteItem = (item) => {
    // Send a POST request to /customerdeleteitem with the delete data
    const { stockid,brand, Description, inventoryId, quantity, Size, Price, companyemail } = item;
    axios
      .post("/customerdeleteitem", {
        email: email,
        brand,
        Description,
        inventoryId,
        quantity,
        Size,
        Price,
        companyemail,
        stockid

      })
      .then((response) => {
        // Handle success, maybe show a message to the user
        console.log("Item deleted successfully:", response.data);
        setShowDeletePopup(true); // Show the popup
        setTimeout(() => {
          setShowDeletePopup(false); // Hide the popup after 2 seconds
        }, 2000);
        // After deleting the item, fetch the updated cart data
        fetchCartData(email);
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
      });
  };

  return (
    <div>
    <h2 className="text-5xl bold mb-5 text-center">My Cart</h2>
    <div className="flex items-center justify-center">
      {/* <ResponsiveAppBarcust /> */}
      
      <table
        className="divide-y divide-gray-200"
        style={{ margin: "auto", width: "80%" }}
      >
        <thead className="bg-red-800 text-white">
          <tr>
            <th className="px-6 py-6 text-left text-l font-medium uppercase tracking-wider">
              Inventory
            </th>
            <th className="px-6 py-6 text-left text-l font-medium uppercase tracking-wider">
              Brand
            </th>
            <th className="px-6 py-6 text-left text-l font-medium uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-6 text-left text-l font-medium uppercase tracking-wider">
              Quantity
            </th>
            <th className="px-6 py-6 text-left text-l font-medium uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-6 text-left text-l font-medium uppercase tracking-wider">
              Size
            </th>
            <th className="px-6 py-6 text-left text-l font-medium uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {cartData.map((item, index) => (
            <React.Fragment key={index}>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.inventoryId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.brand}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.Description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.Price}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.size}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className="text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium"
                    onClick={() => handleCheckout(item)}
                  >
                    Checkout
                  </button>
                  <button
                    className="text-white bg-red-800 hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium ml-4"
                    onClick={() => handleDeleteItem(item)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
              <tr className="line-row">
                <td colSpan="7">
                  <hr />
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
    {showDeletePopup && (
        <div className="fixed bottom-0 right-0 bg-red-500 text-white p-2 rounded-tl-lg">
          Item deleted successfully!
        </div>
      )}
      {/* Checkout popup */}
      {showCheckoutPopup && (
        <div className="fixed bottom-0 right-0 bg-green-500 text-white p-2 rounded-tl-lg">
          Checkout successful!
        </div>
      )}
    </div>
  );
};

export default CustomerCart;
