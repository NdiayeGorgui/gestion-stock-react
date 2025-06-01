import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Button, Typography, Box } from '@mui/material';

const Profile = () => {
  const { keycloak } = useKeycloak();
 

  // Liste blanche des rôles à afficher
  const allowedRoles = ['ADMIN', 'USER'];

  // Récupération des rôles depuis le token
  const allRoles = keycloak.tokenParsed?.realm_access?.roles || [];

  // Filtrage
  const displayedRoles = allRoles.filter(role => allowedRoles.includes(role));

  const handleManageAccount = () => {
  keycloak.accountManagement();
};


  return (
    <Box p={3}>
  <Typography variant="h5" gutterBottom>
    Profile Details
  </Typography>
  
  <Typography>
    <strong>First Name:</strong> {keycloak.tokenParsed?.given_name}
  </Typography>

  <Typography>
    <strong>Last Name:</strong> {keycloak.tokenParsed?.family_name}
  </Typography>

  <Typography>
    <strong>Email:</strong> {keycloak.tokenParsed?.email}
  </Typography>

  <Typography>
    <strong>Roles:</strong> {displayedRoles.join(', ')}
  </Typography>

  <Button
    variant="contained"
    color="primary"
    sx={{ mt: 2 }}
    onClick={handleManageAccount}
  >
    Update my profile
  </Button>
</Box>

  );
};

export default Profile;
