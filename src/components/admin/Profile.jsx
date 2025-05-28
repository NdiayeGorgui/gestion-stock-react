import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Button, Typography, Box } from '@mui/material';

const Profile = () => {
  const { keycloak } = useKeycloak();

 /* const handleManageAccount = () => {
    // Redirige vers l'interface de gestion de compte Keycloak
    window.location.href = `${keycloak.authServerUrl}realms/${keycloak.realm}/account`;
  };*/

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Profile
      </Typography>

      <Typography>
        First Name : {keycloak.tokenParsed?.given_name}
      </Typography>
      <Typography>
        Last Name : {keycloak.tokenParsed?.family_name}
      </Typography>
      <Typography>
        Email : {keycloak.tokenParsed?.email}
      </Typography>

    {/*   <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={handleManageAccount}
      >
        Modifier mon profil
      </Button>*/}
    </Box>
  );
};

export default Profile;
