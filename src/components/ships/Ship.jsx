import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { createShip, getShip } from '../../services/ShippingService';
import Swal from 'sweetalert2';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const Ship = () => {

  const [orderId, setOrderId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerMail, setCustomerMail] = useState(''); // ✅ Correction ici
  const [eventTimeStamp, setEventTimeStamp] = useState('');
  const [status, setStatus] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [details, setDetails] = useState('');

  const { t } = useTranslation();
  const { id } = useParams();
  const navigator = useNavigate();
  const { token, loading } = useAuth();

  useEffect(() => {
   if (!loading && token && id) {
      getShip(id)
        .then((response) => {
          setOrderId(response.data.orderId);
          setCustomerId(response.data.customerId);
          setCustomerName(response.data.customerName);
          setCustomerMail(response.data.customerMail); 
          setEventTimeStamp(response.data.eventTimeStamp);
          setStatus(response.data.status);
          setPaymentId(response.data.paymentId); // ✅ Important
          setDetails(response.data.details);
        })
        .catch((error) => {
          console.error(error);
        });
    }
}, [loading, token, id]);

  const handleShip = (e) => {
  e.preventDefault();

  const ship = {
    orderId,
    customerId,
    customerName,
    customerMail,
    eventTimeStamp,
    paymentId,
    status,
    details
  };

  Swal.fire({
    title: t('title_ship', { ns: 'ships' }),
    text: t('text_ship', { ns: 'ships' }),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText:  t('confirm_ship', { ns: 'ships' }),
    cancelButtonText: t('cancel', { ns: 'ships' }),
  }).then((result) => {
    if (result.isConfirmed) {
      createShip(ship)
        .then((response) => {
          console.log(response.data);
          Swal.fire(t('success_title', { ns: 'ships' }), t('success_message', { ns: 'ships' }), 'success').then(() => {
            navigator('/admin/ships');
           // window.location.reload();
          });
        })
        .catch((error) => {
          console.error(error);
          Swal.fire(t('error_title', { ns: 'ships' }), t('error_message', { ns: 'ships' }), 'error');
        });
    }
  });
};



  return (
    <div className='container'>
  <br /><br />
  <div className='row'>
    <div className='card col-md-8 offset-md-2'>
      <h2 className='text-center'>{t('Ship_Order', { ns: 'ships' })}</h2>
      <div className='card-body'>
        <form>
          <div className='row'>
            {/* Colonne 1 */}
            <div className='col-md-6'>
              <div className='form-group mb-3'>
                <label className='form-label fw-bold'>{t('Order_Id', { ns: 'ships' })}:</label>
                <input type='text' name='orderId' value={orderId} className='form-control' readOnly />
              </div>
              <div className='form-group mb-3'>
                <label className='form-label fw-bold'>{t('Date', { ns: 'ships' })}:</label>
                <input type='text' name='eventTimeStamp' value={eventTimeStamp} className='form-control' readOnly />
              </div>
              <div className='form-group mb-3'>
                <label className='form-label fw-bold'>{t('Status', { ns: 'ships' })}:</label>
                <input type='text' name='status' value={status} className='form-control' readOnly />
              </div>
            </div>

            {/* Colonne 2 */}
            <div className='col-md-6'>
              <div className='form-group mb-3'>
                <label className='form-label fw-bold'>{t('Customer_Id', { ns: 'ships' })}:</label>
                <input type='text' name='customerId' value={customerId} className='form-control' readOnly />
              </div>
              <div className='form-group mb-3'>
                <label className='form-label fw-bold'>{t('Customer_Name', { ns: 'ships' })}:</label>
                <input type='text' name='customerName' value={customerName} className='form-control' readOnly />
              </div>
              <div className='form-group mb-3'>
                <label className='form-label fw-bold'>{t('Customer_Email', { ns: 'ships' })}:</label>
                <input type='text' name='customerMail' value={customerMail} className='form-control' readOnly />
              </div>
            </div>
          </div>

          <div className='text-center mt-4'>
            <button
              className='btn btn-success w-50'
              onClick={handleShip}
              disabled={status !== 'SHIPPING'}
            >
              {t('Ship', { ns: 'ships' })}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

  )
}

export default Ship