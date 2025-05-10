import React from 'react'
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

// ⚠️ Si tu veux utiliser les icônes Bootstrap, assure-toi d'avoir ce lien dans index.html :
// <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">

const HeaderComponent = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      {/* Bouton menu drawer */}
      <button className="btn btn-dark me-3 d-lg-none">
        <i className="bi bi-list fs-3"></i> {/* Icône menu */}
      </button>

      {/* Titre ou logo */}
      <Link to="/admin/dashboard" className="navbar-brand">
        Stock Management System
      </Link>

      {/* Responsive toggler */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>

      {/* Navbar items */}
      <div className="collapse navbar-collapse" id="navbarNavDropdown">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link to="/admin/home" className="nav-link">
              <i className="bi bi-house-door"></i> Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/chat-bot" className="nav-link">
              <i className="bi bi-chat-dots"></i> Chat Bot Zone
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/profile" className="nav-link">
              <i className="bi bi-person-circle"></i> Profile
            </Link>
          </li>

          {/* Dropdown */}
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="ordersDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-box-seam"></i> Orders List
            </a>
            <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="ordersDropdown">
              <li>
                <Link to="/admin/created-orders" className="dropdown-item">
                  📋 Created Orders
                </Link>
              </li>
              <li>
                <Link to="/admin/completed-orders" className="dropdown-item">
                  ✅ Completed Orders
                </Link>
              </li>
              <li>
                <Link to="/admin/canceled-orders" className="dropdown-item">
                  ❌ Canceled Orders
                </Link>
              </li>
            </ul>
          </li>

          <li className="nav-item">
            <span className="nav-link">
              <i className="bi bi-person"></i> Username
            </span>
          </li>
          <li className="nav-item">
            <Link to="/login" className="btn btn-sm btn-outline-light ms-2">
              <i className="bi bi-box-arrow-right"></i> Logout
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default HeaderComponent
