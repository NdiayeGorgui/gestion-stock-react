
import apiClient from "../components/Keycloack/axios-client";


const REST_API_BASE_URL='/billing-service/api/v1/bills';
const REST_API_BILL_BASE_URL='/billing-service/api/v1/bills/bill';
const REST_API_PRINT_BASE_URL='/billing-service/api/v1/bills/export';

export const listBills = () => apiClient.get(REST_API_BASE_URL);

export const getBill = (orderId) => apiClient.get(REST_API_BILL_BASE_URL + '/' + orderId);

export const printInvoice = (customerIdEvent) => {
  return apiClient.get(`${REST_API_PRINT_BASE_URL}/${customerIdEvent+ '/' + 'CREATED'}`, {
    responseType: 'blob', // important pour Excel
  });
};