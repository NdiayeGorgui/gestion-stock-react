import apiClient from "../components/Keycloack/axios-client";

const REST_API_BASE_URL='/order-service/api/v1/orders/status';
const REST_API_ORDER_BASE_URL='/order-service/api/v1/orders/order';
const REST_API_CREATE_BASE_URL='/order-service/api/v1/orders';
const REST_API_CUSTOMER_BASE_URL='/order-service/api/v1/orders/customers';
const REST_API_CUSTOMER1_BASE_URL='/order-service/api/v1/orders/customer';
const REST_API_PRODUCT_BASE_URL='/order-service/api/v1/orders/products';
const REST_API_EVENT_BASE_URL='/order-service/api/v1/orders/events/all';
const REST_API_CANCEL_BASE_URL='/order-service/api/v1/orders/update';
const REST_API_MOST_ORDERED_BASE_URL='/order-service/api/v1/orders/most-ordered-products';
const REST_API_TOP10_CUSTOMER_BASE_URL='/order-service/api/v1/orders/top10';



export const listCreatedOrders = () => apiClient.get(REST_API_BASE_URL + '/' + 'CREATED');
export const listCompletedOrders = () => apiClient.get(REST_API_BASE_URL + '/' + 'COMPLETED');
export const listCanceledOrders = () => apiClient.get(REST_API_BASE_URL + '/' + 'CANCELED');
export const listCustomers = () => apiClient.get(REST_API_CUSTOMER_BASE_URL);
export const listProducts = () => apiClient.get(REST_API_PRODUCT_BASE_URL);
export const listOrderEvents = () => apiClient.get(REST_API_EVENT_BASE_URL);

export const createOrder = (order) => apiClient.post(REST_API_CREATE_BASE_URL, order);

export const removeOrder = (orderId) => apiClient.get(REST_API_CANCEL_BASE_URL + '/' + orderId);

export const getOrder = (orderId) => apiClient.get(REST_API_ORDER_BASE_URL + '/' + orderId);
export const getCustomer = (customerIdEvent) => apiClient.get(REST_API_CUSTOMER_BASE_URL + '/' + customerIdEvent);
export const getAmountByCustomerId = (customerIdEvent) => apiClient.get(REST_API_CUSTOMER_BASE_URL + '/' + customerIdEvent+'/' + 'CREATED');
export const getCreatedOrdersByCustomer= (customerIdEvent) => apiClient.get(REST_API_CUSTOMER1_BASE_URL+ '/' + customerIdEvent + '/' + 'CREATED');

export const getMostOrderedProducts = () => apiClient.get(REST_API_MOST_ORDERED_BASE_URL);
export const getTop10CustomersMostOrdered = () => apiClient.get(REST_API_TOP10_CUSTOMER_BASE_URL);