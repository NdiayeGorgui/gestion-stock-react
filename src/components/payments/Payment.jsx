import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPayment } from '../../services/PaymentService';
import { useAuth } from '../hooks/useAuth';

const Payment = () => {
  const [paymentData, setPaymentData] = useState(null);
  const { id } = useParams();
  const { token, loading } = useAuth();
  const navigator = useNavigate();

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
          <h2 className='text-center mt-3'>Payment</h2>
          <div className='card-body'>
            <form>
              <div className="row">
                {/* Colonne gauche */}
                <div className="col-md-6">
                  <div className='form-group mb-2'>
                    <label className='form-label fw-bold'>Customer Id:</label>
                    <input type='text' value={paymentData.customerIdEvent} className='form-control' readOnly />
                  </div>
                  <div className='form-group mb-2'>
                    <label className='form-label fw-bold'>Customer Name:</label>
                    <input type='text' value={paymentData.customerName} className='form-control' readOnly />
                  </div>
                  <div className='form-group mb-2'>
                    <label className='form-label fw-bold'>Customer Email:</label>
                    <input type='text' value={paymentData.customerMail} className='form-control' readOnly />
                  </div>
                  <div className='form-group mb-2'>
                    <label className='form-label fw-bold'>Payment Id:</label>
                    <input type='text' value={paymentData.paymentIdEvent} className='form-control' readOnly />
                  </div>
                </div>

                {/* Colonne droite */}
                <div className="col-md-6">
                  <div className='form-group mb-2'>
                    <label className='form-label fw-bold'>Payment Mode:</label>
                    <input type='text' value={paymentData.paymentMode} className='form-control' readOnly />
                  </div>
                  <div className='form-group mb-2'>
                    <label className='form-label fw-bold'>Amount:</label>
                    <input type='text' value={paymentData.amount} className='form-control' readOnly />
                  </div>
                  <div className='form-group mb-2'>
                    <label className='form-label fw-bold'>Date:</label>
                    <input type='text' value={paymentData.timeStamp} className='form-control' readOnly />
                  </div>
                  <div className='form-group mb-2'>
                    <label className='form-label fw-bold'>Status:</label>
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
                  Close
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
