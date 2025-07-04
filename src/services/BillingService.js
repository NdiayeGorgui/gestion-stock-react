
import apiClient from "../components/Keycloack/axios-client";


const REST_API_BASE_URL='/billing-service/api/v1/bills';
const REST_API_BILL_BASE_URL='/billing-service/api/v1/bills/bill';
const REST_API_PRINT_BASE_URL='/billing-service/api/v1/bills/export';
const REST_API_PRINT_PDF_BASE_URL='/billing-service/api/v1/bills/pdf';

export const listBills = () => apiClient.get(REST_API_BASE_URL);

export const getBill = (orderId) => apiClient.get(REST_API_BASE_URL + '/' + orderId);

export const printInvoice = (orderId) => {
  return apiClient.get(`${REST_API_PRINT_BASE_URL}/${orderId+ '/' + 'CREATED'}`, {
    responseType: 'blob', // important pour Excel
  });
};


export const printInvoicePdf = (orderId) => {
  return apiClient.get(`${REST_API_PRINT_PDF_BASE_URL}/${orderId}`, {
    responseType: 'blob', 
  });
};