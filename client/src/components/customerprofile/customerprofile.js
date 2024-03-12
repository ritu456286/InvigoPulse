import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResponsiveAppBarcust from '../navbar/navbarcust';

const CustomerProfile = () => {
  const [customerData, setCustomerData] = useState(null);
  const email = sessionStorage.getItem("email");
  const [updatedCustomerInfo, setUpdatedCustomerInfo] = useState({
    name: '',
    phone: '',
    city: '',
    address: ''
  });

  useEffect(() => {
    const fetchCustomerProfile = async () => {
      try {
        const response = await axios.get(`/customerprofile`, {
          params: {
            email: email
          }
        });
        console.log('Response from backend:', response.data);
        await setCustomerData(response.data);
        setUpdatedCustomerInfo(response.data)
      } catch (error) {
        console.error('Error fetching customer profile:', error);
      }
    };
  
    fetchCustomerProfile();
  }, [email]); // Make sure to include 'email' in the dependency array

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCustomerInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const email = sessionStorage.getItem("email");
      await axios.post('/updatecustomerprofile', {
        email,
        ...updatedCustomerInfo
      });
      // Optionally: Fetch updated data again and update state
    } catch (error) {
      console.error('Error updating customer profile:', error);
    }
  };

  return (
    <div className="bg-red-100">
      <ResponsiveAppBarcust />
      <div className="flex flex-col items-center justify-center py-8">
        <h2 className="mb-4 text-2xl font-semibold">Customer Profile</h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6 w-96"
        >
          <div className="mb-4">
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={updatedCustomerInfo.name}
                onChange={handleChange}
                className="ml-2 border border-red-500 rounded w-full p-2"
              />
            </label>
          </div>
          <div className="mb-4">
            <label>
              Phone Number:
              <input
                type="text"
                name="phone"
                value={updatedCustomerInfo.phone}
                onChange={handleChange}
                className="ml-2 border border-red-500 rounded w-full p-2"
              />
            </label>
          </div>
          <div className="mb-4">
            <label>
              City:
              <input
                type="text"
                name="city"
                value={updatedCustomerInfo.city}
                onChange={handleChange}
                className="ml-2 border border-red-500 rounded w-full p-2"
              />
            </label>
          </div>
          <div className="mb-4">
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={updatedCustomerInfo.address}
                onChange={handleChange}
                className="ml-2 border border-red-500 rounded w-full p-2"
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerProfile;
