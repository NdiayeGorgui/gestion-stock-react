import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getOrder } from '../../services/OrderSrvice'
import { useAuth } from '../hooks/useAuth'

const OrderDetails = () => {
  const [orderDetails, setOrderDetails] = useState(null)
  const { id } = useParams();
  const navigator = useNavigate();
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
    return <div className='container mt-5'>Chargement des détails de la commande...</div>
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
      <h2 className='text-center mb-4'>Order Details</h2>
      <div className='row'>

        {/* Colonne 1 - Commande */}
        <div className='col-md-4'>
          <h5 className='text-primary'>Order</h5>
          <div className='form-group mb-3'>
            <label className='fw-bold'>Order IdEvent:</label>
            <input type='text' value={order?.orderIdEvent || ''} className='form-control' readOnly />
          </div>
          <div className='form-group mb-3'>
            <label className='fw-bold'>Order Id:</label>
            <input type='text' value={order?.id || ''} className='form-control' readOnly />
          </div>
          <div className='form-group mb-3'>
            <label className='fw-bold'>Date:</label>
            <input type='text' value={order?.date || ''} className='form-control' readOnly />
          </div>
          <div className='form-group mb-3'>
            <label className='fw-bold'>Status:</label>
            <input type='text' value={order?.orderStatus || ''} className='form-control' readOnly />
          </div>
          <div className='form-group mb-3'>
            <label className='fw-bold'>Discount:</label>
            <input type='text' value={discount} className='form-control' readOnly />
          </div>
        </div>

        {/* Colonne 2 - Client */}
        <div className='col-md-4'>
          <h5 className='text-success'>Customer</h5>
          <div className='form-group mb-3'>
            <label className='fw-bold'>Customer Id:</label>
            <input type='text' value={customer?.customerIdEvent || ''} className='form-control' readOnly />
          </div>
          <div className='form-group mb-3'>
            <label className='fw-bold'>Name:</label>
            <input type='text' value={customer?.name || ''} className='form-control' readOnly />
          </div>
          <div className='form-group mb-3'>
            <label className='fw-bold'>Email:</label>
            <input type='text' value={customer?.email || ''} className='form-control' readOnly />
          </div>
          <div className='form-group mb-3'>
            <label className='fw-bold'>Phone:</label>
            <input type='text' value={customer?.phone || ''} className='form-control' readOnly />
          </div>
          <div className='form-group mb-3'>
            <label className='fw-bold'>Address:</label>
            <input type='text' value={customer?.address || ''} className='form-control' readOnly />
          </div>
        </div>

        {/* Colonne 3 - Produit */}
        <div className='col-md-4'>
          <h5 className='text-danger'>Product</h5>
          <div className='form-group mb-3'>
            <label className='fw-bold'>Product IdEvent:</label>
            <input type='text' value={productIdEvent} className='form-control' readOnly />
          </div>
          <div className='form-group mb-3'>
            <label className='fw-bold'>Name:</label>
            <input type='text' value={product?.name || ''} className='form-control' readOnly />
          </div>
          <div className='form-group mb-3'>
            <label className='fw-bold'>Category:</label>
            <input type='text' value={product?.category || ''} className='form-control' readOnly />
          </div>
          <div className='form-group mb-3'>
            <label className='fw-bold'>Quantity:</label>
            <input type='text' value={quantity} className='form-control' readOnly />
          </div>
          <div className='form-group mb-3'>
            <label className='fw-bold'>Price:</label>
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
                  Close
                </button>
              </div>
    </div>
  )
}

export default OrderDetails
