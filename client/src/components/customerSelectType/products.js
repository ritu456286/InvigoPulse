import React, { useState, useEffect } from "react";
import axios from "axios";
import "./product.css";
import ResponsiveAppBarcust from "../navbar/navbarcust";
import data from "../../json/customerSetOrder.json";
const ProductSalesPage = () => {
  const [productSales, setProductSales] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
    description: "",
    brand: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [productQuantities, setProductQuantities] = useState({});
  const email = sessionStorage.getItem("email");
  const fetchProductSalesData = () => {
    axios
      .get("/productssales")
      .then((response) => {
        // Update state with fetched data
        console.log(response.data);
        setProductSales(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product sales data:", error);
      });
  };
  useEffect(() => {
    setProductSales(data);
    //fetchProductSalesData(); // Fetch initially

    // Set up interval for auto-refresh (every 5 seconds)
    const interval = setInterval(fetchProductSalesData, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const handleQuantityChange = (
    inventoryId,
    brand,
    Description,
    companyemail,
    action
  ) => {
    const key = `${inventoryId}-${brand}-${Description}-${companyemail}`; // Concatenate the identifiers
    const currentQuantity = productQuantities[key] || 0;
    const totalQuantity = productSales.find(
      (product) =>
        product.InventoryID === inventoryId &&
        product.Brand === brand &&
        product.Description === Description &&
        product.companyemail === companyemail
    ).TotalQuantity;

    let updatedQuantity;
    if (action === "increment") {
      updatedQuantity = Math.min(currentQuantity + 1, totalQuantity);
    } else if (action === "decrement") {
      updatedQuantity = Math.max(currentQuantity - 1, 0);
    }

    setProductQuantities({ ...productQuantities, [key]: updatedQuantity });
  };

  const handleAddToCart = (
    inventoryId,
    brand,
    Description,
    Price,
    City,
    companyemail
  ) => {
    const key = `${inventoryId}-${brand}-${Description}-${companyemail}`;
    const quantity = productQuantities[key] || 0;
    axios
      .post("/addcart", {
        inventoryId,
        brand,
        Description,
        quantity,
        Price,
        City,
        email: email,
        companyemail,
      })
      .then((response) => {
        console.log("Product added to cart:", response.data);
      })
      .catch((error) => {
        console.error("Error adding product to cart:", error);
      });
  };

  const filteredProducts = productSales.filter((product) => {
    const descriptionMatch = product.Description.toLowerCase().includes(
      searchQuery.description.toLowerCase()
    );
    const brandMatch = product.Brand.toLowerCase().includes(
      searchQuery.brand.toLowerCase()
    );
    // const inventoryIdMatch = product.InventoryID.includes(searchQuery.inventoryId);
    return descriptionMatch && brandMatch;
  });

  // Logic to get current items for current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <div className="py-10 text-center">
      <ResponsiveAppBarcust />
      <h2 className="text-5xl bold m-10">Product Sales</h2>
      <form className="m-6">
        <label className="p-3 semibold text--xl">
          Description:
          <input
            type="text"
            value={searchQuery.description}
            onChange={(e) =>
              setSearchQuery({ ...searchQuery, description: e.target.value })
            }
          />
        </label>
        <label className="p-3 semibold text--xl">
          Brand:
          <input
            type="text"
            value={searchQuery.brand}
            onChange={(e) =>
              setSearchQuery({ ...searchQuery, brand: e.target.value })
            }
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

      {/* Map over the currentItems array and render table rows */}

      <div className="flex flex-col gap-6">
        {currentItems.map((product, index) => (
          <div
            key={index}
            className="border border-gray-200 border-2 shadow-lg px-8 py-4"
          >
            <div className="flex justify-between items-end w-full">
              <div className="flex flex-col justify-end items-start gap-2">
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
                <div>
                  <div>
                    <button
                      className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-sm text-sm px-2 py-0.5  dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                      onClick={() =>
                        handleQuantityChange(
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
                        `${product.InventoryID}-${product.Brand}-${product.Description}-${product.companyemail}`
                      ] || 0}
                    </span>
                    <button
                      className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-sm text-sm px-2 py-0.5  mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                      onClick={() =>
                        handleQuantityChange(
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
                        product.InventoryID,
                        product.Brand,
                        product.Description,
                        product.Price,
                        product.City,
                        product.companyemail
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
        <button onClick={prevPage} disabled={currentPage === 1}>
          Prev
        </button>
        <button
          onClick={nextPage}
          disabled={indexOfLastItem >= filteredProducts.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductSalesPage;
