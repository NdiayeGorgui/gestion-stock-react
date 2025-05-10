import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { createShip, getShip } from '../../services/ShippingService';

const Ship = () => {

  const [orderId, setOrderId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerMail, setCustomerMail] = useState(''); // ✅ Correction ici
  const [eventTimeStamp, setEventTimeStamp] = useState('');
  const [status, setStatus] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [details, setDetails] = useState('');


  const { id } = useParams();
  const navigator = useNavigate();

  useEffect(() => {
    if (id) {
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
  }, [id]);

  const handleShip = (e) => {
    e.preventDefault();

    const ship = {
      orderId,
      customerId,
      customerName,
      customerMail,
      eventTimeStamp,
      paymentId, // ✅ obligatoire pour que le backend valide
      status,
      details
    };

    createShip(ship)
      .then((response) => {
        console.log(response.data);
        navigator('/admin/ships');
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };


  return (
    <div className='container'>
    <br /><br />
    <div className='row'>
      <div className='card col-md-6 offset-md-3'>
        <h2 className='text-center'>Ship Order</h2>
        <div className='card-body'>
          <form>
            <div className='form-group mb-2'>
              <label className='form-label fw-bold'>Order Id:</label>
              <input type='text' name='orderId' value={orderId} className='form-control' readOnly />
            </div>
            <div className='form-group mb-2'>
              <label className='form-label fw-bold'>Customer Id:</label>
              <input type='text' name='customerId' value={customerId} className='form-control' readOnly />
            </div>
            <div className='form-group mb-2'>
              <label className='form-label fw-bold'>Customer Name:</label>
              <input type='text' name='customerName' value={customerName} className='form-control' readOnly />
            </div>
            <div className='form-group mb-2'>
              <label className='form-label fw-bold'>Customer Email:</label>
              <input type='text' name='customerMail' value={customerMail} className='form-control' readOnly />
            </div>
            <div className='form-group mb-2'>
              <label className='form-label fw-bold'>Date:</label>
              <input type='text' name='eventTimeStamp' value={eventTimeStamp} className='form-control' readOnly />
            </div>
            <div className='form-group mb-2'>
              <label className='form-label fw-bold'>Status:</label>
              <input type='text' name='status' value={status} className='form-control' readOnly />
            </div>

            <div className='text-center mt-4'>
              <button
                className='btn btn-success w-50'
                onClick={handleShip}
                disabled={status !== 'SHIPPING'}
              >
                Ship
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