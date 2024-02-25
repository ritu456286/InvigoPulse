import React from 'react';
import { Link } from 'react-router-dom';

function CompanyLogin() {
  return (
    <div>
      <h2>Login as Company</h2>
      <p>If not registered, register here:</p>
      <Link to="/companyregister">
        <button>Register as Company</button>
      </Link>
    </div>
  );
}

export default CompanyLogin;
