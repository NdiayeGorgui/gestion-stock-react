import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createDeliver, getDeliver } from '../../services/DeliverService';
import Swal from 'sweetalert2';

const Deliver = () => {
  const [orderId, setOrderId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerMail, setCustomerMail] = useState('');
  const [eventTimeStamp, setEventTimeStamp] = useState('');
  const [status, setStatus] = useState('');
  const [paymentId, setPaymentId] = useState('');

  const { id } = useParams();
  const navigator = useNavigate();

  useEffect(() => {
    if (id) {
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
  }, [id]);

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
      title: 'Confirm delivery ?',
      text: 'Are you sure you want to create this delivery ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, deliver',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        createDeliver(deliver)
          .then(() => {
            Swal.fire('Success', 'The delivery has been created.', 'success').then(() => {
              navigator('/admin/delivers');
             // window.location.reload();
            });
          })
          .catch((error) => {
            console.error(error);
            Swal.fire('Error', 'Creation failed.', 'error');
          });
      }
    });
  };

  return (
    <div className='container'>
      <br /><br />
      <div className='row justify-content-center'>
        <div className='card col-md-10'>
          <h2 className='text-center mt-3'>Deliver Order</h2>
          <div className='card-body'>
            <form onSubmit={handleDeliver}>
              <div className='row'>
                {/* Colonne 1 */}
                <div className='col-md-6'>
                  <div className='form-group mb-3'>
                    <label className='form-label fw-bold'>Order Id:</label>
                    <input type='text' value={orderId} className='form-control' readOnly />
                  </div>
                  
                  <div className='form-group mb-3'>
                    <label className='form-label fw-bold'>Date:</label>
                    <input type='text' value={eventTimeStamp} className='form-control' readOnly />
                  </div>
                  <div className='form-group mb-3'>
                    <label className='form-label fw-bold'>Status:</label>
                    <input type='text' value={status} className='form-control' readOnly />
                  </div>
                </div>

                {/* Colonne 2 */}
                <div className='col-md-6'>
                  <div className='form-group mb-3'>
                    <label className='form-label fw-bold'>Customer Id:</label>
                    <input type='text' value={customerId} className='form-control' readOnly />
                  </div>
                  <div className='form-group mb-3'>
                    <label className='form-label fw-bold'>Customer Name:</label>
                    <input type='text' value={customerName} className='form-control' readOnly />
                  </div>
                  <div className='form-group mb-3'>
                    <label className='form-label fw-bold'>Customer Email:</label>
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
                  Deliver
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
