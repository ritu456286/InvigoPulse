import React from 'react';
import { Link } from 'react-router-dom';

function CustomerRegister() {
  return (
    <div>
      <h2>Register as Customer</h2>
      <p>If already registered, login here:</p>
      <Link to="/customerlogin">
        <button>Login as Customer</button>
      </Link>
    </div>
  );
}

export default CustomerRegister;
