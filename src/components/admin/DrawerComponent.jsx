import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useKeycloak } from '@react-keycloak/web';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';

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
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import NotificationService from '../../services/NotificationService';

const drawerWidth = 250;

const DrawerComponent = ({ isDrawerOpen, setIsDrawerOpen }) => {
  const { keycloak } = useKeycloak();
  const [anchorElOrders, setAnchorElOrders] = React.useState(null);
  const [anchorElMobileMenu, setAnchorElMobileMenu] = React.useState(null);
  const isSmallScreen = useMediaQuery('(max-width:768px)');
  const [anchorElUserMenu, setAnchorElUserMenu] = React.useState(null);

  const handleUserMenuOpen = (event) => {
    setAnchorElUserMenu(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorElUserMenu(null);
  };


  const { t } = useTranslation();
  const { token, loading } = useAuth();

  const user = keycloak?.tokenParsed;
  const firstname = user?.given_name || 'UserName';

  const { roles } = useAuth();

  // Supposons que le rôle admin est la string 'ADMIN'
  const isAdmin = roles && roles.includes('ADMIN');

  React.useEffect(() => {
    if (isSmallScreen) {
      setIsDrawerOpen(false); // ferme automatiquement le drawer sur mobile
    } else {
      setIsDrawerOpen(true); // ouvre automatiquement sur écran large
    }
  }, [isSmallScreen, setIsDrawerOpen]);

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

  // AJOUT: état pour les notifications
  const [notifications, setNotifications] = useState([]);
  const [anchorElNotif, setAnchorElNotif] = useState(null);
  const unreadCount = notifications.filter((n) => !n.readValue).length;

  useEffect(() => {
    if (!loading && token) {
      // Récupérer les notifications au chargement
      NotificationService.getNotifications();

      // S'abonner au BehaviorSubject pour mise à jour des notifications
      const sub = NotificationService.notifications$.subscribe(setNotifications);

      // Nettoyer à la destruction du composant
      return () => {
        sub.unsubscribe();
      };
    }
  }, [loading, token]);

  // AJOUT: gestion clic notification = marque comme lu
  const handleNotificationClick = (notifId) => {
    NotificationService.markAsRead(notifId);
  };

  const [anchorEl, setAnchorEl] = useState(null);


  useEffect(() => {
    if (!loading && token) {
      const sub = NotificationService.notifications$.subscribe(setNotifications);
      NotificationService.getNotifications();
      return () => sub.unsubscribe();
    }
  }, [loading, token]);



  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickNotification = async (id) => {
    await NotificationService.markAsRead(id);
    handleClose();
  };

  return (
    <>
      {/* HEADER */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#6a5acd',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {t('Trocady_Management_System', { ns: 'drawer' })}
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
                  <HomeIcon sx={{ mr: 1 }} /> {t('Home', { ns: 'drawer' })}
                </MenuItem>

                {/* 📱 MenuItem cliquable dans le drawer mobile */}
                <MenuItem onClick={handleOpen}>
                  <ListItemIcon>
                    <Badge badgeContent={unreadCount} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText primary="Notifications" />
                </MenuItem>

                {/* 📱 Popup Menu contenant la liste des notifications */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{
                    sx: {
                      width: '80vw', // largeur plus confortable en mobile
                      maxWidth: 360,
                    }
                  }}
                >
                  {unreadCount === 0 ? (
                    <MenuItem disabled> {t('no_notification', { ns: 'drawer' })}</MenuItem>
                  ) : (
                    notifications.map((notif) => (
                      <MenuItem
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif.id)}
                        sx={{
                          fontWeight: notif.readValue ? 'normal' : 'bold',
                          fontSize: '0.875rem',
                          position: 'relative',
                          whiteSpace: 'normal',        // Permet retour à la ligne
                          lineHeight: 1.4,             // Améliore la lisibilité
                          wordBreak: 'break-word',     // Coupe proprement les mots longs
                          display: 'block',            // Pour que le contenu prenne la largeur
                          maxWidth: '90vw'
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            width: 10,
                            height: 10,
                            bgcolor: notif.readValue ? 'grey.500' : 'error.main',
                            borderRadius: '50%',
                            position: 'absolute',
                            left: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                          }}
                        />
                        <Box sx={{ pl: 3 }}>{notif.message}</Box>
                      </MenuItem>
                    ))
                  )}


                </Menu>

                <MenuItem onClick={handleOrdersClick}>
                  <Box display="flex" alignItems="center" width="100%">
                    <InboxIcon sx={{ mr: 1 }} />
                    <Box flexGrow={1}>{t('Orders_List', { ns: 'drawer' })} </Box>
                    <ExpandMoreIcon />
                  </Box>
                </MenuItem>
                <MenuItem component={Link} to="/admin/chat-bot" onClick={handleMobileMenuClose}>
                  <ChatIcon sx={{ mr: 1 }} /> {t('Chat_Bot_Zone', { ns: 'drawer' })}
                </MenuItem>
                <MenuItem component={Link} to="/admin/profile" onClick={handleMobileMenuClose}>
                  <AccountCircleIcon sx={{ mr: 1 }} /> {t('Profile', { ns: 'drawer' })}
                </MenuItem>
                <MenuItem component={Link} to="/admin/settings" onClick={handleMobileMenuClose}>
                  <SettingsIcon sx={{ mr: 1 }} /> {t('Settings', { ns: 'drawer' })}
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
                  <ExitToAppIcon sx={{ mr: 1 }} /> {t('Logout', { ns: 'drawer' })}
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/admin/home" startIcon={<HomeIcon />}>
                {t('Home', { ns: 'drawer' })}
              </Button>

              <IconButton color="inherit" onClick={(e) => setAnchorElNotif(e.currentTarget)}>
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              {/* AJOUT: Menu des notifications avec bulle rouge devant les non lues */}
              <Menu
                anchorEl={anchorElNotif}
                open={Boolean(anchorElNotif)}
                onClose={() => setAnchorElNotif(null)}
                PaperProps={{ style: { maxHeight: 48 * 6 } }}
              >
                {unreadCount === 0 ? (
                  <MenuItem disabled> {t('no_notification', { ns: 'drawer' })}</MenuItem>
                ) : (
                  notifications.map((notif) => (
                    <MenuItem
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif.id)}
                      sx={{
                        fontWeight: notif.readValue ? 'normal' : 'bold',
                        position: 'relative',
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          width: 10,
                          height: 10,
                          bgcolor: notif.readValue ? 'grey.500' : 'error.main',
                          borderRadius: '50%',
                          position: 'absolute',
                          left: 8,
                          top: '50%',
                          transform: 'translateY(-50%)',
                        }}
                      />
                      <Box sx={{ pl: 3 }}>{notif.message}</Box>
                    </MenuItem>
                  ))
                )}
              </Menu>


              <Divider orientation="vertical" flexItem sx={{ mx: 2, bgcolor: 'gray' }} />
              <Button color="inherit" onClick={handleOrdersClick}>
                <Box display="flex" alignItems="center">
                  {t('Orders_List', { ns: 'drawer' })}
                  <ExpandMoreIcon sx={{ ml: 1 }} />
                </Box>
              </Button>
              <Button color="inherit" component={Link} to="/admin/chat-bot" startIcon={<ChatIcon />}>
                {t('Chat_Bot_Zone', { ns: 'drawer' })}
              </Button>
              <Divider orientation="vertical" flexItem sx={{ mx: 2, bgcolor: 'gray' }} />
              {/* Username dropdown menu */}
              <Box sx={{ ml: 2 }}>
                <Button
                  color="inherit"
                  startIcon={<PersonPinCircleOutlined />}
                  endIcon={<ExpandMoreIcon />}
                  onClick={handleUserMenuOpen}
                >
                  {firstname}
                </Button>
                <Menu
                  anchorEl={anchorElUserMenu}
                  open={Boolean(anchorElUserMenu)}
                  onClose={handleUserMenuClose}
                >
                  <MenuItem component={Link} to="/admin/profile" onClick={handleUserMenuClose}>
                    <AccountCircleIcon sx={{ mr: 1 }} /> {t('Profile', { ns: 'drawer' })}
                  </MenuItem>
                  <MenuItem component={Link} to="/admin/settings" onClick={handleUserMenuClose}>
                    <SettingsIcon sx={{ mr: 1 }} /> {t('Settings', { ns: 'drawer' })}
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleUserMenuClose();
                      keycloak.logout({ redirectUri: window.location.origin });
                    }}
                  >
                    <ExitToAppIcon sx={{ mr: 1 }} /> {t('Logout', { ns: 'drawer' })}
                  </MenuItem>
                </Menu>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{ sx: { width: '80vw', maxWidth: 360 } }}
                >
                  {unreadCount === 0 ? (
                    <MenuItem disabled> {t('no_notification', { ns: 'drawer' })}</MenuItem>
                  ) : (
                    notifications.map((notif) => (
                      <MenuItem
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif.id)}
                        sx={{
                          fontWeight: notif.readValue ? 'normal' : 'bold',
                          fontSize: '0.875rem',
                          position: 'relative',
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            width: 10,
                            height: 10,
                            bgcolor: notif.readValue ? 'grey.500' : 'error.main',
                            borderRadius: '50%',
                            position: 'absolute',
                            left: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                          }}
                        />
                        <Box sx={{ pl: 3 }}>{notif.message}</Box>
                      </MenuItem>
                    ))
                  )}
                </Menu>

              </Box>
            </>
          )}

          {/* Orders submenu */}
          <Menu anchorEl={anchorElOrders} open={Boolean(anchorElOrders)} onClose={handleOrdersClose}>
            <MenuItem
              component={Link}
              to="/admin/created-orders"
              onClick={() => {
                handleOrdersClose();
                handleMobileMenuClose();
              }}
            >
              📋 {t('Created_Orders', { ns: 'drawer' })}
            </MenuItem>
            <MenuItem
              component={Link}
              to="/admin/completed-orders"
              onClick={() => {
                handleOrdersClose();
                handleMobileMenuClose();
              }}
            >
              ✅ {t('Completed_Orders', { ns: 'drawer' })}
            </MenuItem>
            <MenuItem
              component={Link}
              to="/admin/canceled-orders"
              onClick={() => {
                handleOrdersClose();
                handleMobileMenuClose();
              }}
            >
              ❌ {t('Canceled_Orders', { ns: 'drawer' })}
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
          display: isDrawerOpen ? 'block' : 'none',
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            marginTop: '64px',
            height: 'calc(100% - 64px)',
          },
        }}
      >
        <Divider />
        <List>
          {isAdmin && (
            <ListItem button component={Link} to="/admin/dashboard" onClick={handleLinkClick}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography fontWeight="bold" color="black">
                    {t('Dashboard', { ns: 'drawer' })}
                  </Typography>
                }
              />
            </ListItem>
          )}

          <ListItem button component={Link} to="/admin/products" onClick={handleLinkClick}>
            <ListItemIcon>
              <InventoryIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography fontWeight="bold" color="black">
                  {t('Manage_Products', { ns: 'drawer' })}
                </Typography>
              }
            />
          </ListItem>

          <ListItem button component={Link} to="/admin/customers" onClick={handleLinkClick}>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography fontWeight="bold" color="black">
                  {t('Manage_Customers', { ns: 'drawer' })}
                </Typography>
              }
            />
          </ListItem>

          <ListItem button component={Link} to="/admin/create-order" onClick={handleLinkClick}>
            <ListItemIcon>
              <AddShoppingCartIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography fontWeight="bold" color="black">
                  {t('Create_Orders', { ns: 'drawer' })}
                </Typography>
              }
            />
          </ListItem>

          <ListItem button component={Link} to="/admin/ships" onClick={handleLinkClick}>
            <ListItemIcon>
              <LocalShippingIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography fontWeight="bold" color="black">
                  {t('Ship_Orders', { ns: 'drawer' })}
                </Typography>
              }
            />
          </ListItem>

          <ListItem button component={Link} to="/admin/delivers" onClick={handleLinkClick}>
            <ListItemIcon>
              <DeliveryDiningIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography fontWeight="bold" color="black">
                  {t('Deliver_Orders', { ns: 'drawer' })}
                </Typography>
              }
            />
          </ListItem>

          <ListItem button component={Link} to="/admin/bills" onClick={handleLinkClick}>
            <ListItemIcon>
              <ReceiptIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography fontWeight="bold" color="black">
                  {t('View_Bills', { ns: 'drawer' })}
                </Typography>
              }
            />
          </ListItem>

          <ListItem button component={Link} to="/admin/payments" onClick={handleLinkClick}>
            <ListItemIcon>
              <PaymentIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography fontWeight="bold" color="black">
                  {t('View_Payments', { ns: 'drawer' })}
                </Typography>
              }
            />
          </ListItem>

          <ListItem button component={Link} to="/admin/order-events" onClick={handleLinkClick}>
            <ListItemIcon>
              <EventNoteIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography fontWeight="bold" color="black">
                  {t('View_Order_Events', { ns: 'drawer' })}
                </Typography>
              }
            />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default DrawerComponent;
