import React from 'react';
import { Link } from 'react-router-dom';

function CustomerLogin() {
  return (
    <div>
      <h2>Login as Customer</h2>
      <p>If not registered, register here:</p>
      <Link to="/customerregister">
        <button>Register as Customer</button>
      </Link>
    </div>
  );
}

export default CustomerLogin;
