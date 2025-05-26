
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



const REST_API_BASE_URL='/billing-service/api/v1/bills';
const REST_API_BILL_BASE_URL='/billing-service/api/v1/bills/bill';
const REST_API_PRINT_BASE_URL='/billing-service/api/v1/bills/export';

export const listBills = () => apiClient.get(REST_API_BASE_URL,authHeader());

export const getBill = (orderId) => apiClient.get(REST_API_BILL_BASE_URL + '/' + orderId,authHeader());

export const printInvoice = (customerIdEvent) => {
  return apiClient.get(`${REST_API_PRINT_BASE_URL}/${customerIdEvent+ '/' + 'CREATED'}`, {...authHeader(),
    responseType: 'blob', // important pour Excel
  });
};