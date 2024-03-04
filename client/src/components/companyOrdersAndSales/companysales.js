import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResponsiveAppBar from '../navbar/navbar';
function CompanySales() {
    //   const [salesData, setSalesData] = useState([]);
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(100);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    // useEffect(() => {
    //     // Fetch data from the API endpoint
    //     axios.get('/companysales')
    //         .then(response => {
    //             setSalesData(response.data);
    //         })
    //         .catch(error => {
    //             console.error('Error fetching sales data:', error);
    //         });
    // }, []);
    useEffect(() => {
        fetchData();
    }, [currentPage, searchTerm]);

    const fetchData = async () => {
        try {
            const response = await axios.get('/companysales');
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

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle search input change
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    // Filter results based on search term
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
    return (
        <div>
            <ResponsiveAppBar/>
            <h2>Sales</h2>
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
                        <th>SalesQuantity</th>
                        <th>SalesDollars</th>
                        <th>SalesPrice</th>
                        <th>SalesDate</th>
                        <th>Volume</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((sale, index) => (
                        <tr key={index}>
                            <td>{sale.InventoryId}</td>
                            <td>{sale.Store}</td>
                            <td>{sale.Brand}</td>
                            <td>{sale.Description}</td>
                            <td>{sale.Size}</td>
                            <td>{sale.SalesQuantity}</td>
                            <td>{sale.SalesDollars}</td>
                            <td>{sale.SalesPrice}</td>
                            <td>{new Date(sale.SalesDate).toLocaleDateString()}</td>
                            <td>{sale.Volume}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CompanySales;
