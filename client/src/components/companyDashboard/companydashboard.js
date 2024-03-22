import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart } from '@mui/x-charts/BarChart';
import Calendar from 'react-calendar';
import Clock from 'react-clock';
import Navbar from '../navbar/navbar';
// import DigitalClock from 'react-digital-clock';
import 'tailwindcss/tailwind.css';
import Footer from '../footer/footer';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
function CompanyPage() {
  const email = sessionStorage.getItem('email');
  const [dashboardData, setDashboardData] = useState(null);
  // const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/dashboardcompany', {
        params: {
          email: email,
        },
      });
      console.log(response.data)
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  if (!dashboardData) {
    return <div>Loading...</div>;
  }

  const {
    total_unique_products,
    total_sales,
    total_profit,
    brand_vs_sales,
    inventory_vs_sales,
    sales_vs_date,
    city_vs_sales,
    city_vs_quantity,
    stock_expiry,
    reviews, recent_sales,
  } = dashboardData;

  const filteredDataa = recent_sales.map((item) => ({
    customerEmail: item.customerEmail,
    Brand: item.Brand,
    Description: item.Description,
    Quantity: item.Quantity,
  }));
  const databrand = Object.entries(brand_vs_sales).map(([label, value], index) => ({
    id: index,
    value: value,
    label: label,
  }));
  const dataCitySales = Object.entries(city_vs_sales).map(([label, value], index) => ({
    id: index,
    value: value,
    label: label,
  }));

  const dataCityQuantity = Object.entries(city_vs_quantity).map(([label, value], index) => ({
    id: index,
    value: value,
    label: label,
  }));



  // // Dummy data
  const dataa = [
    { expiryDate: '2024-03-09', poNumber: 'PO123', quantity: 10 },
    { expiryDate: '2024-03-09', poNumber: 'PO456', quantity: 5 },
    { expiryDate: '2024-03-12', poNumber: 'PO789', quantity: 7 },
    // Add more data as needed
  ];
  console.log(stock_expiry)
  const onChange = date => {
    setSelectedDate(date);
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0]; // Format date as yyyy-mm-dd
      const isExpiring = stock_expiry.some(item => {
        // Extract yyyy-mm-dd part from expiryDate
        const expiryDateString = item.expiryDate.split('T')[0];
        return expiryDateString === dateString;
      });
      return isExpiring ? <p>Stock Expired</p> : null;
    }
  };

  const filteredData = stock_expiry.filter(item => {
    // Assuming data structure is an array of objects with fields: expiryDate, poNumber, and quantity
    return (
      new Date(item.expiryDate).toDateString() === selectedDate.toDateString()
    );
  });

  const series = [
    {
      data: Object.values(sales_vs_date),
      color: '#d10000',
    },
  ]
  // console.log(Object.values(sales_vs_date).index)
  return (
    <div><Navbar />
      {/* <div className="bg-red-100 max-w-screen max-h-screen  rounded-lg shadow-lg"> */}

      <div className=" bg-white pb-12 rounded-lg shadow-lg">
        <h1 className="text-4xl text-center font-bold text-black py-4 bg-red-100  ">Company Dashboard</h1>
        <div className="flex flex-wrap justify-around mt-10 mb-10">
          <div className="bg-red-300 m-2 p-4 w-64 rounded-lg shadow-lg hover:scale-105">
            <h3 className="text-xl font-bold text-center">Total Unique Products</h3>
            <p className="text-lg text-center"> {total_unique_products}</p>
          </div>
          <div className="bg-red-300 m-2 p-4 w-64 rounded-lg shadow-lg hover:scale-105">
            <h3 className="text-xl font-bold text-center">Total Sales</h3>
            <p className="text-lg text-center"> USD {total_sales}</p>
          </div>
          <div className="bg-red-300 m-2 p-4 w-64 rounded-lg shadow-lg hover:scale-105">
            <h3 className="text-xl font-bold text-center">Total Profit</h3>
            <p className="text-lg text-center">USD {total_profit}</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-around mt-10 mb-10 bg-red-100 p-10">
          <div className="w-400 text-center shadow-xl hover:scale-105 bg-white rounded-lg mb-5 ">
            <h3 className="text-xl font-bold text-center">Sales VS Date</h3>
            {sales_vs_date && Object.keys(sales_vs_date).length > 0 ? (
  <BarChart
    xAxis={[
      {
        id: 'barCategories',
        data: Object.keys(sales_vs_date),
        scaleType: 'band',
      },
    ]}
    series={[
      {
        data: Object.values(sales_vs_date),
        color: '#d10000',
      },
    ]}
    width={350}
    height={250}
  />
) : (
  <p>NO sales Yet</p>
)}

          </div>
          {/* <div className="w-400 text-center shadow-lg hover:scale-105 bg-white rounded-lg mb-5">
      <h3 className="text-xl font-bold text-center">Sales VS Inventory</h3>
      <BarChart
        xAxis={[
          {
            id: 'barCategories',
            data: Object.keys(inventory_vs_sales),
            scaleType: 'band',
          },
        ]}
        series={[
          {
            data: Object.values(inventory_vs_sales),
            color: '#750000',
          },
        ]}
        width={350}
        height={250}
      />
    </div> */}
          <div className="w-400 text-center shadow-lg hover:scale-105  bg-white rounded-lg mb-5">
            <h3 className="text-xl font-bold text-center">City Vs Quantity</h3>
            <PieChart
              series={[
                {
                  data: dataCityQuantity,
                },
              ]}
              width={350}
              height={200}
            />
          </div>
          <div className="overflow-auto flex-shrink-45 m-2 rounded-lg  bg-white shadow-lg border border-black-400 hover:scale-105" style={{ minwidth: '40vw', maxHeight: '300px' }}>
            <div className="p-4">
              <h3 className="text-lg font-bold text-center text-red-900 py-2 rounded-t-lg">Reviews</h3>
              <table className="table-auto w-full mt-2 text-sm">
                <thead>
                  <tr>
                    <th className="border px-3 py-1 bg-red-300">Customer Email</th>
                    <th className="border px-3 py-1 bg-red-300">OrderId</th>
                    <th className="border px-3 py-1 bg-red-300">Review</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((item, index) => (
                    <tr key={index}>
                      <td className="border px-3 py-1">{item.customerEmail}</td>
                      <td className="border px-3 py-1">{item.orderid}</td>
                      <td className="border px-3 py-1">{item.review}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div><div className="flex flex-wrap justify-around mt-10 mb-10 p-10">
          <div className="w-400 text-center shadow-lg hover:scale-105 bg-red-100 rounded-lg mb-5">
            <h3 className="text-xl font-bold text-center">Sales VS Brand</h3>
            {brand_vs_sales && Object.keys(brand_vs_sales).length > 0 ? (
  <BarChart
    xAxis={[
      {
        id: 'barCategories',
        data: Object.keys(brand_vs_sales),
        scaleType: 'band',
      },
    ]}
    series={[
      {
        data: Object.values(brand_vs_sales),
        color: '#d10000',
      },
    ]}
    width={350}
    height={250}
  />
) : (
  <p>NO sales Yet</p>
)}

          </div>

          <div className="w-400 text-center shadow-lg hover:scale-105 bg-red-100 rounded-lg mb-5">
            <h3 className="text-xl font-bold text-center">City VS Sales</h3>
            {dataCitySales && dataCitySales.length > 0 ? (
              <PieChart
                series={[
                  {
                    data: dataCitySales,
                  },
                ]}
                width={350}
                height={200}
              />
            ) : (
              <p>NO sales Yet</p>
            )}

          </div>
          <div className="overflow-auto flex-shrink-45 bg-red-200 m-2 rounded-lg shadow-lg border border-red-400 hover:scale-105" style={{ minwidth: '40vw', maxHeight: '300px' }}>
            <div className="p-4">
              <h3 className="text-lg font-bold text-center text-red-900 bg-red-300 py-2 rounded-t-lg">Recent Sales</h3>
              <table className="table-auto w-full mt-2 text-sm">
                <thead>
                  <tr>
                    <th className="border px-3 py-1 bg-red-300">Customer Email</th>
                    {/* <th className="border px-3 py-1 bg-red-300">Brand</th> */}
                    <th className="border px-3 py-1 bg-red-300">Description</th>
                    <th className="border px-3 py-1 bg-red-300">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDataa.map((item, index) => (
                    <tr key={index}>
                      <td className="border px-3 py-1">{item.customerEmail}</td>
                      {/* <td className="border px-3 py-1">{item.Brand}</td> */}
                      <td className="border px-3 py-1">{item.Description}</td>
                      <td className="border px-3 py-1">{item.Quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* <div className="flex flex-wrap justify-around  bg-red-100 p-10">
    <div className="w-700 text-center shadow-lg hover:scale-105 bg-white">
      <h3 className="text-xl font-bold text-center">Sales VS Date</h3>
      
       <LineChart
      xAxis={[{ data: [1, 2, 3, 5, 8, 10]  }]}
      series={[
        {
          data: [2, 5.5, 2, 8.5, 1.5, 5],
          color: 'red',
        },
      ]}
      width={800}
      height={300}
    />
    </div>
    
    
    </div> */}
        {/* </div> */}</div>
      <div className="flex flex-col items-center justify-center bg-red-100 p-5">
        <h1 className="text-3xl font-bold mb-5">Expiry Calendar</h1>
        <div className="flex flex-col md:flex-row items-center justify-center gap-20 md:gap-20 md:gap-x-80">
          <div className="w-full md:w-1/2 transition-transform transform hover:scale-105">
            <div className="bg-white rounded-lg p-5 shadow-md border border-transparent hover:border-gray-300">
              <Calendar
                onChange={onChange}
                value={selectedDate}
                tileContent={tileContent}
                className="mx-auto"
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 flex items-center justify-center hover:scale-105">
            <div className="bg-white rounded-lg p-5 shadow-md border border-transparent hover:border-gray-300 text-center">
              <h2 className="text-xl font-semibold mb-3">Stocks Expiring on {selectedDate.toDateString()}</h2>
              <ul>
                {filteredData.map((item, index) => (
                  <li key={index} className="mb-3">
                    <p className="font-semibold">Stock Id: {item.stockid}</p>
                    <p>Quantity: {item.Quantity}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer/>


      {/* <div className="flex flex-wrap justify-around mt-10 mb-10">
  
  
</div> */}

    </div>



  );
}

export default CompanyPage;
