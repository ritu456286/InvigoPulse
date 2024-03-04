import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, PieChart } from '@mui/x-charts/BarChart';
import Navbar from '../navbar/navbar';
function CompanyPage() {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/dashboardcompany');
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
  } = dashboardData;

  const databrand = Object.entries(brand_vs_sales).map(([label, value], index) => ({
    id: index,
    value: value,
    label: label,
  }));

  return (
    <div>
      <Navbar/>
      <h2>Company Dashboard</h2>
      <div className="card">
        <h3>Total Unique Products</h3>
        <p>{total_unique_products}</p>
      </div>
      <div className="card">
        <h3>Total Sales</h3>
        <p>{total_sales}</p>
      </div>
      <div className="card">
        <h3>Total Profit</h3>
        <p>{total_profit}</p>
      </div>
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
        },
      ]}
      width={500}
      height={300}
    />
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
        },
      ]}
      width={500}
      height={300}
    />
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
        },
      ]}
      width={500}
      height={300}
    />
      {/* <div className="chart">
        <h3>Brand vs Sales</h3>
        <Bar data={brandVsSalesData} />
      </div>

      <div className="chart">
        <h3>Inventory vs Sales</h3>
        <Bar data={inventoryVsSalesData} />
      </div>

      <div className="chart">
        <h3>Sales vs Date</h3>
        <Line data={salesVsDateData} />
      </div> */}
    </div>
  );
}

export default CompanyPage;

