
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
const REST_API_BASE_URL='/inventory-service/api/v1/products';

export const listProducts = () => apiClient.get(REST_API_BASE_URL,authHeader());
export const createProduct = (product) => apiClient.post(REST_API_BASE_URL, product,authHeader());

export const getProduct = (id) => apiClient.get(REST_API_BASE_URL + '/' + id,authHeader());

export const updateProduct = (productIdEvent, product) => apiClient.put(REST_API_BASE_URL + '/' + productIdEvent, product,authHeader());

export const deleteProduct = (productId) => apiClient.delete(REST_API_BASE_URL + '/' + productId,authHeader());
