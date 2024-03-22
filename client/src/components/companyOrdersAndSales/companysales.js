import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResponsiveAppBar from '../navbar/navbar';
import Footer from '../footer/footer';
function CompanySales() {
    //   const [salesData, setSalesData] = useState([]);
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(50);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const email=sessionStorage.getItem("email");
    
    useEffect(() => {
        fetchData();
    }, [currentPage, searchTerm]);

    const fetchData = async () => {
        try {
            const response = await axios.get('/companysales',{
                params: {
                  email: email
                }
              });
              console.log(response.data)
            setData(response.data);
            setSearchResults(response.data); // Set search results initially to all data
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Calculate index of the first and last item to be displayed on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = searchResults.slice(indexOfFirstItem, indexOfLastItem);
    const uniqueEmails = [...new Set(data.map(item => item.customeremail))];
    const uniqueInventoryIds = [...new Set(data.map(item => item.InventoryId))];
    const uniqueStores = [...new Set(data.map(item => item.Store))];
    const uniqueBrands = [...new Set(data.map(item => item.Brand))];
    const uniqueDescriptions = [...new Set(data.map(item => item.Description))];
    const uniqueSizes = [...new Set(data.map(item => item.Size))];
    const uniqueSalesQuantities = [...new Set(data.map(item => item.SalesQuantity))];
    const uniqueSalesDollars = [...new Set(data.map(item => item.SalesDollars))];
    const uniqueSalesPrices = [...new Set(data.map(item => item.SalesPrice))];
    const uniqueSalesDates = [...new Set(data.map(item => item.SalesDate))];
    const uniqueVolumes = [...new Set(data.map(item => item.Volume))];

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle search input change
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    // Filter results based on search term
    const filterResults = (event) => {
        event.preventDefault();
        const filteredData = data.filter((item) => {
            // Convert all fields to lowercase for case-insensitive search
            const emailMatch = item.customeremail && item.customeremail.toLowerCase().includes(searchTerm.toLowerCase()); // Check if not null
            const inventoryIdMatch = item.InventoryId && item.InventoryId.toLowerCase().includes(searchTerm.toLowerCase()); // Check if not null
            const storeMatch = item.Store && item.Store.toString().toLowerCase().includes(searchTerm.toLowerCase()); // Check if not null
            const brandMatch = item.Brand && item.Brand.toLowerCase().includes(searchTerm.toLowerCase()); // Check if not null
            const descriptionMatch = item.Description && item.Description.toLowerCase().includes(searchTerm.toLowerCase()); // Check if not null
            const sizeMatch = item.Size && item.Size.toLowerCase().includes(searchTerm.toLowerCase()); // Check if not null
            const salesQuantityMatch = item.SalesQuantity && item.SalesQuantity.toString().toLowerCase().includes(searchTerm.toLowerCase()); // Check if not null
            const salesDollarsMatch = item.SalesDollars && item.SalesDollars.toString().toLowerCase().includes(searchTerm.toLowerCase()); // Check if not null
            const salesPriceMatch = item.SalesPrice && item.SalesPrice.toString().toLowerCase().includes(searchTerm.toLowerCase()); // Check if not null
            const salesDateMatch = item.SalesDate && new Date(item.SalesDate).toLocaleDateString().toLowerCase().includes(searchTerm.toLowerCase()); // Check if not null
            const volumeMatch = item.Volume && item.Volume.toString().toLowerCase().includes(searchTerm.toLowerCase()); // Check if not null
    
            // Return true if any field matches the search term
            return (
                emailMatch ||
                inventoryIdMatch ||
                storeMatch ||
                brandMatch ||
                descriptionMatch ||
                sizeMatch ||
                salesQuantityMatch ||
                salesDollarsMatch ||
                salesPriceMatch ||
                salesDateMatch ||
                volumeMatch
            );
        });
        setSearchResults(filteredData);
        setCurrentPage(1); // Reset to first page after filtering
    };
    
    return (
        <div className="bg-red-100 h-full">
    <ResponsiveAppBar/>
    <h2 className="text-4xl font-bold text-center mb-8">Sales</h2>
    <form onSubmit={filterResults} className="mb-8">
        <input
            type="text"
            placeholder="Search by brand, description, email, etc."
            value={searchTerm}
            onChange={handleSearch}
            list="search-suggestions"
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
        />
        
        
        <datalist id="search-suggestions">
        {uniqueEmails.map((email, index) => (
                <option key={index} value={email} />
            ))}
            {uniqueInventoryIds.map((id, index) => (
                <option key={index} value={id} />
            ))}
            {uniqueStores.map((store, index) => (
                <option key={index} value={store} />
            ))}
            {uniqueBrands.map((brand, index) => (
                <option key={index} value={brand} />
            ))}
            {uniqueDescriptions.map((description, index) => (
                <option key={index} value={description} />
            ))}
            {uniqueSizes.map((size, index) => (
                <option key={index} value={size} />
            ))}
            {uniqueSalesQuantities.map((quantity, index) => (
                <option key={index} value={quantity} />
            ))}
            {uniqueSalesDollars.map((dollars, index) => (
                <option key={index} value={dollars} />
            ))}
            {uniqueSalesPrices.map((price, index) => (
                <option key={index} value={price} />
            ))}
            {uniqueSalesDates.map((date, index) => (
                <option key={index} value={new Date(date).toLocaleDateString()} />
            ))}
            {uniqueVolumes.map((volume, index) => (
                <option key={index} value={volume} />
            ))}
        </datalist>
        <button type="submit" className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ml-2">Submit</button>
    </form>
    <div className="flex justify-center mb-8">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mr-2">Previous</button>
        <button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastItem >= data.length} className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">Next</button>
    </div>
    <div className="overflow-x-auto"> {/* Enable horizontal scrolling for smaller screens */}
        <table className="w-full">
            <thead>
                <tr>
                    <th className="bg-red-300 text-center py-4">User Email</th>
                    <th className="bg-red-300 text-center py-4">InventoryId</th>
                    {/* <th className="bg-red-300 text-center py-4">Store</th> */}
                    <th className="bg-red-300 text-center py-4">Brand</th>
                    <th className="bg-red-300 text-center py-4">Description</th>
                    <th className="bg-red-300 text-center py-4">Size</th>
                    <th className="bg-red-300 text-center py-4">SalesQuantity</th>
                    <th className="bg-red-300 text-center py-4">SalesDollars</th>
                    <th className="bg-red-300 text-center py-4">SalesPrice</th>
                    <th className="bg-red-300 text-center py-4">SalesDate</th>
                    <th className="bg-red-300 text-center py-4">Customer Review</th>
                </tr>
            </thead>
            <tbody>
                {currentItems.map((sale, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-red-100'}>
                        <td className="text-center">{sale.customeremail}</td>
                        <td className="text-center">{sale.InventoryId}</td>
                        {/* <td className="text-center">{sale.Store}</td> */}
                        <td className="text-center">{sale.Brand}</td>
                        <td className="text-center">{sale.Description}</td>
                        <td className="text-center">{sale.Size}</td>
                        <td className="text-center">{sale.SalesQuantity}</td>
                        <td className="text-center">{sale.SalesDollars}</td>
                        <td className="text-center">{sale.SalesPrice}</td>
                        <td className="text-center">{new Date(sale.SalesDate).toLocaleDateString()}</td>
                        <td className="text-center">{sale.review}</td>
                        {/* <td className="text-center">{sale.Volume}</td> */}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    <Footer/>
</div>
    );
}

export default CompanySales;
