import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './product.css';
import ResponsiveAppBarcust from '../navbar/navbarcust';
const ProductSalesPage = () => {
  const [productSales, setProductSales] = useState([]);
  const [searchQuery, setSearchQuery] = useState({ description: '', brand: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [productQuantities, setProductQuantities] = useState({});
  const email=sessionStorage.getItem("email");
  const fetchProductSalesData = () => {
    axios.get('/productssales')
      .then(response => {
        // Update state with fetched data
        console.log(response.data)
        setProductSales(response.data);
      })
      .catch(error => {
        console.error('Error fetching product sales data:', error);
      });
  };
  useEffect(() => {
    fetchProductSalesData(); // Fetch initially

    // Set up interval for auto-refresh (every 5 seconds)
    const interval = setInterval(fetchProductSalesData, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const handleQuantityChange = (inventoryId, brand, Description, companyemail, action) => {
    const key = `${inventoryId}-${brand}-${Description}-${companyemail}`; // Concatenate the identifiers
    const currentQuantity = productQuantities[key] || 0;
    const totalQuantity = productSales.find(product => product.InventoryID === inventoryId && product.Brand === brand && product.Description === Description && product.companyemail === companyemail).TotalQuantity;

    let updatedQuantity;
    if (action === 'increment') {
      updatedQuantity = Math.min(currentQuantity + 1, totalQuantity);
    } else if (action === 'decrement') {
      updatedQuantity = Math.max(currentQuantity - 1, 0);
    }

    setProductQuantities({ ...productQuantities, [key]: updatedQuantity });
  };

  const handleAddToCart = (inventoryId, brand, Description, Price, City, companyemail) => {
    const key = `${inventoryId}-${brand}-${Description}-${companyemail}`;
    const quantity = productQuantities[key] || 0;
    axios.post('/addcart', { inventoryId, brand, Description, quantity, Price, City, email:email, companyemail })
      .then(response => {
        console.log('Product added to cart:', response.data);
      })
      .catch(error => {
        console.error('Error adding product to cart:', error);
      });
  };

  const filteredProducts = productSales.filter(product => {
    const descriptionMatch = product.Description.toLowerCase().includes(searchQuery.description.toLowerCase());
    const brandMatch = product.Brand.toLowerCase().includes(searchQuery.brand.toLowerCase());
    // const inventoryIdMatch = product.InventoryID.includes(searchQuery.inventoryId);
    return descriptionMatch && brandMatch;
  });

  // Logic to get current items for current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <div >
      <ResponsiveAppBarcust />
      <h2>Product Sales</h2>
      <form>
        <label>
          Description:
          <input
            type="text"
            value={searchQuery.description}
            onChange={(e) => setSearchQuery({ ...searchQuery, description: e.target.value })}
          />
        </label>
        <label>
          Brand:
          <input
            type="text"
            value={searchQuery.brand}
            onChange={(e) => setSearchQuery({ ...searchQuery, brand: e.target.value })}
          />
        </label>
        {/* <label>
          Inventory:
          <input
            type="text"
            value={searchQuery.inventoryId}
            onChange={(e) => setSearchQuery({ ...searchQuery, inventoryId: e.target.value })}
          />
        </label> */}
      </form>
      <table className="product-table">
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Inventory</th>
            <th>Brand</th>
            <th>Description</th>
            <th>Size</th>
            <th>City</th>
            <th>Sales Price</th>
            
            <th>Quantity</th>
            
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {/* Map over the currentItems array and render table rows */}
          {currentItems.map((product, index) => (
            <React.Fragment key={index}>
              <tr>
                <td>{product.companyname}</td>
                <td>{product.InventoryID}</td>
                <td>{product.Brand}</td>
                <td>{product.Description}</td>
                <td>{product.Size}</td>
                <td>{product.City}</td>
                <td>{product.Price}</td>
                <td>
                  <div>
                    <button onClick={() => handleQuantityChange(product.InventoryID, product.Brand, product.Description, product.companyemail,  'decrement')}>-</button>
                    <span>{productQuantities[`${product.InventoryID}-${product.Brand}-${product.Description}-${product.companyemail}`] || 0}</span>
                    <button onClick={() => handleQuantityChange(product.InventoryID, product.Brand, product.Description, product.companyemail,  'increment')}>+</button>
                  </div>
                </td>
                <td>
                  <button onClick={() => handleAddToCart(product.InventoryID, product.Brand, product.Description, product.Price,product.City, product.companyemail)}>Add to Cart</button>
                </td>
              </tr>
              <tr className="line-row">
                <td colSpan="6"><hr /></td>
              </tr>
            </React.Fragment>
          ))}


        </tbody>
      </table>
      <div>
        <button onClick={prevPage} disabled={currentPage === 1}>Prev</button>
        <button onClick={nextPage} disabled={indexOfLastItem >= filteredProducts.length}>Next</button>
      </div>
    </div>
  );
};

export default ProductSalesPage;