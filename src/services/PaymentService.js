
import apiClient from "../components/Keycloack/axios-client";


const REST_API_BASE_URL='/payment-service/api/v1/payments';
const REST_API_BILL_BASE_URL='/payment-service/api/v1/payments/bills';

export const listPayments = () => apiClient.get(REST_API_BASE_URL);

export const getPayment = (orderId) => apiClient.get(REST_API_BASE_URL + '/' + orderId);
export const createPayment = (payment) => apiClient.post(REST_API_BASE_URL,payment );