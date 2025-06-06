import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getOrder } from '../../services/OrderSrvice'
import { useAuth } from '../hooks/useAuth'
import { useTranslation } from 'react-i18next'

const OrderDetails = () => {
  const [orderDetails, setOrderDetails] = useState(null)
  const { id } = useParams();
  const navigator = useNavigate();
  const { t } = useTranslation();
  const { token, loading } = useAuth();

  useEffect(() => {
   if (!loading && token && id) {
      getOrder(id)
        .then((response) => {
          setOrderDetails(response.data)
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération de la commande:', error)
        })
    }
}, [loading, token, id]);

function close() {
  if (order?.orderStatus === 'CANCELED') {
    navigator('/admin/canceled-orders');
  } else {
    navigator('/admin/completed-orders');
  }
}


  if (!orderDetails) {
    return <div className='container mt-5'>Loading...</div>
  }

  const {
    order,
    product,
    quantity,
    price,
    discount,
    productIdEvent
  } = orderDetails

  const customer = order?.customer

  return (
    <div className='container mt-5'>
      <h2 className='text-center mb-4'>{t('Order_Details', { ns: 'createdorders' })}</h2>
      <div className='row'>

        {/* Colonne 1 - Commande */}
        <div className='col-md-4'>
          <h5 className='text-primary'>{t('Order', { ns: 'createdorders' })}</h5>
          <div className='form-group mb-3'>
            <label className='fw-bold'>{t('Order_IdEvent', { ns: 'createdorders' })}:</label>
            <input type='text' value={order?.orderIdEvent || ''} className='form-control' readOnly />
          </div>
          <div className='form-group mb-3'>
            <label className='fw-bold'>{t('Order_Id', { ns: 'createdorders' })}:</label>
            <input type='text' value={order?.id || ''} className='form-control' readOnly />
          </div>
          <div className='form-group mb-3'>
            <label className='fw-bold'>{t('Date', { ns: 'createdorders' })}:</label>
            <input type='text' value={order?.date || ''} className='form-control' readOnly />
          </div>
          <div className='form-group mb-3'>
            <label className='fw-bold'>{t('Status', { ns: 'createdorders' })}:</label>
            <input type='text' value={order?.orderStatus || ''} className='form-control' readOnly />
          </div>
          <div className='form-group mb-3'>
            <label className='fw-bold'>{t('Discount', { ns: 'createdorders' })}:</label>
            <input type='text' value={discount} className='form-control' readOnly />
          </div>
        </div>

        {/* Colonne 2 - Client */}
        <div className='col-md-4'>
          <h5 className='text-success'>{t('Customer', { ns: 'createdorders' })}</h5>
          <div className='form-group mb-3'>
            <label className='fw-bold'>{t('Customer_idEvent', { ns: 'createdorders' })}:</label>
            <input type='text' value={customer?.customerIdEvent || ''} className='form-control' readOnly />
          </div>
          <div className='form-group mb-3'>
            <label className='fw-bold'>{t('Customer_Name', { ns: 'createdorders' })}:</label>
            <input type='text' value={customer?.name || ''} className='form-control' readOnly />
          </div>
          <div className='form-group mb-3'>
            <label className='fw-bold'>{t('Email', { ns: 'createdorders' })}:</label>
            <input type='text' value={customer?.email || ''} className='form-control' readOnly />
          </div>
          <div className='form-group mb-3'>
            <label className='fw-bold'>{t('Phone', { ns: 'createdorders' })}:</label>
            <input type='text' value={customer?.phone || ''} className='form-control' readOnly />
          </div>
          <div className='form-group mb-3'>
            <label className='fw-bold'>{t('Address', { ns: 'createdorders' })}:</label>
            <input type='text' value={customer?.address || ''} className='form-control' readOnly />
          </div>
        </div>

        {/* Colonne 3 - Produit */}
        <div className='col-md-4'>
          <h5 className='text-danger'>{t('Product', { ns: 'createdorders' })}</h5>
          <div className='form-group mb-3'>
            <label className='fw-bold'>{t('Product_IdEvent', { ns: 'createdorders' })}:</label>
            <input type='text' value={productIdEvent} className='form-control' readOnly />
          </div>
          <div className='form-group mb-3'>
            <label className='fw-bold'>{t('Product_Name', { ns: 'createdorders' })}:</label>
            <input type='text' value={product?.name || ''} className='form-control' readOnly />
          </div>
          <div className='form-group mb-3'>
            <label className='fw-bold'>{t('Category', { ns: 'createdorders' })}:</label>
            <input type='text' value={product?.category || ''} className='form-control' readOnly />
          </div>
          <div className='form-group mb-3'>
            <label className='fw-bold'>{t('Quantity', { ns: 'createdorders' })}:</label>
            <input type='text' value={quantity} className='form-control' readOnly />
          </div>
          <div className='form-group mb-3'>
            <label className='fw-bold'>{t('Price', { ns: 'createdorders' })}:</label>
            <input type='text' value={price} className='form-control' readOnly />
          </div>
        </div>

      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={() => close()}
                  className="btn btn-primary"
                  style={{ width: '50%' }}
                >
                  {t('Close', { ns: 'createdorders' })}
                </button>
              </div>
    </div>
  )
}

export default OrderDetails
