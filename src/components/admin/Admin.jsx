import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DrawerComponent from './DrawerComponent';
import HeaderComponent from '../home/HeaderComponent';

const Admin = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  return (
    <>
      <HeaderComponent toggleDrawer={toggleDrawer} />

      <div className="d-flex">
        <DrawerComponent isDrawerOpen={drawerOpen} setIsDrawerOpen={setDrawerOpen} />

        <div
          className="flex-grow-1"
          style={{
          //  marginLeft: drawerOpen ? 250 : 0,
            transition: 'margin 0.3s',
            padding: '70px 20px 20px 20px', // espace sous navbar
            width: '100%',
          }}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Admin;
