import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyOrdersPage.css'; // Import CSS file
import ResponsiveAppBarcust from '../navbar/navbarcust';
const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const email=sessionStorage.getItem("email");
  useEffect(() => {
    // Fetch data from /customerorders endpoint using Axios
    axios.get('/customerorders',{
      params: {
        email: email
      }
    })
      .then(response => {
        // Update state with fetched data
        setOrders(response.data);
      })
      .catch(error => {
        console.error('Error fetching customer orders:', error);
      });
  }, []);

  return (
    <div > {/* Apply CSS class for container */}
    <ResponsiveAppBarcust />
      <h2>My Orders</h2>
      <table className="cart-table"> {/* Apply CSS class for table */}
        <thead>
          <tr>
          <th>Company Name</th>
            <th>Inventory</th>
            <th>Brand</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>User Email</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <React.Fragment key={index}>
              <tr>
              <td>{order.companyName}</td>
                <td>{order.inventoryId}</td>
                <td>{order.brand}</td>
                <td>{order.Description}</td>
                <td>{order.quantity}</td>
                <td>{order.useremail}</td>
              </tr>
              <tr className="line-row"> {/* Apply CSS class for row */}
                <td colSpan="5">
                  <hr className="line" /> {/* Apply CSS class for horizontal line */}
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyOrdersPage;
