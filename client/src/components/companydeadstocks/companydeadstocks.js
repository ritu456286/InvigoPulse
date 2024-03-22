import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ResponsiveAppBar from '../navbar/navbar';
import Footer from '../footer/footer';
function CompanyDeadstocks() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [editableItem, setEditableItem] = useState(null); // Track which item is being edited
  const [editableItems, setEditableItems] = useState(null); 
  const email=sessionStorage.getItem("email");
  const [successMessage, setSuccessMessage] = useState('');
  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm]);

  const fetchData = async () => {
    try {
      const response = await axios.get('/companywarehouse', {
        params: {
          email: email
        }
      });
      const sortedData = response.data.sort((a, b) => new Date(a.expirydate) - new Date(b.expirydate));
      setData(sortedData);
      setSearchResults(sortedData); // Set search results initially to all data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = searchResults.slice(indexOfFirstItem, indexOfLastItem);
  const uniqueInventoryId = [...new Set(data.map(item => item.InventoryId))];
    const uniqueBrand = [...new Set(data.map(item => item.Brand))];
    const uniqueDescription = [...new Set(data.map(item => item.Description))];
    const uniqueSize = [...new Set(data.map(item => item.Size))];
    const uniquePONumber = [...new Set(data.map(item => item.PONumber))];
    const uniquePODate = [...new Set(data.map(item => item.PODate))];
    const uniqueexpirydate = [...new Set(data.map(item => item.expirydate))];
    const uniqueCity = [...new Set(data.map(item => item.City))];
    const uniquePurchasePrice = [...new Set(data.map(item => item.PurchasePrice))];
    const uniqueQuantity = [...new Set(data.map(item => item.Quantity))];
    const uniqueDollars = [...new Set(data.map(item => item.Dollars))];
    const uniquePrice = [...new Set(data.map(item => item.Price))];
    const uniquestockid = [...new Set(data.map(item => item.stockid))];
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000); // Clear message after 3 seconds
  };
  const filterResults = (event) => {
    event.preventDefault();
    const filteredData = data.filter((item) => {
      const searchText = searchTerm.toString().toLowerCase();
      return (
        (item.InventoryId?.toLowerCase().includes(searchText) || '') ||
        // (item.Store?.toLowerCase().includes(searchText) || '') ||
        (item.Brand?.toLowerCase().includes(searchText) || '') ||
        (item.Description?.toLowerCase().includes(searchText) || '') ||
        (item.Size?.toLowerCase().includes(searchText) || '') ||
        (item.PONumber?.toString().toLowerCase().includes(searchText) || '') ||
        (new Date(item.PODate)?.toLocaleDateString().includes(searchText) || '') ||
        (new Date(item.expirydate)?.toLocaleDateString().includes(searchText) || '') ||
        (item.City?.toLowerCase().includes(searchText) || '') ||
        (item.PurchasePrice?.toString().includes(searchText) || '') ||
        (item.Quantity?.toString().includes(searchText) || '') ||
        (item.Dollars?.toString().includes(searchText) || '') ||
        (item.Price?.toString().includes(searchText) || '') ||
        (item.stockid?.toString().includes(searchText) || '')
      );
    });
    setSearchResults(filteredData);
    setCurrentPage(1); // Reset to first page after filtering
  };
  
  

  const handleUpdate = (item) => {
    setEditableItem(item); 
    setEditableItems(item);// Set the item being edited
  };

  const handleaddtosale = async (item) => {
    try {
      await axios.post('/inventoryaddtosale', { email, item });
      handleSuccess('Item added to sale successfully!');
      // Refetch data after deletion
      fetchData();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post('/updateinventory', {editableItems, email});
      handleSuccess('Item updated successfully!');
      fetchData(); // Refresh data after update
      setEditableItem(null);
      // Reset editableItem state
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

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
      <div className="bg-red-100 p-6">
        <h2 className="text-4xl font-bold text-center mb-8">Deadstocks Management</h2>
        
        <form onSubmit={filterResults} className="mb-8">
        <input
            type="text"
            placeholder="Search by brand, description, email, etc."
            value={searchTerm}
            onChange={handleSearch}
            list="search-suggestions"
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
        />
        
        {/* const uniqueInventoryId = [...new Set(data.map(item => item.InventoryId))];
    const uniqueBrand = [...new Set(data.map(item => item.Brand))];
    const uniqueDescription = [...new Set(data.map(item => item.Description))];
    const uniqueSize = [...new Set(data.map(item => item.Size))];
    const uniquePONumber = [...new Set(data.map(item => item.PONumber))];
    const uniquePODate = [...new Set(data.map(item => item.PODate))];
    const uniqueexpirydate = [...new Set(data.map(item => item.expirydate))];
    const uniqueCity = [...new Set(data.map(item => item.City))];
    const uniquePurchasePrice = [...new Set(data.map(item => item.PurchasePrice))];
    const uniqueQuantity = [...new Set(data.map(item => item.Quantity))];
    const uniqueDollars = [...new Set(data.map(item => item.Dollars))];
    const uniquePrice = [...new Set(data.map(item => item.Price))]; */}
        <datalist id="search-suggestions">
        {uniqueInventoryId.map((id, index) => (
                <option key={index} value={id} />
            ))}
            {uniqueBrand.map((brand, index) => (
                <option key={index} value={brand} />
            ))}
            {uniqueDescription.map((Description, index) => (
                <option key={index} value={Description} />
            ))}
            {uniqueSize.map((Size, index) => (
                <option key={index} value={Size} />
            ))}
            {uniquePONumber.map((PONumber, index) => (
                <option key={index} value={PONumber} />
            ))}
            {uniqueCity.map((City, index) => (
                <option key={index} value={City} />
            ))}
            {uniquePurchasePrice.map((PurchasePrice, index) => (
                <option key={index} value={PurchasePrice} />
            ))}
            {uniqueQuantity.map((Quantity, index) => (
                <option key={index} value={Quantity} />
            ))}
            {uniquePODate.map((date, index) => (
                <option key={index} value={new Date(date).toLocaleDateString()} />
            ))}
            {uniqueexpirydate.map((date, index) => (
                <option key={index} value={new Date(date).toLocaleDateString()} />
            ))}
            {uniqueDollars.map((Dollars, index) => (
                <option key={index} value={Dollars} />
            ))}
            {uniquePrice.map((Price, index) => (
                <option key={index} value={Price} />
            ))}
            {uniquestockid.map((id, index) => (
                <option key={index} value={id} />
            ))}
        </datalist>
        <button type="submit" className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ml-2">Submit</button>
    </form>
    {successMessage && (
        <div className="fixed bottom-0 right-0 bg-green-500 text-white p-4 rounded-tl-lg">
          {successMessage}
        </div>
      )}
        <div className="flex justify-center mb-4">
          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mr-2">Previous</button>
          <button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastItem >= data.length} className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">Next</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
              <th className="bg-red-300 text-center">StockId</th>
                <th className="bg-red-300 text-center">InventoryId</th>
                {/* <th className="bg-red-300 text-center">Store</th> */}
                <th className="bg-red-300 text-center">Brand</th>
                <th className="bg-red-300 text-center">Description</th>
                <th className="bg-red-300 text-center">Size</th>
                <th className="bg-red-300 text-center">PONumber</th>
                <th className="bg-red-300 text-center">PODate</th>
                <th className="bg-red-300 text-center">ExpiryDate</th>
                <th className="bg-red-300 text-center">City</th>
                <th className="bg-red-300 text-center">PurchasePrice</th>
                <th className="bg-red-300 text-center">Quantity</th>
                <th className="bg-red-300 text-center">Dollars</th>
                <th className="bg-red-300 text-center">Selling price</th>
                <th className="bg-red-300 text-center">Added to Sale</th>
                <th className="bg-red-300 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-red-100'}>
                  <td className="text-center">{item.stockid}</td>
                  <td className="text-center">{item.InventoryId}</td>
                  {/* <td className="text-center">{item.Store}</td> */}
                  <td className="text-center">{item.Brand}</td>
                  <td className="text-center">{item.Description}</td>
                  <td className="text-center">{item.Size}</td>
                  <td className="text-center">{item.PONumber}</td>
                  <td className="text-center">{new Date(item.PODate).toLocaleDateString()}</td>
                  <td className="text-center">{new Date(item.expirydate).toLocaleDateString()}</td>
                  <td className="text-center">{item.City}</td>
                  <td className="text-center">
                    {
                      item.PurchasePrice
                    }
                  </td>
                  <td className="text-center">
                    {
                      item.Quantity
                    }
                  </td>
                  <td className="text-center" >
  {
    item.Dollars
}
</td>
<td className="text-center" style={{ cursor: editableItem === item ? 'text' : 'auto' }}>
  {editableItem === item ? (
    <input 
      type="text" 
      value={editableItems.Price} 
      onChange={(event) => handleChange(event, 'Price')} 
      className="border border-gray-300 rounded-md px-3 py-2 w-full"
    />
  ) : (
    item.Price
  )}
</td>
<td className="text-center">{item.addtosale}</td>
<td className="text-center">
  {editableItem === item ? (
    <React.Fragment>
      <button onClick={handleSubmit} className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mr-2">Submit</button>
      <button onClick={handleCancel} className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">Cancel</button>
    </React.Fragment>
  ) : (
    <React.Fragment>
      <button onClick={() => handleUpdate(item)} className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mr-2">Update</button>
      <button onClick={() => handleaddtosale(item)} className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">Add to Sale</button>
    </React.Fragment>
  )}
</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between mt-8"> 
          <div>
            Page {currentPage} of {Math.ceil(data.length / itemsPerPage)}
          </div>
          <div>
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mr-2">Previous</button>
            <button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastItem >= data.length} className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">Next</button>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default CompanyDeadstocks;
