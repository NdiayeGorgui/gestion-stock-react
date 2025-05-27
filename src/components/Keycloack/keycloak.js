// src/keycloak.js
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://keycloak:8080/', // l'URL de Keycloak
  realm: 'stock-realm',
  clientId: 'app-stock',
});

export default keycloak;
