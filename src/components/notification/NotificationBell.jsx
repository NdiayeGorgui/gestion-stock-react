import React, { useState, useEffect } from 'react';
import {
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationService from '../../services/NotificationService';


const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    NotificationService.notifications$.subscribe((notifs) => {
      setNotifications(notifs);
    });

    NotificationService.getNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.readValue).length;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <List sx={{ minWidth: 300, maxHeight: 400, overflow: 'auto' }}>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText primary="Aucune notification." />
            </ListItem>
          ) : (
            notifications.map((notif, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={notif.message}
                  secondary={new Date(notif.date).toLocaleString()}
                />
              </ListItem>
            ))
          )}
        </List>
      </Popover>
    </>
  );
};

export default NotificationBell;
