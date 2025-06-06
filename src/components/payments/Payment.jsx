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
        <div className='card col-md-8 offset-md-2'>
          <h2 className='text-center mt-3'>{t('Payment', { ns: 'payments' })}</h2>
          <div className='card-body'>
            <form>
              <div className="row">
                {/* Colonne gauche */}
                <div className="col-md-6">
                  <div className='form-group mb-2'>
                    <label className='form-label fw-bold'>{t('Customer_Id', { ns: 'payments' })}:</label>
                    <input type='text' value={paymentData.customerIdEvent} className='form-control' readOnly />
                  </div>
                  <div className='form-group mb-2'>
                    <label className='form-label fw-bold'>{t('Customer_Name', { ns: 'payments' })}:</label>
                    <input type='text' value={paymentData.customerName} className='form-control' readOnly />
                  </div>
                  <div className='form-group mb-2'>
                    <label className='form-label fw-bold'>{t('Customer_Email', { ns: 'payments' })}:</label>
                    <input type='text' value={paymentData.customerMail} className='form-control' readOnly />
                  </div>
                  <div className='form-group mb-2'>
                    <label className='form-label fw-bold'>{t('Payment_Id', { ns: 'payments' })}:</label>
                    <input type='text' value={paymentData.paymentIdEvent} className='form-control' readOnly />
                  </div>
                </div>

                {/* Colonne droite */}
                <div className="col-md-6">
                  <div className='form-group mb-2'>
                    <label className='form-label fw-bold'>{t('Payment_Mode', { ns: 'payments' })}:</label>
                    <input type='text' value={paymentData.paymentMode} className='form-control' readOnly />
                  </div>
                  <div className='form-group mb-2'>
                    <label className='form-label fw-bold'>{t('Amount', { ns: 'payments' })}:</label>
                    <input type='text' value={paymentData.amount} className='form-control' readOnly />
                  </div>
                  <div className='form-group mb-2'>
                    <label className='form-label fw-bold'>{t('Date', { ns: 'payments' })}:</label>
                    <input type='text' value={paymentData.timeStamp} className='form-control' readOnly />
                  </div>
                  <div className='form-group mb-2'>
                    <label className='form-label fw-bold'>{t('Status', { ns: 'payments' })}:</label>
                    <input type='text' value={paymentData.paymentStatus} className='form-control' readOnly />
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={() => close()}
                  className="btn btn-primary"
                  style={{ width: '50%' }}
                >
                  {t('Close', { ns: 'payments' })}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
