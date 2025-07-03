import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPayment } from '../../services/PaymentService';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const Payment = () => {
  const [paymentData, setPaymentData] = useState(null);
  const { id } = useParams();
  const { token, loading } = useAuth();
  const navigator = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (!loading && token && id) {
      getPayment(id)
        .then((response) => {
          console.log('Payment response:', response.data);
          setPaymentData(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [loading, token, id]);

  function close() {
    navigator('/admin/payments');
  }

  if (!paymentData) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className='container'>
      <br /><br />
      <div className='row'>
        <div className='card col-md-10 offset-md-1'>

          {/* Header avec titre + bouton fermer */}
          <div className="d-flex justify-content-between align-items-center mt-3 px-3">
            <div></div>
            <h2 className="text-center flex-grow-1 m-0">{t('Payment', { ns: 'payments' })}</h2>
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={close}
              title={t('Close', { ns: 'payments' })}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          <div className='card-body'>
            <form>
              <div className='row'>
                <div className='col-md-6'>
                  <div className='form-group mb-2'>
                    <label className='form-label fw-bold'>{t('Customer_Name', { ns: 'payments' })}:</label>
                    <input type='text' value={paymentData.customerName} className='form-control' readOnly />
                  </div>
                  <div className='form-group mb-2'>
                    <label className='form-label fw-bold'>{t('Customer_Email', { ns: 'payments' })}:</label>
                    <input type='text' value={paymentData.customerMail} className='form-control' readOnly />
                  </div>
                  <div className='form-group mb-2'>
                    <label className='form-label fw-bold'>{t('Order_Id', { ns: 'payments' })}:</label>
                    <input type='text' value={paymentData.orderId} className='form-control' readOnly />
                  </div>
                </div>

                <div className='col-md-6'>
                  <div className='form-group mb-2'>
                    <label className='form-label fw-bold'>{t('Payment_Id', { ns: 'payments' })}:</label>
                    <input type='text' value={paymentData.paymentIdEvent} className='form-control' readOnly />
                  </div>
                  <div className='form-group mb-2'>
                    <label className='form-label fw-bold'>{t('Payment_Mode', { ns: 'payments' })}:</label>
                    <input type='text' value={paymentData.paymentMode} className='form-control' readOnly />
                  </div>
                  <div className='form-group mb-2'>
                    <label className='form-label fw-bold'>{t('Date', { ns: 'payments' })}:</label>
                    <input type='text' value={new Date(paymentData.timeStamp).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    })} className='form-control' readOnly />
                  </div>

                </div>
              </div>

              {/* Montants */}
              <div className='row mt-3'>
                <div className='col-md-4'>
                  <label className='form-label fw-bold'>{t('Amount', { ns: 'payments' })}:</label>
                  <input type='text' value={paymentData.amount.toFixed(2)} className='form-control' readOnly />
                </div>
                <div className='col-md-4'>
                  <label className='form-label fw-bold'>{t('Total_Tax', { ns: 'payments' })}:</label>
                  <input type='text' value={paymentData.totalTax.toFixed(2)} className='form-control' readOnly />
                </div>
                <div className='col-md-4'>
                  <label className='form-label fw-bold'>{t('Total_Discount', { ns: 'payments' })}:</label>
                  <input type='text' value={paymentData.totalDiscount.toFixed(2)} className='form-control' readOnly />
                </div>
              </div>

              {/* Produits */}
              {paymentData.products.length > 0 && (
                <div className='mt-4'>
                  <h5>{t('Products', { ns: 'payments' })}</h5>
                  <table className='table table-bordered'>
                    <thead className='table-light'>
                      <tr>
                        <th>{t('Product_Id', { ns: 'payments' })}</th>
                        <th>{t('Product_Name', { ns: 'payments' })}</th>
                        <th>{t('Quantity', { ns: 'payments' })}</th>
                        <th>{t('Price', { ns: 'payments' })}</th>
                        <th>{t('Discount', { ns: 'payments' })}</th>
                        <th>{t('Tax', { ns: 'payments' })}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentData.products.map((p, index) => (
                        <tr key={index}>
                          <td>{p.productId}</td>
                          <td>{p.productName}</td>
                          <td>{p.quantity}</td>
                          <td>{p.price.toFixed(2)}</td>
                          <td>{p.discount.toFixed(2)}</td>
                          <td>{p.tax.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );

};

export default Payment;
