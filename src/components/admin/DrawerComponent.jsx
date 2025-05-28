import React from 'react';
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useKeycloak } from '@react-keycloak/web';


import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Menu,
  MenuItem,
  Button,
  ListItemIcon,
  useMediaQuery,
  Divider,
} from '@mui/material';

import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Chat as ChatIcon,
  AccountCircle as AccountCircleIcon,
  ExitToApp as ExitToAppIcon,
  Inbox as InboxIcon,
  MoreVert as MoreVertIcon,
  PersonPinCircleOutlined,
} from '@mui/icons-material';

import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentIcon from '@mui/icons-material/Payment';
import EventNoteIcon from '@mui/icons-material/EventNote';




const drawerWidth = 250;

const DrawerComponent = ({ isDrawerOpen, setIsDrawerOpen }) => {
  const { keycloak } = useKeycloak();
  const [anchorElOrders, setAnchorElOrders] = React.useState(null);
  const [anchorElMobileMenu, setAnchorElMobileMenu] = React.useState(null);
  const isSmallScreen = useMediaQuery('(max-width:768px)');

  const user = keycloak?.tokenParsed;
  const firstname = user?.given_name || 'Utilisateur';


  React.useEffect(() => {
    if (isSmallScreen) {
      setIsDrawerOpen(false); // 👈 ferme automatiquement le drawer sur mobile
    } else {
      setIsDrawerOpen(true); // 👈 ouvre automatiquement sur écran large
    }
  }, [isSmallScreen]);


  const handleOrdersClick = (event) => {
    setAnchorElOrders(event.currentTarget);
  };

  const handleOrdersClose = () => {
    setAnchorElOrders(null);
  };

  const handleMobileMenuClick = (event) => {
    setAnchorElMobileMenu(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setAnchorElMobileMenu(null);
  };

  const handleLinkClick = () => {
    if (isSmallScreen) {
      setIsDrawerOpen(false);
    }
  };


  return (
    <>
      {/* HEADER */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#000000',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Trocady Management System
          </Typography>

          {isSmallScreen ? (
            <>
              <IconButton color="inherit" onClick={handleMobileMenuClick}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorElMobileMenu}
                open={Boolean(anchorElMobileMenu)}
                onClose={handleMobileMenuClose}
              >
                <MenuItem component={Link} to="/admin/home" onClick={handleMobileMenuClose}>
                  <HomeIcon sx={{ mr: 1 }} /> Home
                </MenuItem>
                <MenuItem onClick={handleOrdersClick}>
                  <Box display="flex" alignItems="center" width="100%">
                    <InboxIcon sx={{ mr: 1 }} />
                    <Box flexGrow={1}>Orders List</Box>
                    <ExpandMoreIcon />
                  </Box>
                </MenuItem>
                <MenuItem component={Link} to="/admin/chat-bot" onClick={handleMobileMenuClose}>
                  <ChatIcon sx={{ mr: 1 }} /> Chat Bot Zone
                </MenuItem>
                <MenuItem component={Link} to="/admin/profile" onClick={handleMobileMenuClose}>
                  <AccountCircleIcon sx={{ mr: 1 }} /> Profile
                </MenuItem>
                <MenuItem component={Link} onClick={handleMobileMenuClose}>
                  <AccountCircleIcon sx={{ mr: 1 }} /> {firstname}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleMobileMenuClose();
                    keycloak.logout({ redirectUri: window.location.origin });
                  }}
                >
                  <ExitToAppIcon sx={{ mr: 1 }} /> Logout
                </MenuItem>

              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/admin/home" startIcon={<HomeIcon />}>
                Home
              </Button>
              <Divider orientation="vertical" flexItem sx={{ mx: 2, bgcolor: 'gray' }} />
               <Button color="inherit" onClick={handleOrdersClick}>
                <Box display="flex" alignItems="center">
                  Orders List
                  <ExpandMoreIcon sx={{ ml: 1 }} />
                </Box>
              </Button>
              <Button color="inherit" component={Link} to="/admin/chat-bot" startIcon={<ChatIcon />}>
                Chat Bot Zone
              </Button>
              <Button color="inherit" component={Link} to="/admin/profile" startIcon={<AccountCircleIcon />}>
                Profile
              </Button>
              <Button color="inherit" startIcon={<PersonPinCircleOutlined />}>
                {firstname}
              </Button>
              <Button
                color="inherit"
                startIcon={<ExitToAppIcon />}
                onClick={() => keycloak.logout({ redirectUri: window.location.origin })}
              >
                Logout
              </Button>

            </>
          )}   {/*  */}

          <Menu
            anchorEl={anchorElOrders}
            open={Boolean(anchorElOrders)}
            onClose={handleOrdersClose}
          >
            <MenuItem
              component={Link}
              to="/admin/created-orders"
              onClick={() => {
                handleOrdersClose();
                handleMobileMenuClose();
              }}
            >
              📋 Created Orders
            </MenuItem>
            <MenuItem
              component={Link}
              to="/admin/completed-orders"
              onClick={() => {
                handleOrdersClose();
                handleMobileMenuClose();
              }}
            >
              ✅ Completed Orders
            </MenuItem>
            <MenuItem
              component={Link}
              to="/admin/canceled-orders"
              onClick={() => {
                handleOrdersClose();
                handleMobileMenuClose();
              }}
            >
              ❌ Canceled Orders
            </MenuItem>
          </Menu>

        </Toolbar>
      </AppBar>

      {/* DRAWER */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={isDrawerOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: isDrawerOpen ? 'block' : 'none', // 👈 ajoute cette ligne
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            marginTop: '64px',
            height: 'calc(100% - 64px)',

          },
        }}
      >
        {/*
        <Box display="flex" justifyContent="flex-end" p={1}>
          <IconButton onClick={() => setIsDrawerOpen(false)}>
            Admin Panel <ChevronLeftIcon />
          </IconButton>
        </Box>
        */}
        <Divider />
        <List>
          <ListItem button component={Link} to="/admin/dashboard" onClick={handleLinkClick}>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/admin/products" onClick={handleLinkClick}>
            <ListItemIcon><InventoryIcon /></ListItemIcon>
            <ListItemText primary="Manage Products" />
          </ListItem>
          <ListItem button component={Link} to="/admin/customers" onClick={handleLinkClick}>
            <ListItemIcon><PeopleIcon /></ListItemIcon>
            <ListItemText primary="Manage Customers" />
          </ListItem>
          <ListItem button component={Link} to="/admin/create-order" onClick={handleLinkClick}>
            <ListItemIcon><AddShoppingCartIcon /></ListItemIcon>
            <ListItemText primary="Create Orders" />
          </ListItem>
          <ListItem button component={Link} to="/admin/ships" onClick={handleLinkClick}>
            <ListItemIcon><LocalShippingIcon /></ListItemIcon>
            <ListItemText primary="Ship Orders" />
          </ListItem>
          <ListItem button component={Link} to="/admin/delivers" onClick={handleLinkClick}>
            <ListItemIcon><DeliveryDiningIcon /></ListItemIcon>
            <ListItemText primary="Deliver Orders" />
          </ListItem>
          <ListItem button component={Link} to="/admin/bills" onClick={handleLinkClick}>
            <ListItemIcon><ReceiptIcon /></ListItemIcon>
            <ListItemText primary="View Bills" />
          </ListItem>
          <ListItem button component={Link} to="/admin/payments" onClick={handleLinkClick}>
            <ListItemIcon><PaymentIcon /></ListItemIcon>
            <ListItemText primary="View Payments" />
          </ListItem>
          <ListItem button component={Link} to="/admin/order-events" onClick={handleLinkClick}>
            <ListItemIcon><EventNoteIcon /></ListItemIcon>
            <ListItemText primary="View Order Events" />
          </ListItem>

        </List>

      </Drawer>

      {/* BOUTON RÉOUVRIR DRAWER */}
      {/* {!isDrawerOpen && (
        <IconButton
          onClick={() => setIsDrawerOpen(true)}
          sx={{
            position: 'fixed',
            top: 64,
            left: 0,
            zIndex: 1300,
            backgroundColor: 'white',
            borderRadius: '0 4px 4px 0',
            boxShadow: 1,
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      )}*/}
    </>
  );
};

export default DrawerComponent;
