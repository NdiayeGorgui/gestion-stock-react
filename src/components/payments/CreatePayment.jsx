import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAmountByCustomerId, getCustomer } from '../../services/OrderSrvice';
import { createPayment } from '../../services/PaymentService';
import Swal from 'sweetalert2';
import { printInvoice } from '../../services/BillingService';


const CreatePayment = () => {
  const { id } = useParams(); // customerIdEvent
  const navigate = useNavigate();

  const [paymentMode, setPaymentMode] = useState('');
  const [customer, setCustomer] = useState({});
  const [amountDto, setAmountDto] = useState({ amount: 0, totalAmount: 0, tax: 0, discount: 0 });

  const modes = [
    { id: 1, name: 'COMPTANT' },
    { id: 2, name: 'CHEQUE' },
    { id: 3, name: 'VIREMENT' },
  ];

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = async (customerId) => {
    try {
      const [customerRes, amountRes] = await Promise.all([
        getCustomer(customerId),
        getAmountByCustomerId(customerId),
      ]);

      setCustomer(customerRes.data);     // ✅ Ici
      setAmountDto(amountRes.data);     // ✅ Et ici
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };


const handleSubmit = async (e) => {
  e.preventDefault();

  if (!paymentMode) {
    Swal.fire({
      icon: 'warning',
      title: 'Attention',
      text: 'Veuillez sélectionner un mode de paiement.',
    });
    return;
  }

  Swal.fire({
    title: 'Confirmation',
    text: 'Voulez-vous confirmer le paiement et imprimer la facture ?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Oui, imprimer',
    cancelButtonText: 'Annuler',
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
          title: 'Succès',
          text: 'Paiement effectué et facture imprimée.',
        }).then(() => {
          navigate('/admin/payments');
        });
      } catch (error) {
        console.error('Erreur :', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de l\'impression ou du paiement.',
        });
      }
    }
  });
};



  return (
    <div className='container mt-5'>
      <div className='row'>
        <div className='card col-md-8 offset-md-2'>
          <h2 className='text-center mt-3'>Payment</h2>
          <div className='card-body'>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className='form-group mb-3'>
                    <label className='form-label fw-bold'>Payment Mode:</label>
                    <select
                      className='form-control'
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      required
                    >
                      <option value=''>-- Select Mode --</option>
                      {modes.map((mode) => (
                        <option key={mode.id} value={mode.name}>{mode.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className='form-group mb-3'>
                    <label className='form-label fw-bold'>Tax:</label>
                    <input
                      type='text'
                      className='form-control'
                      value={amountDto.tax !== undefined ? amountDto.tax.toFixed(2) : '0.00'}
                      readOnly
                    />
                  </div>



                  <div className='form-group mb-3'>
                    <label className='form-label fw-bold'>Amount:</label>
                    <input type='text' className='form-control' value={amountDto.amount !== undefined ? amountDto.amount.toFixed(2) : '0.00'} readOnly />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className='form-group mb-3'>
                    <label className='form-label fw-bold'>Customer Name:</label>
                    <input type='text' className='form-control' value={customer?.name ?? ''} readOnly />

                  </div>

                  <div className='form-group mb-3'>
                    <label className='form-label fw-bold'>Discount:</label>
                    <input type='text' className='form-control' value={amountDto.discount !== undefined ? amountDto.discount.toFixed(2) : '0.00'} readOnly />
                  </div>

                  <div className='form-group mb-3'>
                    <label className='form-label fw-bold'>Total Amount:</label>
                    <input type='text' className='form-control' value={amountDto.totalAmount !== undefined ? amountDto.totalAmount.toFixed(2) : '0.00'} readOnly />
                  </div>
                </div>
              </div>

              <button className='btn btn-primary' type='submit' disabled={!paymentMode}>
                Pay Now
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePayment;
