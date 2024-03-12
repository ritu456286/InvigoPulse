import React, { useState, useEffect } from 'react';
import axios from 'axios';

import ResponsiveAppBarcust from '../navbar/navbarcust';
const ProductOffers = () => {
  const [productSales, setProductSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [productQuantities, setProductQuantities] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const email=sessionStorage.getItem("email");
  const fetchProductSalesData = () => {
    axios.get('/productsoffers')
      .then(response => {
        // Update state with fetched data
        console.log(response.data)
        setProductSales(response.data);
        setSearchResults(response.data);
      })
      .catch(error => {
        console.error('Error fetching product sales data:', error);
      });
  };
  useEffect(() => {
    fetchProductSalesData(); // Fetch initially

    // Set up interval for auto-refresh (every 5 seconds)
    const interval = setInterval(fetchProductSalesData, 100000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const handleQuantityChange = (stockid,inventoryId, brand, Description, companyemail, action) => {
    const key = `${stockid}-${inventoryId}-${brand}-${Description}-${companyemail}`; // Concatenate the identifiers
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

  const handleAddToCart = (stockid,inventoryId, brand, Description, Price, City, companyemail, size) => {
    const key = `${stockid}-${inventoryId}-${brand}-${Description}-${companyemail}`;
    const quantity = productQuantities[key] || 0;
    axios.post('/addcart', { stockid, inventoryId, brand, Description, quantity, Price, City, email:email, companyemail,size })
      .then(response => {
        console.log('Product added to cart:', response.data);
        setShowPopup(true); // Show the popup
        setTimeout(() => {
          setShowPopup(false); // Hide the popup after 2 seconds
        }, 2000);
      })
      .catch(error => {
        console.error('Error adding product to cart:', error);
      });
  };
  const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = searchResults.slice(indexOfFirstItem, indexOfLastItem);
    const uniqueInventoryIds = [...new Set(productSales.map(item => item.InventoryID))];
    const uniquecompanyname = [...new Set(productSales.map(item => item.companyname))];
    const uniqueSize = [...new Set(productSales.map(item => item.Size))];
    const uniqueBrands = [...new Set(productSales.map(item => item.Brand))];
    const uniqueDescriptions = [...new Set(productSales.map(item => item.Description))];
    const uniquePrice = [...new Set(productSales.map(item => item.Price))];
    const uniqueCity = [...new Set(productSales.map(item => item.City))];
    

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle search input change
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    // Filter results based on search term
    const filterResults = (event) => {
        event.preventDefault();
        const filteredData = productSales.filter((item) => {
            // Convert all fields to lowercase for case-insensitive search
            const inventoryIdMatch = item.InventoryID && item.InventoryID.toLowerCase().includes(searchTerm.toLowerCase());  // Check if not null
            const companynameMatch = item.companyname && item.companyname.toLowerCase().includes(searchTerm.toLowerCase()); // Check if not null
            const SizeMatch = item.Size && item.Size.toString().toLowerCase().includes(searchTerm.toLowerCase()); // Check if not null
            const brandMatch = item.Brand && item.Brand.toLowerCase().includes(searchTerm.toLowerCase()); // Check if not null
            const descriptionMatch = item.Description && item.Description.toLowerCase().includes(searchTerm.toLowerCase()); // Check if not null
            const PriceMatch = item.Price && item.Price.toString().toLowerCase().includes(searchTerm.toLowerCase()); // Check if not null
            const CityMatch = item.City && item.City.toString().toLowerCase().includes(searchTerm.toLowerCase()); // Check if not null
            // Check if not null
    
            // Return true if any field matches the search term
            return (
              PriceMatch ||
                inventoryIdMatch ||
                companynameMatch ||
                brandMatch ||
                descriptionMatch ||
                SizeMatch ||
                CityMatch
            );
        });
        setSearchResults(filteredData);
        setCurrentPage(1); // Reset to first page after filtering
    };
  return (
    <div className="py-10 text-center">
    <ResponsiveAppBarcust />
    <h2 className="text-5xl bold m-10">Offers and Sales</h2>
    <form onSubmit={filterResults} className="m-6">
      <input
          type="text"
          placeholder="Search by brand, description, etc."
          value={searchTerm}
          onChange={handleSearch}
          list="search-suggestions"
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
      />
      
      
      <datalist id="search-suggestions">
      
      
          
          {uniqueBrands.map((brand, index) => (
              <option key={index} value={brand} />
          ))}
          {uniqueInventoryIds.map((id, index) => (
              <option key={index} value={id} />
          ))}
          {uniqueDescriptions.map((description, index) => (
              <option key={index} value={description} />
          ))}
          {uniqueSize.map((size, index) => (
              <option key={index} value={size} />
          ))}
          {uniquecompanyname.map((name, index) => (
              <option key={index} value={name} />
          ))}
          {uniqueCity.map((city, index) => (
              <option key={index} value={city} />
          ))}
          {uniquePrice.map((price, index) => (
              <option key={index} value={price} />
          ))}
          
      </datalist>
      <button type="submit" className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ml-2 mt-3">Submit</button>
  </form>
  {showPopup && (
        <div className="fixed bottom-0 right-0 bg-green-500 text-white p-2 rounded-tl-lg">
          Product added to cart successfully!
        </div>
      )}
      {/* Map over the currentItems array and render table rows */}

      <div className="flex flex-col gap-6">
        {currentItems.map((product, index) => (
          <div
            key={index}
            className="border border-gray-200 border-2 shadow-lg px-8 py-4"
            style={{ minWidth: '40vw' }}
          >
            <div className="flex justify-between items-end w-full">
              <div className="flex flex-col justify-end items-start gap-2">
              <div className="semibold text-lg">{product.InventoryID}</div>
                <div>
                  <span className="bold text-2xl">{product.companyname}</span>
                  <span className="text-xs text-gray-600">{product.Size}</span>
                </div>
                <div className="semibold text-lg">{product.Brand}</div>
                <div className="text-m light text-gray-800">
                  {product.Description}
                </div>
              </div>
              <div className="flex flex-col justify-end items-end gap-2">
                <div>{product.Price}</div>
                <div>{product.City}</div>
                <div>
                  <div>
                    <button
                      className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-sm text-sm px-2 py-0.5  dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                      onClick={() =>
                        handleQuantityChange(
                          product.stockid,
                          product.InventoryID,
                          product.Brand,
                          product.Description,
                          product.companyemail,
                          "decrement"
                        )
                      }
                    >
                      -
                    </button>
                    <span className="px-2 font-medium text-sm">
                      {productQuantities[
                        `${product.stockid}-${product.InventoryID}-${product.Brand}-${product.Description}-${product.companyemail}`
                      ] || 0}
                    </span>
                    <button
                      className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-sm text-sm px-2 py-0.5  mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                      onClick={() =>
                        handleQuantityChange(
                          product.stockid,
                          product.InventoryID,
                          product.Brand,
                          product.Description,
                          product.companyemail,
                          "increment"
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() =>
                      handleAddToCart(
                        product.stockid,
                        product.InventoryID,
                        product.Brand,
                        product.Description,
                        product.Price,
                        product.City,
                        product.companyemail,
                        product.Size
                      )
                    }
                    className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5  mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-4">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          Prev
        </button>
        <button
          onClick={() => paginate(currentPage + 1)} disabled={indexOfLastItem >= productSales.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductOffers;