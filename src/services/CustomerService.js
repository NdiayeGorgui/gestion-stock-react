
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

const REST_API_BASE_URL='/customer-service/api/v1/customers';

export const listCustomers = () => apiClient.get(REST_API_BASE_URL,authHeader());
export const createCustomer = (customer) => apiClient.post(REST_API_BASE_URL, customer,authHeader());

export const getCustomer = (id) => apiClient.get(REST_API_BASE_URL + '/' + id,authHeader());

export const updateCustomer = (customerIdEvent, customer) => apiClient.put(REST_API_BASE_URL + '/' + customerIdEvent, customer,authHeader());

export const deleteCustomer = (customerId) => apiClient.delete(REST_API_BASE_URL + '/' + customerId,authHeader());