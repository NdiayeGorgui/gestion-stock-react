import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrdersById } from '../../services/OrderSrvice';
import { createPayment } from '../../services/PaymentService';
import { printInvoice } from '../../services/BillingService';
import Swal from 'sweetalert2';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const CreatePayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { token, loading } = useAuth();

  const [order, setOrder] = useState(null);
  const [amountHT, setAmountHT] = useState(0);
  const [paymentMode, setPaymentMode] = useState('');

  const modes = [
    { id: 1, name: 'CASH' },
    { id: 2, name: 'CHECK' },
    { id: 3, name: 'TRANSFERT' },
  ];

  useEffect(() => {
    if (!loading && token && id) {
      getOrdersById(id)
        .then((res) => {
          const data = res.data;
          setOrder(data);

          // ✅ Calcul dynamique du montant HT
          const amount = data.items?.reduce((total, item) => {
            return total + item.price * item.quantity;
          }, 0) || 0;

          setAmountHT(amount);
        })
        .catch((err) => {
          console.error('Erreur lors du chargement de la commande :', err);
        });
    }
  }, [loading, token, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!paymentMode) {
      Swal.fire({
        icon: 'warning',
        title: t('title_attention', { ns: 'payments' }),
        text: t('title_select', { ns: 'payments' }),
      });
      return;
    }

    Swal.fire({
      title: t('Confirmation', { ns: 'payments' }),
      text: t('text_payment', { ns: 'payments' }),
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: t('confirm_payment', { ns: 'payments' }),
      cancelButtonText: t('cancel', { ns: 'payments' }),
    }).then(async (result) => {
      if (result.isConfirmed && order) {
        try {
          const response = await printInvoice(id);
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `Facture_${id}.xlsx`);
          document.body.appendChild(link);
          link.click();
          link.remove();

          const totalAmount = amountHT + order.totalTax - order.totalDiscount;

          const payment = {
            orderId: order.orderId,
            paymentMode,
            amount: amountHT,         // ✅ Montant HT calculé
            tax: order.totalTax,
            discount: order.totalDiscount,
            totalAmount: totalAmount, // ✅ Montant TTC
          };

          await createPayment(payment);

          Swal.fire({
            icon: 'success',
            title: t('success_title', { ns: 'payments' }),
            text: t('text_invoice', { ns: 'payments' }),
          }).then(() => {
            navigate('/admin/payments');
          });
        } catch (error) {
          console.error('Erreur :', error);
          Swal.fire({
            icon: 'error',
            title: t('error_title', { ns: 'payments' }),
            text: t('error_message', { ns: 'payments' }),
          });
        }
      }
    });
  };

  if (!order) {
    return <div className="container mt-5">Loading...</div>;
  }

  const totalAmount = amountHT + order.totalTax - order.totalDiscount;

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="card col-md-8 offset-md-2">

          {/* Header avec titre et bouton Fermer */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-1 px-3">
            <h2 className="text-center flex-grow-1 m-0">{t('Payment', { ns: 'payments' })}</h2>
            <button
              className="btn btn-outline-danger"
              onClick={() => navigate('/admin/created-orders')}
              title={t('Close', { ns: 'payments' })}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* Colonne 1 */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">{t('Payment_Mode', { ns: 'payments' })}:</label>
                    <select
                      className="form-control"
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      required
                    >
                      <option value="">-- {t('Select_Mode', { ns: 'payments' })} --</option>
                      {modes.map((mode) => (
                        <option key={mode.id} value={mode.name}>
                          {t(`payments.paymentModes.${mode.name}`, { ns: 'payments' })}
                        </option>
                      ))}

                    </select>
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">{t('Tax', { ns: 'payments' })}:</label>
                    <input type="text" className="form-control" value={order.totalTax.toFixed(2)} readOnly />
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">{t('Amount', { ns: 'payments' })} (HT):</label>
                    <input type="text" className="form-control" value={amountHT.toFixed(2)} readOnly />
                  </div>
                </div>

                {/* Colonne 2 */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">{t('Customer_Name', { ns: 'payments' })}:</label>
                    <input type="text" className="form-control" value={order.customerName || ''} readOnly />
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">{t('Discount', { ns: 'payments' })}:</label>
                    <input type="text" className="form-control" value={order.totalDiscount.toFixed(2)} readOnly />
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">{t('Total_Amount', { ns: 'payments' })} (TTC):</label>
                    <input
                      type="text"
                      className="form-control"
                      value={totalAmount.toFixed(2)}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="text-center mt-4">
                <button className="btn btn-primary" type="submit" disabled={!paymentMode}>
                  {t('Pay_Now', { ns: 'payments' })}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

};

export default CreatePayment;
