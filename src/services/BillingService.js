import axios from "axios";
const REST_API_BASE_URL='http://localhost:8888/billing-service/api/v1/bills';
const REST_API_BILL_BASE_URL='http://localhost:8888/billing-service/api/v1/bills/bill';
const REST_API_PRINT_BASE_URL='http://localhost:8888/billing-service/api/v1/bills/export';

export const listBills = () => axios.get(REST_API_BASE_URL);

export const getBill = (orderId) => axios.get(REST_API_BILL_BASE_URL + '/' + orderId);

export const printInvoice = (customerIdEvent) => {
  return axios.get(`${REST_API_PRINT_BASE_URL}/${customerIdEvent+ '/' + 'CREATED'}`, {
    responseType: 'blob', // important pour Excel
  });
};