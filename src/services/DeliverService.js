import axios from "axios";
const REST_API_BASE_URL='http://localhost:8888/delivered-query-service/api/v1/delivers';
const REST_API_COMMAND_BASE_URL='http://localhost:8888/delivered-command-service/api/v1/delivers';

export const listDelivers = () => axios.get(REST_API_BASE_URL);
export const createDeliver = (delivered) => axios.post(REST_API_COMMAND_BASE_URL, delivered);

export const getDeliver = (orderId) => axios.get(REST_API_BASE_URL + '/' + orderId);