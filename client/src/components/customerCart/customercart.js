import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './customercart.css'; // Import CSS file for styling
import ResponsiveAppBarcust from '../navbar/navbarcust';
const CustomerCart = () => {
    const [cartData, setCartData] = useState([]);
  
    useEffect(() => {
        fetchCartData(); // Fetch cart data when component mounts
      }, []); // Empty dependency array ensures useEffect runs only once when component mounts
    
      const fetchCartData = () => {
        // Fetch data from /customercart endpoint using Axios
        axios.get('/customercart')
          .then(response => {
            // Update state with fetched data
            setCartData(response.data);
          })
          .catch(error => {
            console.error('Error fetching customer cart data:', error);
          });
      };
    
  
      const handleCheckout = (item) => {
        // Send a POST request to /customercheckout with the checkout data
        const { brand, Description, inventoryId, quantity, Size, Price } = item;
        axios.post('/customercheckout', { brand, Description, inventoryId, quantity, Size, Price })
          .then(response => {
            // Handle success, maybe show a message to the user
            console.log('Checkout successful:', response.data);
            // After successful checkout, fetch updated cart data
            fetchCartData();
          })
          .catch(error => {
            console.error('Error during checkout:', error);
          });
      };
    
      const handleDeleteItem = (item) => {
        // Send a POST request to /customerdeleteitem with the delete data
        const { brand, Description, inventoryId, quantity, Size, Price } = item;
        axios.post('/customerdeleteitem', { brand, Description, inventoryId, quantity, Size, Price })
          .then(response => {
            // Handle success, maybe show a message to the user
            console.log('Item deleted successfully:', response.data);
            // After deleting the item, fetch the updated cart data
            fetchCartData();
          })
          .catch(error => {
            console.error('Error deleting item:', error);
          });
      };
  
    return (
      <div >
        <ResponsiveAppBarcust />
        <h2>My Cart</h2>
        <table className="cart-table">
          <thead>
            <tr>
              <th>Inventory</th>
              <th>Brand</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Size</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cartData.map((item, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td>{item.inventoryId}</td>
                  <td>{item.brand}</td>
                  <td>{item.Description}</td>
                  <td>{item.quantity}</td>
                  <td>{item.Price}</td>
                  <td>{item.Size}</td>
                  <td>
                    <button onClick={() => handleCheckout(item)}>Checkout</button>
                    <button onClick={() => handleDeleteItem(item)}>Delete</button>
                  </td>
                </tr>
                <tr className="line-row">
                  <td colSpan="7"><hr /></td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default CustomerCart;