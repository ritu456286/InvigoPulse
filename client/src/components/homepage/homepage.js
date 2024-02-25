import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Homepage() {
  const [data, setData] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/homepage');
        setData(response.data.message);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>InvigoPulse</h1>
      <p>{data}</p>
      <div>
        <Link to="/customerlogin">
          <button>Login as Customer</button>
        </Link>
        <Link to="/companylogin">
          <button>Login as Company</button>
        </Link>
      </div>
    </div>
  );
}

export default Homepage;
