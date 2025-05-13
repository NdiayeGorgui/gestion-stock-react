// src/components/admin/SidebarComponent.jsx
import React from 'react'
import { Link } from 'react-router-dom'

const SidebarComponent = () => {
  return (
    <div className="bg-light border-end p-3" style={{ width: '250px', minHeight: '100vh' }}>
      <h4 className="mb-4">Admin Panel</h4>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className="nav-link" to="/admin/dashboard">📊 Dashboard</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/admin/products">📦 Manage Products</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/admin/customers">👤 Manage Customers</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/admin/create-order">🛒 Create Orders</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/admin/ships">🚚 Ship Orders</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/admin/delivers">📬 Deliver Orders</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/admin/bills">💰 View Bills</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/admin/payments">💳 View Payments</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/admin/order-events">📬 View Order Events</Link>
        </li>

      </ul>
    </div>
  )
}

export default SidebarComponent

