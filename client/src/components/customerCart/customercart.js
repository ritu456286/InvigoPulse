import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./customercart.css"; // Import CSS file for styling
import ResponsiveAppBarcust from "../navbar/navbarcust";
import { AuthContext } from "../../cotexts/AuthContext";
import data from "../../json/allproducts.json";
const CustomerCart = () => {
  const [cartData, setCartData] = useState([]);
  const { currentUser } = useContext(AuthContext);
  useEffect(() => {
    //fetchCartData(); // Fetch cart data when component mounts
    setCartData(data);
    console.log(currentUser);
  }, []); // Empty dependency array ensures useEffect runs only once when component mounts

  const fetchCartData = () => {
    // Fetch data from /customercart endpoint using Axios
    axios
      .get("/customercart")
      .then((response) => {
        // Update state with fetched data
        setCartData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching customer cart data:", error);
      });
  };

  const handleCheckout = (item) => {
    // Send a POST request to /customercheckout with the checkout data
    const { brand, Description, inventoryId, quantity, Size, Price } = item;
    axios
      .post("/customercheckout", {
        brand,
        Description,
        inventoryId,
        quantity,
        Size,
        Price,
      })
      .then((response) => {
        // Handle success, maybe show a message to the user
        console.log("Checkout successful:", response.data);
        // After successful checkout, fetch updated cart data
        fetchCartData();
      })
      .catch((error) => {
        console.error("Error during checkout:", error);
      });
  };

  const handleDeleteItem = (item) => {
    // Send a POST request to /customerdeleteitem with the delete data
    const { brand, Description, inventoryId, quantity, Size, Price } = item;
    axios
      .post("/customerdeleteitem", {
        brand,
        Description,
        inventoryId,
        quantity,
        Size,
        Price,
      })
      .then((response) => {
        // Handle success, maybe show a message to the user
        console.log("Item deleted successfully:", response.data);
        // After deleting the item, fetch the updated cart data
        fetchCartData();
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
      });
  };

  return (
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
                <td className="px-6 py-4 whitespace-nowrap">{item.Size}</td>
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
  );
};

export default CustomerCart;
