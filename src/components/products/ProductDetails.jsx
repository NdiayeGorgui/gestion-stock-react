import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProduct } from '../../services/ProductService'; // ✅ Assure-toi que ce chemin est correct
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const ProductDetails = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState('');
  const [qtyStatus, setQtyStatus] = useState('');

  const { id } = useParams();
  const navigator = useNavigate();
  const { t } = useTranslation();

  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading && token && id) {
      getProduct(id)
        .then((response) => {
          setName(response.data.name);
          setCategory(response.data.category);
          setPrice(response.data.price);
          setQty(response.data.qty);
          setQtyStatus(response.data.qtyStatus);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [loading, token, id]);

  function close() {
    navigator('/admin/products');
  }

  return (
    <div className='container'>
      <br /> <br />
      <div className='row'>
        <div className='card col-md-6 offset-md-3'>
          <h2 className='text-center'>{t('Product_Details', { ns: 'products' })}</h2>
          <div className='card-body'>
            <form>
              <div className='form-group mb-2'>
                <label className='form-label'>{t('Name', { ns: 'products' })}:</label>
                <input
                  type='text'
                  name='name'
                  value={name}
                  className='form-control'
                  readOnly
                />
              </div>

              <div className='form-group mb-2'>
                <label className='form-label'>{t('Category', { ns: 'products' })}:</label>
                <input
                  type='text'
                  name='category'
                  value={category}
                  className='form-control'
                  readOnly
                />
              </div>

              <div className='form-group mb-2'>
                <label className='form-label'>{t('Price', { ns: 'products' })}:</label>
                <input
                  type='text'
                  name='price'
                  value={price}
                  className='form-control'
                  readOnly
                />
              </div>

              <div className='form-group mb-2'>
                <label className='form-label'>{t('Quantity', { ns: 'products' })}:</label>
                <input
                  type='text'
                  name='qty'
                  value={qty}
                  className='form-control'
                  readOnly
                />
              </div>

              <div className='form-group mb-2'>
                <label className='form-label'>{t('Quantity_Status', { ns: 'products' })}:</label>
                <input
                  type='text'
                  name='qtyStatus'
                  value={t(`qtyStatus.${qtyStatus}`, { ns: 'products' })}
                  className='form-control'
                  readOnly
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={() => close()}
                  className="btn btn-primary"
                  style={{ width: '50%' }}
                >
                  {t('Close', { ns: 'products' })}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
