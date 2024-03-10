import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MyOrdersPage.css"; // Import CSS file
import ResponsiveAppBarcust from "../navbar/navbarcust";
import data from "../../json/customerOrders.json";
const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch data from /customerorders endpoint using Axios
    // axios
    //   .get("/customerorders")
    //   .then((response) => {
    //     // Update state with fetched data
    //     setOrders(response.data);
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching customer orders:", error);
    //   });
    setOrders(data);
  }, []);

  return (
    <>
      <h2 className="text-5xl bold">My Orders</h2>
      <div className="w-fit py-6 px-5 flex items-center justify-center border border-gray-200 border-2 shadow-lg">
        {" "}
        {/* Apply CSS class for container */}
        <ResponsiveAppBarcust />
        <div>
          {" "}
          <table className="table-auto">
            {" "}
            {/* Apply CSS class for table */}
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
                  User Email
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.inventoryId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.brand}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.Description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.useremail}
                    </td>
                  </tr>
                  <tr className="line-row">
                    {" "}
                    {/* Apply CSS class for row */}
                    <td colSpan="5">
                      <hr className="line" />{" "}
                      {/* Apply CSS class for horizontal line */}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default MyOrdersPage;
