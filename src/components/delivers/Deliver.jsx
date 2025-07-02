import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createDeliver, getDeliver } from '../../services/DeliverService';
import Swal from 'sweetalert2';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const Deliver = () => {
  const [orderId, setOrderId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerMail, setCustomerMail] = useState('');
  const [timeStamp, setTimeStamp] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [amount, setAmount] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [products, setProducts] = useState([]);

  const { t } = useTranslation();
  const { id } = useParams();
  const navigator = useNavigate();
  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading && token && id) {
      getDeliver(id)
        .then((response) => {
          const data = response.data;
          setOrderId(data.orderId);
          setCustomerName(data.customerName);
          setCustomerMail(data.customerMail);
          setTimeStamp(data.timeStamp);
          setDeliveryStatus(data.deliveryStatus);
          setPaymentId(data.paymentId);
          setAmount(data.amount);
          setTotalTax(data.totalTax);
          setTotalDiscount(data.totalDiscount);
          setProducts(data.products || []);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [loading, token, id]);

  const handleDeliver = (e) => {
    e.preventDefault();
    const delivery = {
      orderId,
      paymentId,
      customerName,
      customerMail,
      amount,
      totalTax,
      totalDiscount,
      deliveryStatus,
      timeStamp,
      products,
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
        createDeliver(delivery)
          .then(() => {
            Swal.fire(
              t('success_title', { ns: 'delivers' }),
              t('success_message', { ns: 'delivers' }),
              'success'
            ).then(() => {
              navigator('/admin/delivers');
            });
          })
          .catch((error) => {
            console.error(error);
            Swal.fire(t('error_title', { ns: 'delivers' }), t('error_message', { ns: 'delivers' }), 'error');
          });
      }
    });
  };

  return (
    <div className="container">
      <br /><br />
      <div className="row">
        <div className="card col-md-10 offset-md-1">

          {/* Haut : Deliver | Titre | Fermer */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-4 px-3">
            <button
              type="submit"
              className="btn btn-success"
              onClick={handleDeliver}
              disabled={deliveryStatus !== 'DELIVERING'}
            >
              {t('Deliver', { ns: 'delivers' })}
            </button>

            <h2 className="text-center flex-grow-1 m-0">
              {deliveryStatus === 'DELIVERED'
                ? t('Order_Delivered', { ns: 'delivers' })
                : t('Deliver_Order', { ns: 'delivers' })}
            </h2>


            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => navigator('/admin/delivers')}
              title={t('Close', { ns: 'delivers' })}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          <div className="card-body">
            <form onSubmit={handleDeliver}>
              <div className="row">
                {/* Colonne 1 */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">{t('Order_Id', { ns: 'delivers' })}:</label>
                    <input type="text" value={orderId} className="form-control" readOnly />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">{t('Date', { ns: 'delivers' })}:</label>
                    <input type="text" value={new Date(timeStamp).toLocaleDateString('fr-FR')} className="form-control" readOnly />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">{t('Delivery_Status', { ns: 'delivers' })}:</label>
                    <input type="text" value={t(`delivers.statusValues.${deliveryStatus}`, { ns: 'delivers' })} className="form-control" readOnly />
                  </div>
                </div>

                {/* Colonne 2 */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">{t('Customer_Name', { ns: 'delivers' })}:</label>
                    <input type="text" value={customerName} className="form-control" readOnly />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">{t('Customer_Email', { ns: 'delivers' })}:</label>
                    <input type="text" value={customerMail} className="form-control" readOnly />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">{t('Payment_Id', { ns: 'delivers' })}:</label>
                    <input type="text" value={paymentId} className="form-control" readOnly />
                  </div>
                </div>
              </div>

              {/* Montants */}
              <div className="row">
                <div className="col-md-4">
                  <label className="form-label fw-bold">{t('Amount', { ns: 'delivers' })}:</label>
                  <input type="text" value={amount.toFixed(2)} className="form-control" readOnly />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">{t('Total_Tax', { ns: 'delivers' })}:</label>
                  <input type="text" value={totalTax.toFixed(2)} className="form-control" readOnly />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">{t('Total_Discount', { ns: 'delivers' })}:</label>
                  <input type="text" value={totalDiscount.toFixed(2)} className="form-control" readOnly />
                </div>
              </div>

              {/* Produits */}
            
              {products.length > 0 && (
                <div className="mt-4">
                <h5>{t('Products', { ns: 'delivers' })}</h5>
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>{t('Product_Id', { ns: 'delivers' })}</th>
                        <th>{t('Product_Name', { ns: 'delivers' })}</th>
                        <th>{t('Quantity', { ns: 'delivers' })}</th>
                        <th>{t('Price', { ns: 'delivers' })}</th>
                        <th>{t('Discount', { ns: 'delivers' })}</th>
                        <th>{t('Tax', { ns: 'delivers' })}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p, index) => (
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

export default Deliver;
