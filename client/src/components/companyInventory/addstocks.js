import React, { useState } from 'react';
import axios from 'axios';
import ResponsiveAppBar from '../navbar/navbar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Footer from '../footer/footer';
const email = sessionStorage.getItem("email");

function AddStock() {
    const [formData, setFormData] = useState({
        email: email,
        InventoryId: '',
        Brand: '',
        Description: '',
        Size: '',
        PONumber: '',
        PODate: '',
        PurchasePrice: '',
        Quantity: '',
        Dollars: '',
        Price: '',
        City: '',
        expirydate: ''
    });
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const handleChange = (e) => {
        console.log(email);
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log({formData})
            const response = await axios.post('/addstock', { formData });
            console.log('Stock added successfully:', response.data);
            // Optionally, you can reset the form after successful submission
            setShowSuccessPopup(true);
            setTimeout(() => {
                setShowSuccessPopup(false); // Hide the popup after 2 seconds
            }, 2000);
            setFormData({
                email: email,
                InventoryId: '',
                Brand: '',
                Description: '',
                Size: '',
                PONumber: '',
                PODate: '',
                PurchasePrice: '',
                Quantity: '',
                Dollars: '',
                Price: '',
                City: '',
                expirydate: ''
            });
        } catch (error) {
            console.error('Error adding stock:', error);
        }
    };

    return (
        <div className="bg-red-0 h-full" >
            <ResponsiveAppBar />
            <div className="flex justify-center items-center h-full mt-7 mb-7 ">
                <div className=" w-2/5 bg-red-100 shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-semibold text-red-700 mb-4">Add Stock</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Inventory ID:</label>
                            <input type="text" name="InventoryId" value={formData.InventoryId} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Brand:</label>
                            <input type="text" name="Brand" value={formData.Brand} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                            <input type="text" name="Description" value={formData.Description} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Size:</label>
                            <input type="text" name="Size" value={formData.Size} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">PO Number:</label>
                            <input type="text" name="PONumber" value={formData.PONumber} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">PO Date:</label>
                            <DatePicker
                                selected={formData.PODate}
                                onChange={(date) => setFormData({ ...formData, PODate: date })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Purchase Price:</label>
                            <input type="text" name="PurchasePrice" value={formData.PurchasePrice} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Quantity:</label>
                            <input type="text" name="Quantity" value={formData.Quantity} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Dollars:</label>
                            <input type="text" name="Dollars" value={formData.Dollars} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Selling Price:</label>
                            <input type="text" name="Price" value={formData.Price} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">City:</label>
                            <input type="text" name="City" value={formData.City} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Expiry Date:</label>
                            <DatePicker
                                selected={formData.expirydate}
                                onChange={(date) => setFormData({ ...formData, expirydate: date })}
                                minDate={formData.PODate} // Ensure expiry date is later than purchase date
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <button type="submit" className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4">Add Stock</button>
                    </form>
                </div>
            </div>
            {showSuccessPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg">
                        <h2 className="text-2xl font-semibold text-green-700 mb-4">Stock Added Successfully!</h2>

                    </div>
                </div>
            )}
            <Footer/>
        </div>
    );
}

export default AddStock;
