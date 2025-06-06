import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
  Box,
  Chip,
  Divider
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { t } = useTranslation();
  const { keycloak } = useKeycloak();

  const allowedRoles = ['ADMIN', 'USER'];
  const allRoles = keycloak.tokenParsed?.realm_access?.roles || [];
  const displayedRoles = allRoles.filter(role => allowedRoles.includes(role));

  const handleManageAccount = () => {
    keycloak.accountManagement();
  };

  return (
    <Box p={3} display="flex" justifyContent="center">
      <Card sx={{ maxWidth: 600, width: '100%', boxShadow: 4 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Avatar sx={{ width: 64, height: 64 }}>
              <AccountCircleIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h5">
                {keycloak.tokenParsed?.given_name} {keycloak.tokenParsed?.family_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {keycloak.tokenParsed?.email}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">{t('First_Name', { ns: 'profile' })}</Typography>
              <Typography>{keycloak.tokenParsed?.given_name}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">{t('Last_Name', { ns: 'profile' })}</Typography>
              <Typography>{keycloak.tokenParsed?.family_name}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">{t('Email', { ns: 'profile' })}</Typography>
              <Typography>{keycloak.tokenParsed?.email}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">{t('Roles', { ns: 'profile' })}</Typography>
              <Box display="flex" gap={1} mt={1} flexWrap="wrap">
                {displayedRoles.map((role, index) => (
                  <Chip key={index} label={role} color="primary" variant="outlined" />
                ))}
              </Box>
            </Grid>
          </Grid>

          <Box mt={4} display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={handleManageAccount}>
              {t('Update_My_Profile', { ns: 'profile' })}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
