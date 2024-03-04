import React, { useState } from 'react';
import axios from 'axios';
import ResponsiveAppBar from '../navbar/navbar';
import './AddStock.css'; // Import CSS file for styling

function AddStock() {
    const [formData, setFormData] = useState({
        InventoryId: '',
        Brand: '',
        Description: '',
        Size: '',
        PONumber: '',
        PODate: '',
        PurchasePrice: '',
        Quantity: '',
        Dollars: '',
        Price: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/addstock', formData);
            console.log('Stock added successfully:', response.data);
            // Optionally, you can reset the form after successful submission
            setFormData({
                InventoryId: '',
                Brand: '',
                Description: '',
                Size: '',
                PONumber: '',
                PODate: '',
                PurchasePrice: '',
                Quantity: '',
                Dollars: '',
                Price: ''
            });
        } catch (error) {
            console.error('Error adding stock:', error);
        }
    };

    return (
        <div >
            <ResponsiveAppBar />
            <h2>Add Stock</h2>
            <form onSubmit={handleSubmit} className="add-stock-form">
                <div className="form-group">
                    <label className="label">Inventory ID:</label>
                    <input type="text" name="InventoryId" value={formData.InventoryId} onChange={handleChange} className="input" />
                </div>
                <div className="form-group">
                    <label className="label">Brand:</label>
                    <input type="text" name="Brand" value={formData.Brand} onChange={handleChange} className="input" />
                </div>
                <div className="form-group">
                    <label className="label">Description:</label>
                    <input type="text" name="Description" value={formData.Description} onChange={handleChange} className="input" />
                </div>
                <div className="form-group">
                    <label className="label">Size:</label>
                    <input type="text" name="Size" value={formData.Size} onChange={handleChange} className="input" />
                </div>
                <div className="form-group">
                    <label className="label">PO Number:</label>
                    <input type="text" name="PONumber" value={formData.PONumber} onChange={handleChange} className="input" />
                </div>
                <div className="form-group">
                    <label className="label">PO Date:</label>
                    <input type="text" name="PODate" value={formData.PODate} onChange={handleChange} className="input" />
                </div>
                <div className="form-group">
                    <label className="label">Purchase Price:</label>
                    <input type="text" name="PurchasePrice" value={formData.PurchasePrice} onChange={handleChange} className="input" />
                </div>
                <div className="form-group">
                    <label className="label">Quantity:</label>
                    <input type="text" name="Quantity" value={formData.Quantity} onChange={handleChange} className="input" />
                </div>
                <div className="form-group">
                    <label className="label">Dollars:</label>
                    <input type="text" name="Dollars" value={formData.Dollars} onChange={handleChange} className="input" />
                </div>
                <div className="form-group">
                    <label className="label">Selling Price:</label>
                    <input type="text" name="Price" value={formData.Price} onChange={handleChange} className="input" />
                </div>
                <button type="submit" className="submit-button">Add Stock</button>
            </form>
        </div>
    );
}

export default AddStock;
