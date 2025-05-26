import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8888', // Le point d’entrée de l’API Gateway
  withCredentials: true,           // Envoie les cookies/CORS credentials automatiquement
});

axios.defaults.withCredentials = true; // Globalement pour tous les appels axios

export default apiClient;
