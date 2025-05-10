import axios from "axios";
const REST_API_BASE_URL='http://localhost:8888/order-service/api/v1/orders/status';
const REST_API_ORDER_BASE_URL='http://localhost:8888/order-service/api/v1/orders/order';


export const listCreatedOrders = () => axios.get(REST_API_BASE_URL + '/' + 'CREATED');
export const listCompletedOrders = () => axios.get(REST_API_BASE_URL + '/' + 'COMPLETED');
export const listCanceledOrders = () => axios.get(REST_API_BASE_URL + '/' + 'CANCELED');

export const getOrder = (orderId) => axios.get(REST_API_ORDER_BASE_URL + '/' + orderId);
