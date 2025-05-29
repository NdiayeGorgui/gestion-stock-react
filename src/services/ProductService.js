
import apiClient from "../components/Keycloack/axios-client";


const REST_API_BASE_URL='/inventory-service/api/v1/products';

export const listProducts = () => apiClient.get(REST_API_BASE_URL);
export const createProduct = (product) => apiClient.post(REST_API_BASE_URL, product);

export const getProduct = (id) => apiClient.get(REST_API_BASE_URL + '/' + id);

export const updateProduct = (productIdEvent, product) => apiClient.put(REST_API_BASE_URL + '/' + productIdEvent, product);

export const deleteProduct = (productId) => apiClient.delete(REST_API_BASE_URL + '/' + productId);
