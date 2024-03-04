import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ResponsiveAppBar from '../navbar/navbar';

function CompanyInventory() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(100);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [editableItem, setEditableItem] = useState(null); // Track which item is being edited
  const [editableItems, setEditableItems] = useState(null); 
  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm]);

  const fetchData = async () => {
    try {
      const response = await axios.get('/companywarehouse');
      setData(response.data);
      setSearchResults(response.data); // Set search results initially to all data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = searchResults.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filterResults = (event) => {
    event.preventDefault();
    const filteredData = data.filter(
      (item) =>
        item.Brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredData);
    setCurrentPage(1); // Reset to first page after filtering
  };

  const handleUpdate = (item) => {
    setEditableItem(item); 
    setEditableItems(item);// Set the item being edited
  };

  const handleDelete = async (item) => {
    try {
      await axios.post('/inventorydelete', item);
      // Refetch data after deletion
      fetchData();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };
  const handleSubmit = async () => {
    try {
      await axios.post('/updateinventory', editableItems);
      fetchData(); // Refresh data after update
      setEditableItem(null);
       // Reset editableItem state
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };
  var pp,quantity,dollars,price;
  const handleChange = (event, key) => {
    const { value } = event.target;
    if (value !== editableItems[key]) {
      // Check if key is nested
      const keys = key.split('.');
      if (keys.length === 1) {
        setEditableItems((prevItem) => ({
          ...prevItem,
          [key]: value,
        }));
      } else {
        // Handle nested properties
        setEditableItems((prevItem) => ({
          ...prevItem,
          [keys[0]]: {
            ...prevItem[keys[0]],
            [keys[1]]: value,
          },
        }));
      }
    }
  };



  const handleCancel = () => {
    setEditableItem(null); // Cancel editing
  };

  return (
    <div>
      <ResponsiveAppBar />
      <h2>Warehouse</h2>
      <Link to="/companyaddstock">
        <button>Add Stock</button>
      </Link>
      <form onSubmit={filterResults}>
        <input
          type="text"
          placeholder="Search by brand or description"
          value={searchTerm}
          onChange={handleSearch}
        />
        <button type="submit">Submit</button>
      </form>
      <div>
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastItem >= data.length}>
          Next
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>InventoryId</th>
            <th>Store</th>
            <th>Brand</th>
            <th>Description</th>
            <th>Size</th>
            <th>PONumber</th>
            <th>PurchasePrice</th>
            <th>Quantity</th>
            <th>Dollars</th>
            <th>Selling price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index}>
              <td>{item.InventoryId}</td>
              <td>{item.Store}</td>
              <td>{item.Brand}</td>
              <td>{item.Description}</td>
              <td>{item.Size}</td>
              <td>{item.PONumber}</td>
              <td>
                {editableItem === item ? (
                  <input type="text" value={editableItems.PurchasePrice} onChange={(event) => handleChange(event, 'PurchasePrice')} />
                ) : (
                  item.PurchasePrice
                )}
              </td>
              <td>
                {editableItem === item ? (
                  <input type="text" value={editableItems.Quantity} onChange={(event) => handleChange(event, 'Quantity')} />
                ) : (
                  item.Quantity
                )}
              </td>
              <td>
                {editableItem === item ? (
                  <input type="text" value={editableItems.Dollars} onChange={(event) => handleChange(event, 'Dollars')} />
                ) : (
                  item.Dollars
                )}
              </td>
              <td>
                {editableItem === item ? (
                  <input type="text" value={editableItems.Price} onChange={(event) => handleChange(event, 'Price')} />
                ) : (
                  item.Price
                )}
              </td>

              <td>
                {editableItem === item ? (
                  <React.Fragment>
                    <button onClick={handleSubmit}>Submit</button>
                    <button onClick={handleCancel}>Cancel</button>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <button onClick={() => handleUpdate(item)}>Update</button>
                    <button onClick={() => handleDelete(item)}>Delete</button> {/* Add delete button */}
                  </React.Fragment>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      
    </div>
  );
}

export default CompanyInventory;
