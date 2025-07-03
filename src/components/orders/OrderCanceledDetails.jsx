import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCanceledOrdersById, getOrdersById } from '../../services/OrderSrvice';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const OrderCanceledDetails = () => {
  const [order, setOrder] = useState({
    orderId: '',
    customerName: '',
    customerEmail: '',
    amount: 0,
    totalTax: 0,
    totalDiscount: 0,
    createdDate: '',
    items: [],
  });

  const { id } = useParams();
  const navigator = useNavigate();
  const { t } = useTranslation();
  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading && token && id) {
      getOrdersById(id)
        .then((response) => {
          setOrder(response.data);
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération de la commande :', error);
        });
    }
  }, [loading, token, id]);

  const {
    orderId,
    customerName,
    customerEmail,
    amount,
    totalDiscount,
    totalTax,
    createdDate,
    items,
  } = order;

  const close = () => navigator('/admin/canceled-orders');

  return (
    <div className="container mt-5">
      {/* En-tête avec bouton de fermeture */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div></div>
        <h2 className="text-center flex-grow-1 m-0">{t('Order_Details', { ns: 'createdorders' })}</h2>
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={close}
          title={t('Close', { ns: 'createdorders' })}
        >
          <i className="bi bi-x-lg"></i>
        </button>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="form-group mb-2">
            <label className="fw-bold">{t('OrderId', { ns: 'createdorders' })}:</label>
            <input type="text" className="form-control" value={orderId} readOnly />
          </div>
          <div className="form-group mb-2">
            <label className="fw-bold">{t('Date', { ns: 'createdorders' })}:</label>
            <input
              type="text"
              className="form-control"
              value={
                createdDate
                  ? new Date(createdDate).toLocaleString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  })
                  : ''
              }
              readOnly
            />

          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group mb-2">
            <label className="fw-bold">{t('Customer', { ns: 'createdorders' })}:</label>
            <input type="text" className="form-control" value={customerName} readOnly />
          </div>
          <div className="form-group mb-2">
            <label className="fw-bold">{t('Email', { ns: 'createdorders' })}:</label>
            <input type="text" className="form-control" value={customerEmail} readOnly />
          </div>
        </div>
      </div>

      {/* Montants */}
      <div className="row mb-4">
        <div className="col-md-4">
          <label className="fw-bold">{t('Amount', { ns: 'createdorders' })}:</label>
          <input type="text" className="form-control" value={amount.toFixed(2)} readOnly />
        </div>
        <div className="col-md-4">
          <label className="fw-bold">{t('Discount', { ns: 'createdorders' })}:</label>
          <input type="text" className="form-control" value={totalDiscount.toFixed(2)} readOnly />
        </div>
        <div className="col-md-4">
          <label className="fw-bold">{t('Tax', { ns: 'createdorders' })}:</label>
          <input type="text" className="form-control" value={totalTax.toFixed(2)} readOnly />
        </div>
      </div>

      {/* Liste des produits */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>{t('Product_IdEvent', { ns: 'createdorders' })}</th>
            <th>{t('Product_Name', { ns: 'createdorders' })}</th>
            <th>{t('Price', { ns: 'createdorders' })}</th>
            <th>{t('Quantity', { ns: 'createdorders' })}</th>
            <th>{t('Subtotal', { ns: 'createdorders' })}</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item, index) => (
              <tr key={index}>
                <td>{item.productId}</td>
                <td>{item.productName}</td>
                <td>{item.price.toFixed(2)}</td>
                <td>{item.quantity}</td>
                <td>{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">{t('No_Products', { ns: 'createdorders' })}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

};

export default OrderCanceledDetails;
