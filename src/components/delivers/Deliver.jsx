import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createDeliver, getDeliver } from '../../services/DeliverService';
import Swal from 'sweetalert2';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const Deliver = () => {
  const [orderId, setOrderId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerMail, setCustomerMail] = useState('');
  const [eventTimeStamp, setEventTimeStamp] = useState('');
  const [status, setStatus] = useState('');
  const [paymentId, setPaymentId] = useState('');

  const { t } = useTranslation();
  const { id } = useParams();
  const navigator = useNavigate();
  const { token, loading } = useAuth();

  useEffect(() => {
   if (!loading && token && id) {
      getDeliver(id)
        .then((response) => {
          setOrderId(response.data.orderId);
          setCustomerId(response.data.customerId);
          setCustomerName(response.data.customerName);
          setCustomerMail(response.data.customerMail);
          setEventTimeStamp(response.data.eventTimeStamp);
          setStatus(response.data.status);
          setPaymentId(response.data.paymentId);
        })
        .catch((error) => {
          console.error(error);
        });
    }
 }, [loading, token, id]);

  const handleDeliver = (e) => {
    e.preventDefault();

    const deliver = {
      orderId,
      customerId,
      customerName,
      customerMail,
      eventTimeStamp,
      paymentId,
      status,
    };

    Swal.fire({
      title: t('title_delivery', { ns: 'delivers' }),
      text: t('text_delivery', { ns: 'delivers' }),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('confirm_delivery', { ns: 'delivers' }),
      cancelButtonText: t('cancel', { ns: 'delivers' }),
    }).then((result) => {
      if (result.isConfirmed) {
        createDeliver(deliver)
          .then(() => {
            Swal.fire(t('success_title', { ns: 'delivers' }), t('success_message', { ns: 'delivers' }), 'success').then(() => {
              navigator('/admin/delivers');
             // window.location.reload();
            });
          })
          .catch((error) => {
            console.error(error);
            Swal.fire(t('error_title', { ns: 'delivers' }), t('error_message', { ns: 'delivers' }), 'error');
          });
      }
    });
  };

      function close() {
    navigator('/admin/customers', { state: { refresh: true } });
  }

  return (
    <div className='container'>
      <br /><br />
      <div className='row justify-content-center'>
        <div className='card col-md-10'>
          <h2 className='text-center mt-3'> {t('Deliver_Order', { ns: 'delivers' })}</h2>
          <div className='card-body'>
            <form onSubmit={handleDeliver}>
              <div className='row'>
                {/* Colonne 1 */}
                <div className='col-md-6'>
                  <div className='form-group mb-3'>
                    <label className='form-label fw-bold'> {t('Order_Id', { ns: 'delivers' })}:</label>
                    <input type='text' value={orderId} className='form-control' readOnly />
                  </div>
                  
                  <div className='form-group mb-3'>
                    <label className='form-label fw-bold'> {t('Date', { ns: 'delivers' })}:</label>
                    <input type='text' value={eventTimeStamp} className='form-control' readOnly />
                  </div>
                  <div className='form-group mb-3'>
                    <label className='form-label fw-bold'> {t('Status', { ns: 'delivers' })}:</label>
                    <input type='text' value={status} className='form-control' readOnly />
                  </div>
                </div>

                {/* Colonne 2 */}
                <div className='col-md-6'>
                  <div className='form-group mb-3'>
                    <label className='form-label fw-bold'> {t('Customer_Id', { ns: 'delivers' })}:</label>
                    <input type='text' value={customerId} className='form-control' readOnly />
                  </div>
                  <div className='form-group mb-3'>
                    <label className='form-label fw-bold'> {t('Customer_Name', { ns: 'delivers' })}:</label>
                    <input type='text' value={customerName} className='form-control' readOnly />
                  </div>
                  <div className='form-group mb-3'>
                    <label className='form-label fw-bold'> {t('Customer_Email', { ns: 'delivers' })}:</label>
                    <input type='text' value={customerMail} className='form-control' readOnly />
                  </div>
                  
                </div>
              </div>

              {/* Bouton centré */}
              <div className='text-center mt-4'>
                <button
                  type='submit'
                  className='btn btn-success w-50'
                  disabled={status !== 'DELIVERING'}
                >
                   {t('Deliver', { ns: 'delivers' })}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deliver;
