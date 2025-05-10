// src/components/admin/Admin.jsx
import React from 'react'
import { Outlet } from 'react-router-dom'
import SidebarComponent from './SidebarComponent'

const Admin = () => {
  return (
    <div className="d-flex">
      <SidebarComponent />
      <main className="flex-grow-1 p-4">
        <Outlet />
      </main>
    </div>
  )
}

export default Admin

