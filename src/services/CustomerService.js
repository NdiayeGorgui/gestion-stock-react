import axios from "axios";
const REST_API_BASE_URL='http://localhost:8888/customer-service/api/v1/customers';

export const listCustomers = () => axios.get(REST_API_BASE_URL);
export const createCustomer = (customer) => axios.post(REST_API_BASE_URL, customer);

export const getCustomer = (id) => axios.get(REST_API_BASE_URL + '/' + id);

export const updateCustomer = (customerIdEvent, customer) => axios.put(REST_API_BASE_URL + '/' + customerIdEvent, customer);

export const deleteCustomer = (customerId) => axios.delete(REST_API_BASE_URL + '/' + customerId);