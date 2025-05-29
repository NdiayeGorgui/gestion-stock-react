
import apiClient from "../components/Keycloack/axios-client";


const REST_API_BASE_URL='/shipping-service/api/v1/ships';

export const listShips = () => apiClient.get(REST_API_BASE_URL);
export const createShip = (ship) => apiClient.post(REST_API_BASE_URL, ship);

export const getShip = (orderId) => apiClient.get(REST_API_BASE_URL + '/' + orderId);