import React from 'react';
import { Link } from 'react-router-dom';

function CompanyRegister() {
  return (
    <div>
      <h2>Register as Company</h2>
      <p>If already registered, login here:</p>
      <Link to="/companylogin">
        <button>Login as Company</button>
      </Link>
    </div>
  );
}

export default CompanyRegister;
