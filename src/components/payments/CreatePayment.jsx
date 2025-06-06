import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAmountByCustomerId, getCustomer } from '../../services/OrderSrvice';
import { createPayment } from '../../services/PaymentService';
import Swal from 'sweetalert2';
import { printInvoice } from '../../services/BillingService';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';


const CreatePayment = () => {
  const { id } = useParams(); // customerIdEvent
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [paymentMode, setPaymentMode] = useState('');
  const [customer, setCustomer] = useState({});
  const [amountDto, setAmountDto] = useState({ amount: 0, totalAmount: 0, tax: 0, discount: 0 });

  const modes = [
    { id: 1, name: 'COMPTANT' },
    { id: 2, name: 'CHEQUE' },
    { id: 3, name: 'VIREMENT' },
  ];
  const { token, loading } = useAuth();

  useEffect(() => {
  if (!loading && token && id) {
      fetchData(id);
    }
  }, [loading, token, id]);

  const fetchData = async (customerId) => {
    try {
      const [customerRes, amountRes] = await Promise.all([
        getCustomer(customerId),
        getAmountByCustomerId(customerId),
      ]);

      setCustomer(customerRes.data);     // ✅ Ici
      setAmountDto(amountRes.data);     // ✅ Et ici
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };


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
    if (result.isConfirmed) {
      try {
        // 1. Télécharger la facture d’abord
        const response = await printInvoice(id); // Appel avant createPayment
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Facture_${id}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();

        // 2. Ensuite créer le paiement
        const payment = {
          customerIdEvent: id,
          paymentMode,
          amount: amountDto.amount,
          tax: amountDto.tax,
          discount: amountDto.discount,
          totalAmount: amountDto.totalAmount,
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

  return (
    <div className='container mt-5'>
      <div className='row'>
        <div className='card col-md-8 offset-md-2'>
          <h2 className='text-center mt-3'>{t('Payment', { ns: 'payments' })}</h2>
          <div className='card-body'>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className='form-group mb-3'>
                    <label className='form-label fw-bold'>{t('Payment_Mode', { ns: 'payments' })}:</label>
                    <select
                      className='form-control'
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      required
                    >
                      <option value=''>-- {t('Select_Mode', { ns: 'payments' })} --<span>🔽</span></option>
                      {modes.map((mode) => (
                        <option key={mode.id} value={mode.name}>{mode.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className='form-group mb-3'>
                    <label className='form-label fw-bold'>{t('Tax', { ns: 'payments' })}:</label>
                    <input
                      type='text'
                      className='form-control'
                      value={amountDto.tax !== undefined ? amountDto.tax.toFixed(2) : '0.00'}
                      readOnly
                    />
                  </div>



                  <div className='form-group mb-3'>
                    <label className='form-label fw-bold'>{t('Amount', { ns: 'payments' })}:</label>
                    <input type='text' className='form-control' value={amountDto.amount !== undefined ? amountDto.amount.toFixed(2) : '0.00'} readOnly />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className='form-group mb-3'>
                    <label className='form-label fw-bold'>{t('Customer_Name', { ns: 'payments' })}:</label>
                    <input type='text' className='form-control' value={customer?.name ?? ''} readOnly />

                  </div>

                  <div className='form-group mb-3'>
                    <label className='form-label fw-bold'>{t('Discount', { ns: 'payments' })}:</label>
                    <input type='text' className='form-control' value={amountDto.discount !== undefined ? amountDto.discount.toFixed(2) : '0.00'} readOnly />
                  </div>

                  <div className='form-group mb-3'>
                    <label className='form-label fw-bold'>{t('Total_Amount', { ns: 'payments' })}:</label>
                    <input type='text' className='form-control' value={amountDto.totalAmount !== undefined ? amountDto.totalAmount.toFixed(2) : '0.00'} readOnly />
                  </div>
                </div>
              </div>

              <button className='btn btn-primary' type='submit' disabled={!paymentMode}>
                {t('Pay_Now', { ns: 'payments' })}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePayment;
