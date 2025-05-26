
import apiClient from "../components/Keycloack/axios-client";
import keycloak from "../components/Keycloack/keycloak";


// Assurez-vous que Keycloak est initialisé avant d'appeler cette fonction
const authHeader = () => {
  if (keycloak && keycloak.token) {
    return {
      headers: {
        Authorization: `Bearer ${keycloak.token}`
      }
    };
  } else {
    return {}; // ou throw new Error("Token manquant");
  }
};
const REST_API_BASE_URL='/shipping-service/api/v1/ships';

export const listShips = () => apiClient.get(REST_API_BASE_URL,authHeader());
export const createShip = (ship) => apiClient.post(REST_API_BASE_URL, ship,authHeader());

export const getShip = (orderId) => apiClient.get(REST_API_BASE_URL + '/' + orderId,authHeader());