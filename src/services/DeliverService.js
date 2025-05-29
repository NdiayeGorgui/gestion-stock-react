
import apiClient from "../components/Keycloack/axios-client";

const REST_API_BASE_URL='/delivered-query-service/api/v1/delivers';
const REST_API_COMMAND_BASE_URL='/delivered-command-service/api/v1/delivers';

export const listDelivers = () => apiClient.get(REST_API_BASE_URL);
export const createDeliver = (delivered) => apiClient.post(REST_API_COMMAND_BASE_URL, delivered);

export const getDeliver = (orderId) => apiClient.get(REST_API_BASE_URL + '/' + orderId);