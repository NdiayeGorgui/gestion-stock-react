import axios from "axios";
const REST_API_BASE_URL='http://localhost:8888/shipping-service/api/v1/ships';

export const listShips = () => axios.get(REST_API_BASE_URL);
export const createShip = (ship) => axios.post(REST_API_BASE_URL, ship);

export const getShip = (orderId) => axios.get(REST_API_BASE_URL + '/' + orderId);