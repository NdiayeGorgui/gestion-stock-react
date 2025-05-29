import axios from 'axios';
import keycloak from './keycloak'; // ton instance Keycloak

const apiClient = axios.create({
  baseURL: 'http://localhost:8888', // API Gateway
  withCredentials: true,
});

// Intercepteur pour ajouter le token à chaque requête
apiClient.interceptors.request.use(
  (config) => {
    const token = keycloak?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
