import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyOrdersPage.css'; // Import CSS file
import ResponsiveAppBarcust from '../navbar/navbarcust';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [review, setReview] = useState('');
  const email = sessionStorage.getItem('email');

  useEffect(() => {
    // Fetch data from /customerorders endpoint using Axios
    axios
      .get('/customerorders', {
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

  const handleReviewChange = (event, index) => {
    const updatedOrders = [...orders];
    updatedOrders[index].review = event.target.value;
    setOrders(updatedOrders);
  };

  const handleSubmitReview = (index) => {
    const updatedOrder = orders[index];
    // Send updated order data to the backend
    console.log(updatedOrder)
    axios.post('/addeditreview', updatedOrder)
      .then(response => {
        console.log('Review added/edited successfully:', response.data);
      })
      .catch(error => {
        console.error('Error adding/editing review:', error);
      });
  };

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
                <th className="px-6 py-6 text-left text-l font-medium uppercase tracking-wider">
                  Review 
                </th>
                <th className="px-6 py-6 text-left text-l font-medium uppercase tracking-wider">
                  Action
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
                    <td>
                  {/* Display review text */}
                  <input
                    type="text"
                    value={order.review || ''}
                    onChange={(event) => handleReviewChange(event, index)}
                    style={{ border: '1px solid #ccc', padding: '5px' }} // Add border style
                  />
                </td>
                <td>
                  {/* Add/Edit Review button */}
                  <button onClick={() => handleSubmitReview(index)} className="text-white bg-red-800 hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium">
                    Add/Edit Review
                  </button>
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
