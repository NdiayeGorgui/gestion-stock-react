import React, { useState } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError('Both fields are required.');
      return;
    }

    // Simuler une connexion
    console.log('Logging in with:', formData);
    setError('');
  };

  return (
    <div className="d-flex align-items-start justify-content-center vh-100 bg-light pt-5">
      <div className="card shadow-lg p-4 mt-5" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <h3>Welcome Back</h3>
          <p className="text-muted">Please log in to your account</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              name="username"
              className="form-control"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">Log In</button>
          </div>
        </form>

        <div className="text-center mt-3">
          <a href="#">Forgot password?</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
