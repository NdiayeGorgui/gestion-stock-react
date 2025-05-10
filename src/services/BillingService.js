import axios from "axios";
const REST_API_BASE_URL='http://localhost:8888/billing-service/api/v1/bills';
const REST_API_BILL_BASE_URL='http://localhost:8888/billing-service/api/v1/bills/bill';

export const listBills = () => axios.get(REST_API_BASE_URL);

export const getBill = (orderId) => axios.get(REST_API_BILL_BASE_URL + '/' + orderId);