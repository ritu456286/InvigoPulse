import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResponsiveAppBar from '../navbar/navbar';
import Footer from '../footer/footer';
const CompanyProfile = () => {
  const [companyData, setCompanyData] = useState(null);
  const email = sessionStorage.getItem("email");
  const [updatedCompanyInfo, setUpdatedCompanyInfo] = useState({
    companyName: '',
    ownerName: '',
    address: '',
    city: '',
    phoneNumber: ''
  });

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const response = await axios.get(`/companyprofile`, {
          params: {
            email: email
          }
        });
        console.log('Response from backend:', response.data);
        await setCompanyData(response.data);
        console.log(companyData)
        setUpdatedCompanyInfo(response.data)
      } catch (error) {
        console.error('Error fetching company profile:', error);
      }
    };
  
    console.log('Email:', email);
    fetchCompanyProfile();
  }, [email]); // Make sure to include 'email' in the dependency array

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCompanyInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const email = sessionStorage.getItem("email");
      await axios.post('/updatecompanyprofile', {
        email,
        ...updatedCompanyInfo
      });
      // Optionally: Fetch updated data again and update state
    } catch (error) {
      console.error('Error updating company profile:', error);
    }
  };

//   if (!companyData) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen bg-red-100">
//         <ResponsiveAppBar />
//         <p>Loading...</p>
//       </div>
//     );
//   }

  return (
    <div className="bg-red-100 min-h-screen">
      <ResponsiveAppBar />
      <div className="flex flex-col items-center justify-center py-8">
        <h2 className="mb-4 text-2xl font-semibold">Company Profile</h2>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 w-96">
          <div className="mb-4">
            <label>
              Company Name:
              <input
                type="text"
                name="companyName"
                value={updatedCompanyInfo.companyName}
                onChange={handleChange}
                className="ml-2 border border-red-500 rounded w-full p-2"
              />
            </label>
          </div>
          <div className="mb-4">
            <label>
              Owner Name:
              <input
                type="text"
                name="ownerName"
                value={updatedCompanyInfo.ownerName}
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
                value={updatedCompanyInfo.address}
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
                value={updatedCompanyInfo.city}
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
                name="phoneNumber"
                value={updatedCompanyInfo.phoneNumber}
                onChange={handleChange}
                className="ml-2 border border-red-500 rounded w-full p-2"
              />
            </label>
          </div>
          <button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">
            Submit
          </button>
        </form>
      </div>
      <Footer/>
    </div>
  );
};

export default CompanyProfile;
