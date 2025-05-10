import axios from "axios";
const REST_API_BASE_URL='http://localhost:8888/payment-service/api/v1/payments';
const REST_API_BILL_BASE_URL='http://localhost:8888/payment-service/api/v1/payments/bills';

export const listPayments = () => axios.get(REST_API_BASE_URL);

export const getPayment = (paymentIdEvent) => axios.get(REST_API_BASE_URL + '/' + paymentIdEvent);