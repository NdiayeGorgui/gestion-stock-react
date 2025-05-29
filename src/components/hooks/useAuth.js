import { useKeycloak } from '@react-keycloak/web';

export const useAuth = () => {
  const { keycloak } = useKeycloak();

  const roles = keycloak.tokenParsed?.realm_access?.roles || [];
  const isAdmin = roles.includes('ADMIN');

  return {
    isAuthenticated: keycloak.authenticated,
    token: keycloak.token,
    roles,
    isAdmin,
  };
};
