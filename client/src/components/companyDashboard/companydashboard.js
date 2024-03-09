import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart } from '@mui/x-charts/BarChart';
import Calendar from 'react-calendar';
import Clock from 'react-clock';
import Navbar from '../navbar/navbar';
// import DigitalClock from 'react-digital-clock';
import 'tailwindcss/tailwind.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import { PieChart } from '@mui/x-charts/PieChart';
function CompanyPage() {
  const email = sessionStorage.getItem('email');
  const [dashboardData, setDashboardData] = useState(null);
  const [date, setDate] = useState(new Date());

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
  } = dashboardData;

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
  const colors = ['#d10000', '#ff8a8a'];
  const dataValues = Object.values(sales_vs_date);


const series = [
  {
    data: Object.values(sales_vs_date),
    color: '#d10000',
  },
]
// console.log(Object.values(sales_vs_date).index)
  return (
    <div className="bg-white max-w-screen">
  <Navbar />
  <h1 className="text-4xl text-center font-bold text-black py-4 bg-gray-300">Company Dashboard</h1>
  <div className="flex flex-wrap justify-around mt-10 mb-10">
    <div className="bg-red-300 m-2 p-4 w-64 rounded-lg shadow-lg hover:scale-105">
      <h3 className="text-xl font-bold text-center">Total Unique Products</h3>
      <p className="text-lg text-center">{total_unique_products}</p>
    </div>
    <div className="bg-red-300 m-2 p-4 w-64 rounded-lg shadow-lg hover:scale-105">
      <h3 className="text-xl font-bold text-center">Total Sales</h3>
      <p className="text-lg text-center">{total_sales}</p>
    </div>
    <div className="bg-red-300 m-2 p-4 w-64 rounded-lg shadow-lg hover:scale-105">
      <h3 className="text-xl font-bold text-center">Total Profit</h3>
      <p className="text-lg text-center">{total_profit}</p>
    </div>
  </div>

  <div className="flex flex-wrap justify-around mt-10 mb-10 bg-gray-300 p-8">
    <div className="w-400 text-center shadow-lg hover:scale-105 bg-white">
      <h3 className="text-xl font-bold text-center">Sales VS Date</h3>
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
        width={400}
        height={250}
      />
    </div>
    <div className="w-400 text-center shadow-lg hover:scale-105 bg-white">
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
        width={400}
        height={250}
      />
    </div>
    <div className="w-400 text-center shadow-lg hover:scale-105 bg-white">
      <h3 className="text-xl font-bold text-center">Sales VS Brand</h3>
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
        width={400}
        height={250}
      />
    </div></div><div className="flex flex-wrap justify-around mt-10 mb-10">
    <div className="w-400 text-center shadow-lg hover:scale-105 bg-gray-300">
      <h3 className="text-xl font-bold text-center">City Vs Quantity</h3>
      <PieChart
        series={[
          {
            data: dataCityQuantity,
          },
        ]}
        width={400}
        height={200}
      />
    </div>
    <div className="w-400 text-center shadow-lg hover:scale-105 bg-gray-300">
      <h3 className="text-xl font-bold text-center">City VS Sales</h3>
      <PieChart
        series={[
          {
            data: dataCitySales,
          },
        ]}
        width={400}
        height={200}
      />
    </div>
  </div>
  {/* <div className="flex flex-wrap justify-around mt-10 mb-10">
    <div className="w-700 text-center shadow-lg hover:scale-105">
      <h3 className="text-xl font-bold text-center">Sales VS Date</h3>
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
        width={700}
        height={300}
      />
    </div>
    <div className="w-400 text-center shadow-lg hover:scale-105">
      <h3 className="text-xl font-bold text-center">City VS Sales</h3>
      <PieChart
        series={[
          {
            data: dataCitySales,
          },
        ]}
        width={400}
        height={200}
      />
    </div>
    
    </div> */}
</div>


  );
}

export default CompanyPage;
