import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBill } from '../../services/BillingService';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const Bill = () => {
  const [billData, setBillData] = useState(null);
  const { id } = useParams();
  const navigator = useNavigate();
  const { t } = useTranslation();

  const { token, loading } = useAuth();

  useEffect(() => {
     if (!loading && token && id) {
      getBill(id)
        .then((response) => {
          setBillData(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
 }, [loading, token, id]);

       function close() {
    navigator('/admin/bills');
  }

  if (!billData) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className='container'>
      <br /><br />
      <div className='row'>
        <div className='card col-md-8 offset-md-2'>
          <h2 className='text-center mt-3'> {t('Bill', { ns: 'bills' })}</h2>
          <div className='card-body'>
            <form>
              <div className="row">
                {/* Colonne gauche */}
                <div className="col-md-6">
                  <div className='form-group mb-2'>
                    <label className='form-label fw-bold'> {t('Id', { ns: 'bills' })}:</label>
                    <input type='text' value={billData.id} className='form-control' readOnly />
                  </div>
                  <div className='form-group mb-2'>
                    <label className='form-label fw-bold'> {t('Order_Id', { ns: 'bills' })}:</label>
                    <input type='text' value={billData.orderId} className='form-control' readOnly />
                  </div>
                  <div className='form-group mb-2'>
                    <label className='form-label fw-bold'> {t('Order_Ref', { ns: 'bills' })}:</label>
                    <input type='text' value={billData.orderRef} className='form-control' readOnly />
                  </div>
                  <div className='form-group mb-2'>
                    <label className='form-label fw-bold'> {t('Customer_Id', { ns: 'bills' })}:</label>
                    <input type='text' value={billData.customerIdEvent} className='form-control' readOnly />
                  </div>
                  <div className='form-group mb-2'>
                    <label className='form-label fw-bold'> {t('Customer_Name', { ns: 'bills' })}:</label>
                    <input type='text' value={billData.customerName} className='form-control' readOnly />
                  </div>
                  <div className='form-group mb-2'>
                    <label className='form-label fw-bold'> {t('Customer_Email', { ns: 'bills' })}:</label>
                    <input type='text' value={billData.customerMail} className='form-control' readOnly />
                  </div>
                  <div className='form-group mb-2'>
                    <label className='form-label fw-bold'> {t('Customer_Phone', { ns: 'bills' })}:</label>
                    <input type='text' value={billData.customerPhone} className='form-control' readOnly />
                  </div>
                </div>

                {/* Colonne droite */}
                <div className="col-md-6">
                  <div className='form-group mb-2'>
                    <label className='form-label fw-bold'> {t('Product_Id', { ns: 'bills' })}:</label>
                    <input type='text' value={billData.productIdEvent} className='form-control' readOnly />
                  </div>
                  <div className='form-group mb-2'>
                    <label className='form-label fw-bold'> {t('Product_Name', { ns: 'bills' })}:</label>
                    <input type='text' value={billData.productName} className='form-control' readOnly />
                  </div>
                  <div className='form-group mb-2'>
                    <label className='form-label fw-bold'> {t('Quantity', { ns: 'bills' })}:</label>
                    <input type='text' value={billData.quantity} className='form-control' readOnly />
                  </div>
                  <div className='form-group mb-2'>
                    <label className='form-label fw-bold'> {t('Price', { ns: 'bills' })}:</label>
                    <input type='text' value={billData.price} className='form-control' readOnly />
                  </div>
                  <div className='form-group mb-2'>
                    <label className='form-label fw-bold'> {t('Discount', { ns: 'bills' })}:</label>
                    <input type='text' value={billData.discount} className='form-control' readOnly />
                  </div>
                  <div className='form-group mb-2'>
                    <label className='form-label fw-bold'> {t('Billing_Date', { ns: 'bills' })}:</label>
                    <input type='text' value={billData.billingDate} className='form-control' readOnly />
                  </div>
                  <div className='form-group mb-2'>
                    <label className='form-label fw-bold'> {t('Status', { ns: 'bills' })}:</label>
                    <input type='text' value={billData.status} className='form-control' readOnly />
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={() => close()}
                  className="btn btn-primary"
                  style={{ width: '50%' }}
                >
                   {t('Close', { ns: 'bills' })}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bill;
