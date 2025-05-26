import { useState, useEffect } from 'react';

// KeycloakProviderWrapper.jsx
import React from 'react';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './keycloak';

const KeycloakProviderWrapper = ({ children }) => {
  return (
  <ReactKeycloakProvider
  authClient={keycloak}
  initOptions={{ onLoad: 'login-required' }}
  onTokens={() => keycloak.updateToken(30)} // renouvellement du token
>
  {children}
</ReactKeycloakProvider>

  );
};

export default KeycloakProviderWrapper;


