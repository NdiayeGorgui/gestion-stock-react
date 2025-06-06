import React, { useEffect, useState } from 'react';
import { Card, Table } from 'react-bootstrap';
import { getCreatedOrdersByCustomer, getAmountByCustomerId, getCustomer } from '../../services/OrderSrvice';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const OrderCreatedDetails = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [customer, setCustomer] = useState({});
  const [amountDto, setAmountDto] = useState({ amount: 0, totalAmount: 0, tax: 0, discount: 0 });

  const navigator = useNavigate();
  const { t } = useTranslation();
  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading && token && id) {
      fetchCustomerAndOrders();
    }
  }, [loading, token, id]);

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

  function close() {
    navigator('/admin/created-orders');
  }

  return (
    <div className="container mt-3">
      <Card>
        <Card.Header><strong>{t('Order_Details', { ns: 'createdorders' })}</strong></Card.Header>
        <ul className="list-group list-group-flush">
          <li className="list-group-item"><b>{t('Customer_Id', { ns: 'createdorders' })}:</b> {customer.id || 'N/A'}</li>
          <li className="list-group-item"><b>{t('Customer_Name_Name', { ns: 'createdorders' })}:</b> {customer.name || 'N/A'}</li>
          <li className="list-group-item"><b>{t('Customer_Phone', { ns: 'createdorders' })}:</b> {customer.phone || 'N/A'}</li>
          <li className="list-group-item"><b>{t('Customer_Address', { ns: 'createdorders' })}:</b> {customer.address || 'N/A'}</li>
          <li className="list-group-item"><b>{t('Customer_Email', { ns: 'createdorders' })}:</b> {customer.email || 'N/A'}</li>
          <li className="list-group-item"><b>{t('Total_Tax', { ns: 'createdorders' })}:</b> {amountDto.tax?.toFixed(2) || '0.00'}</li>
        </ul>

        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>{t('Product_Id', { ns: 'createdorders' })}</th>
                <th>{t('Product_Name', { ns: 'createdorders' })}</th>
                <th>{t('Category', { ns: 'createdorders' })}</th>
                <th>{t('Price', { ns: 'createdorders' })}</th>
                <th>{t('Quantity', { ns: 'createdorders' })}</th>
                <th>{t('Discount', { ns: 'createdorders' })}</th>
                <th>{t('Amount', { ns: 'createdorders' })}</th>
                <th>{t('Status', { ns: 'createdorders' })}</th>
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
                <tr><td colSpan="8" className="text-center">{t('No_Orders', { ns: 'createdorders' })}</td></tr>
              )}
            </tbody>
          </Table>
          <div className="mt-3 d-flex align-items-end gap-3">
            <div className="flex-grow-1">
              <label><b>{t('Total_Amount', { ns: 'createdorders' })}</b></label>
              <input
                className="form-control"
                value={amountDto.totalAmount?.toFixed(2) || "0.00"}
                readOnly
              />
            </div>

            <button
              onClick={close}
              className="btn btn-primary"
              style={{ height: '38px' }} // même hauteur que l'input pour l’alignement
            >
              {t('Close', { ns: 'createdorders' })}
            </button>
          </div>

        </Card.Body>
      </Card>
    </div>
  );
};

export default OrderCreatedDetails;
