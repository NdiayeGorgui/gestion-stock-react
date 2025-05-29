import React from 'react';
import { useAuth } from '../hooks/useAuth';


const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

if (loading) {
  return (
    <div className="text-center mt-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
if (!isAuthenticated) {
    return (
      <div className="text-center mt-5">
        <h2 className="text-danger">401 - Unauthorized</h2>
        <p >You must be logged in to access this page.</p>
      </div>
    );
  }
  if (!isAdmin) {
    return (
      <div className="text-center mt-5">
        <h2 className="text-danger">403 - Forbidden</h2>
        <p >You do not have the required permissions to access this page.</p>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
