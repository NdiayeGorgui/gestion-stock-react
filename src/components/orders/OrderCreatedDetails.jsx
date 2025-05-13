import React, { useEffect, useState } from 'react';
import { Card, Table } from 'react-bootstrap';
import { getCreatedOrdersByCustomer, getAmountByCustomerId, getCustomer } from '../../services/OrderSrvice';
import { useParams } from 'react-router-dom';

const OrderCreatedDetails = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [customer, setCustomer] = useState({});
  const [amountDto, setAmountDto] = useState({ amount: 0, totalAmount: 0, tax: 0, discount: 0 });

  useEffect(() => {
    if (id) {
      fetchCustomerAndOrders();
    }
  }, [id]);

const fetchCustomerAndOrders = async () => {
  try {
    const customerRes = await getCustomer(id);
    const orderRes = await getCreatedOrdersByCustomer(id);
    const amountRes = await getAmountByCustomerId(id);

    console.log("✅ getCustomer:", customerRes);
    console.log("✅ getCreatedOrdersByCustomer:", orderRes);
    console.log("✅ getAmountByCustomerId:", amountRes);

    const customerData = customerRes?.data;
    const orderData = orderRes?.data;
    const amountData = amountRes?.data;

    if (customerData) setCustomer(customerData);
    if (Array.isArray(orderData)) setOrders(orderData);
    if (amountData) setAmountDto(amountData);
  } catch (error) {
    console.error("❌ fetchCustomerAndOrders error:", error);
    if (error.response) {
      console.error("📡 Backend response error:", error.response.data);
    }
  }
};


  return (
    <div className="container mt-3">
      <Card>
        <Card.Header><strong>Order Details</strong></Card.Header>
        <ul className="list-group list-group-flush">
          <li className="list-group-item"><b>Customer Id:</b> {customer.id || 'N/A'}</li>
          <li className="list-group-item"><b>Customer Name:</b> {customer.name || 'N/A'}</li>
          <li className="list-group-item"><b>Customer Phone:</b> {customer.phone || 'N/A'}</li>
          <li className="list-group-item"><b>Customer Address:</b> {customer.address || 'N/A'}</li>
          <li className="list-group-item"><b>Customer Email:</b> {customer.email || 'N/A'}</li>
          <li className="list-group-item"><b>Total Tax:</b> {amountDto.tax?.toFixed(2) || '0.00'}</li>
        </ul>

        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Product Id</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Discount</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(orders) && orders.length > 0 ? (
                orders.map((item, index) => (
                  <tr key={index}>
                    <td>{item.product?.productIdEvent || '—'}</td>
                    <td>{item.product?.name || '—'}</td>
                    <td>{item.product?.category || '—'}</td>
                    <td>{item.product?.price?.toFixed(2) || '0.00'}</td>
                    <td>{item.quantity}</td>
                    <td>{item.discount?.toFixed(2) || '0.00'}</td>
                    <td>{item.amount?.toFixed(2) || '0.00'}</td>
                    <td>{item.order?.orderStatus || '—'}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="8" className="text-center">Aucune commande</td></tr>
              )}
            </tbody>
          </Table>
          <div className="mt-3">
            <label><b>Total Amount</b></label>
            <input
              className="form-control"
              value={amountDto.totalAmount?.toFixed(2) || "0.00"}
              readOnly
            />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default OrderCreatedDetails;
