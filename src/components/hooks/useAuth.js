import { useKeycloak } from '@react-keycloak/web';
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const { keycloak, initialized } = useKeycloak();
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (initialized) {
      const parsedRoles = keycloak.tokenParsed?.realm_access?.roles || [];
      setRoles(parsedRoles);
      setLoading(false);
    }
  }, [initialized, keycloak.tokenParsed]);

  const isAdmin = roles.includes('ADMIN');

  return {
    isAuthenticated: keycloak.authenticated,
    token: keycloak.token,
    roles,
    isAdmin,
    loading,
  };
};
