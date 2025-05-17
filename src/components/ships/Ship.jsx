import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { createShip, getShip } from '../../services/ShippingService';
import Swal from 'sweetalert2';

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
    paymentId,
    status,
    details
  };

  Swal.fire({
    title: 'Confirm shipment?',
    text: 'Are you sure you want to create this shipment?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, ship',
    cancelButtonText: 'Cancel',
  }).then((result) => {
    if (result.isConfirmed) {
      createShip(ship)
        .then((response) => {
          console.log(response.data);
          Swal.fire('Success', 'The expedition has been created.', 'success').then(() => {
            navigator('/admin/ships');
            window.location.reload();
          });
        })
        .catch((error) => {
          console.error(error);
          Swal.fire('Error', "Creation failed.", 'error');
        });
    }
  });
};



  return (
    <div className='container'>
  <br /><br />
  <div className='row'>
    <div className='card col-md-8 offset-md-2'>
      <h2 className='text-center'>Ship Order</h2>
      <div className='card-body'>
        <form>
          <div className='row'>
            {/* Colonne 1 */}
            <div className='col-md-6'>
              <div className='form-group mb-3'>
                <label className='form-label fw-bold'>Order Id:</label>
                <input type='text' name='orderId' value={orderId} className='form-control' readOnly />
              </div>
              <div className='form-group mb-3'>
                <label className='form-label fw-bold'>Date:</label>
                <input type='text' name='eventTimeStamp' value={eventTimeStamp} className='form-control' readOnly />
              </div>
              <div className='form-group mb-3'>
                <label className='form-label fw-bold'>Status:</label>
                <input type='text' name='status' value={status} className='form-control' readOnly />
              </div>
            </div>

            {/* Colonne 2 */}
            <div className='col-md-6'>
              <div className='form-group mb-3'>
                <label className='form-label fw-bold'>Customer Id:</label>
                <input type='text' name='customerId' value={customerId} className='form-control' readOnly />
              </div>
              <div className='form-group mb-3'>
                <label className='form-label fw-bold'>Customer Name:</label>
                <input type='text' name='customerName' value={customerName} className='form-control' readOnly />
              </div>
              <div className='form-group mb-3'>
                <label className='form-label fw-bold'>Customer Email:</label>
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