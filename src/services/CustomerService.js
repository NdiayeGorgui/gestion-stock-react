
import apiClient from "../components/Keycloack/axios-client";


const REST_API_BASE_URL='/customer-service/api/v1/customers';
const REST_API_ExIST_BASE_URL='/customer-service/api/v1/customers/exists-by-email';

export const listCustomers = () => apiClient.get(REST_API_BASE_URL);

export const createCustomer = (customer) => apiClient.post(REST_API_BASE_URL, customer);

export const getCustomer = (id) => apiClient.get(REST_API_BASE_URL + '/' + id);

export const updateCustomer = (customerIdEvent, customer) => apiClient.put(REST_API_BASE_URL + '/' + customerIdEvent, customer);

export const deleteCustomer = (customerId) => apiClient.delete(REST_API_BASE_URL + '/' + customerId);

export const customerExistByEmail = (email) => apiClient.get(REST_API_ExIST_BASE_URL + '/' + email);