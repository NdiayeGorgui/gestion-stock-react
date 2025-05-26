
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
const REST_API_BASE_URL='/delivered-query-service/api/v1/delivers';
const REST_API_COMMAND_BASE_URL='/delivered-command-service/api/v1/delivers';

export const listDelivers = () => apiClient.get(REST_API_BASE_URL,authHeader());
export const createDeliver = (delivered) => apiClient.post(REST_API_COMMAND_BASE_URL, delivered,authHeader());

export const getDeliver = (orderId) => apiClient.get(REST_API_BASE_URL + '/' + orderId,authHeader());