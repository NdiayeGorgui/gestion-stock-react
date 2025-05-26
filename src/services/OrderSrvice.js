
import apiClient from "../components/Keycloack/axios-client";
import keycloak from "../components/Keycloack/keycloak";

// Assurez-vous que Keycloak est initialisé avant d'appeler cette fonction
const authHeader = () => {
  if (keycloak && keycloak.token) {
    return {
      headers: {
        Authorization: `Bearer ${keycloak.token}`
      }
    };
  } else {
    return {}; // ou throw new Error("Token manquant");
  }
};
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



export const listCreatedOrders = () => apiClient.get(REST_API_BASE_URL + '/' + 'CREATED',authHeader());
export const listCompletedOrders = () => apiClient.get(REST_API_BASE_URL + '/' + 'COMPLETED',authHeader());
export const listCanceledOrders = () => apiClient.get(REST_API_BASE_URL + '/' + 'CANCELED',authHeader());
export const listCustomers = () => apiClient.get(REST_API_CUSTOMER_BASE_URL,authHeader());
export const listProducts = () => apiClient.get(REST_API_PRODUCT_BASE_URL,authHeader());
export const listOrderEvents = () => apiClient.get(REST_API_EVENT_BASE_URL,authHeader());

export const createOrder = (order) => apiClient.post(REST_API_CREATE_BASE_URL, order,authHeader());

export const removeOrder = (orderId) => apiClient.get(REST_API_CANCEL_BASE_URL + '/' + orderId,authHeader());

export const getOrder = (orderId) => apiClient.get(REST_API_ORDER_BASE_URL + '/' + orderId,authHeader());
export const getCustomer = (customerIdEvent) => apiClient.get(REST_API_CUSTOMER_BASE_URL + '/' + customerIdEvent,authHeader());
export const getAmountByCustomerId = (customerIdEvent) => apiClient.get(REST_API_CUSTOMER_BASE_URL + '/' + customerIdEvent+'/' + 'CREATED',authHeader());
export const getCreatedOrdersByCustomer= (customerIdEvent) => apiClient.get(REST_API_CUSTOMER1_BASE_URL+ '/' + customerIdEvent + '/' + 'CREATED',authHeader());

export const getMostOrderedProducts = () => apiClient.get(REST_API_MOST_ORDERED_BASE_URL,authHeader());
export const getTop10CustomersMostOrdered = () => apiClient.get(REST_API_TOP10_CUSTOMER_BASE_URL,authHeader());