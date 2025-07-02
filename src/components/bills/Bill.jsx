import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBill, printInvoicePdf } from '../../services/BillingService';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const Bill = () => {
  const [billData, setBillData] = useState(null);
  const { id } = useParams();
  const navigator = useNavigate();
  const { token, loading } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    if (!loading && token && id) {
      getBill(id)
        .then((response) => {
          setBillData(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [loading, token, id]);

  const close = () => {
    navigator('/admin/bills');
  };

const handlePrint = async () => {
  try {
    const response = await printInvoicePdf(id); 
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
  } catch (err) {
    console.error('Erreur lors de l\'impression :', err);
  }
};



  if (!billData) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container">
      <br /><br />
      <div className="row">
        <div className="card col-md-10 offset-md-1">

          {/* Ligne supérieure : bouton fermer en haut à droite */}
          <div className="d-flex justify-content-between align-items-center mt-3 px-3">
            {/* Bouton Print à gauche */}
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handlePrint}
              title={t('Print', { ns: 'bills' })}
            >
              <i className="bi bi-printer"></i>
            </button>

            {/* Titre centré */}
            <h2 className="text-center flex-grow-1 m-0">{t('Bill', { ns: 'bills' })}</h2>

            {/* Bouton Fermer à droite */}
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={close}
              title={t('Close', { ns: 'bills' })}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>


          <div className="card-body">
            <form>
              <div className="row">
                {/* Colonne gauche */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">{t('Order_Id', { ns: 'bills' })}:</label>
                    <input type="text" value={billData.orderId} className="form-control" readOnly />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">{t('Customer_Name', { ns: 'bills' })}:</label>
                    <input type="text" value={billData.customerName} className="form-control" readOnly />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">{t('Customer_Email', { ns: 'bills' })}:</label>
                    <input type="text" value={billData.customerMail} className="form-control" readOnly />
                  </div>

                </div>

                {/* Colonne droite */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">{t('Customer_Phone', { ns: 'bills' })}:</label>
                    <input type="text" value={billData.customerPhone} className="form-control" readOnly />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">{t('Billing_Date', { ns: 'bills' })}:</label>
                    <input
                      type="text"
                      value={new Date(billData.billingDate).toLocaleDateString('fr-FR')}
                      className="form-control"
                      readOnly
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">{t('Status', { ns: 'bills' })}:</label>
                    <input
                      type="text"
                      value={t(`bills.statusValues.${billData.billStatus}`, { ns: 'bills' })}
                      className="form-control"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Montants */}
              <div className="row">
                <div className="col-md-4">
                  <label className="form-label fw-bold">{t('Amount', { ns: 'bills' })}:</label>
                  <input type="text" value={billData.amount.toFixed(2)} className="form-control" readOnly />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">{t('Total_Tax', { ns: 'bills' })}:</label>
                  <input type="text" value={billData.totalTax.toFixed(2)} className="form-control" readOnly />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">{t('Total_Discount', { ns: 'bills' })}:</label>
                  <input type="text" value={billData.totalDiscount.toFixed(2)} className="form-control" readOnly />
                </div>
              </div>

              {/* Produits */}
              {billData.products?.length > 0 && (
                <div className="mt-4">
                  <h5>{t('Products', { ns: 'bills' })}</h5>
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>{t('Product_Id', { ns: 'bills' })}</th>
                        <th>{t('Product_Name', { ns: 'bills' })}</th>
                        <th>{t('Quantity', { ns: 'bills' })}</th>
                        <th>{t('Price', { ns: 'bills' })}</th>
                        <th>{t('Discount', { ns: 'bills' })}</th>
                        <th>{t('Tax', { ns: 'bills' })}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {billData.products.map((p, index) => (
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

export default Bill;
