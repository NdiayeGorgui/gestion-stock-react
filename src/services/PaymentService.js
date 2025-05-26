
import keycloak from "../components/Keycloack/keycloak";
import apiClient from "../components/Keycloack/axios-client";

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
const REST_API_BASE_URL='/payment-service/api/v1/payments';
const REST_API_BILL_BASE_URL='/payment-service/api/v1/payments/bills';

export const listPayments = () => apiClient.get(REST_API_BASE_URL,authHeader());

export const getPayment = (paymentIdEvent) => apiClient.get(REST_API_BASE_URL + '/' + paymentIdEvent,authHeader());
export const createPayment = (payment) => apiClient.post(REST_API_BASE_URL,payment ,authHeader());