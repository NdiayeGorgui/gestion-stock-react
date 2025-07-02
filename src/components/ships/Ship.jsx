import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createShip, getShip } from '../../services/ShippingService';
import Swal from 'sweetalert2';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const Ship = () => {
  const [orderId, setOrderId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerMail, setCustomerMail] = useState('');
  const [eventTimeStamp, setEventTimeStamp] = useState('');
  const [shippingStatus, setShippingStatus] = useState('');
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
      getShip(id)
        .then((response) => {
          const data = response.data;
          setOrderId(data.orderId);
          setCustomerName(data.customerName);
          setCustomerMail(data.customerMail);
          setEventTimeStamp(data.eventTimeStamp);
          setShippingStatus(data.shippingStatus);
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

  const handleShip = (e) => {
    e.preventDefault();
    const ship = {
      orderId,
      paymentId,
      customerName,
      customerMail,
      amount,
      totalTax,
      totalDiscount,
      shippingStatus,
      eventTimeStamp,
      products,
    };

    Swal.fire({
      title: t('title_ship', { ns: 'ships' }),
      text: t('text_ship', { ns: 'ships' }),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('confirm_ship', { ns: 'ships' }),
      cancelButtonText: t('cancel', { ns: 'ships' }),
    }).then((result) => {
      if (result.isConfirmed) {
        createShip(ship)
          .then(() => {
            Swal.fire(
              t('success_title', { ns: 'ships' }),
              t('success_message', { ns: 'ships' }),
              'success'
            ).then(() => {
              navigator('/admin/ships');
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
    <div className="container">
      <br /><br />
      <div className="row">
        <div className="card col-md-10 offset-md-1">

          {/* Haut : bouton Ship - Titre - bouton Fermer */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-4 px-3">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={handleShip}
              disabled={shippingStatus !== 'SHIPPING'}
            >
              {t('Ship', { ns: 'ships' })}
            </button>

            <h2 className="text-center flex-grow-1 m-0">
              {shippingStatus === 'SHIPPED'
                ? t('Order_Shipped', { ns: 'ships' })
                : t('Ship_Order', { ns: 'ships' })}
            </h2>


            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => navigator('/admin/ships')}
              title={t('Close', { ns: 'ships' })}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          <div className="card-body">
            <form onSubmit={handleShip}>
              <div className="row">
                {/* Colonne 1 */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">{t('Order_Id', { ns: 'ships' })}:</label>
                    <input type="text" value={orderId} className="form-control" readOnly />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">{t('Date', { ns: 'ships' })}:</label>
                    <input type="text" value={new Date(eventTimeStamp).toLocaleDateString('fr-FR')} className="form-control" readOnly />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">{t('Shipping_Status', { ns: 'ships' })}:</label>
                    <input type="text" value={t(`ships.statusValues.${shippingStatus}`, { ns: 'ships' })} className="form-control" readOnly />
                  </div>
                </div>

                {/* Colonne 2 */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">{t('Customer_Name', { ns: 'ships' })}:</label>
                    <input type="text" value={customerName} className="form-control" readOnly />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">{t('Customer_Email', { ns: 'ships' })}:</label>
                    <input type="text" value={customerMail} className="form-control" readOnly />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">{t('Payment_Id', { ns: 'ships' })}:</label>
                    <input type="text" value={paymentId} className="form-control" readOnly />
                  </div>
                </div>
              </div>

              {/* Montants */}
              <div className="row">
                <div className="col-md-4">
                  <label className="form-label fw-bold">{t('Amount', { ns: 'ships' })}:</label>
                  <input type="text" value={amount.toFixed(2)} className="form-control" readOnly />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">{t('Total_Tax', { ns: 'ships' })}:</label>
                  <input type="text" value={totalTax.toFixed(2)} className="form-control" readOnly />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">{t('Total_Discount', { ns: 'ships' })}:</label>
                  <input type="text" value={totalDiscount.toFixed(2)} className="form-control" readOnly />
                </div>
              </div>

              {/* Produits */}
              {products.length > 0 && (
                <div className="mt-4">
                  <h5>{t('Products', { ns: 'ships' })}</h5>
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>{t('Product_Id', { ns: 'ships' })}</th>
                        <th>{t('Product_Name', { ns: 'ships' })}</th>
                        <th>{t('Quantity', { ns: 'ships' })}</th>
                        <th>{t('Price', { ns: 'ships' })}</th>
                        <th>{t('Discount', { ns: 'ships' })}</th>
                        <th>{t('Tax', { ns: 'ships' })}</th>
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

export default Ship;
