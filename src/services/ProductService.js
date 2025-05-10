import axios from "axios";
const REST_API_BASE_URL='http://localhost:8888/inventory-service/api/v1/products';

export const listProducts = () => axios.get(REST_API_BASE_URL);
export const createProduct = (product) => axios.post(REST_API_BASE_URL, product);

export const getProduct = (id) => axios.get(REST_API_BASE_URL + '/' + id);

export const updateProduct = (productIdEvent, product) => axios.put(REST_API_BASE_URL + '/' + productIdEvent, product);

export const deleteProduct = (productId) => axios.delete(REST_API_BASE_URL + '/' + productId);
