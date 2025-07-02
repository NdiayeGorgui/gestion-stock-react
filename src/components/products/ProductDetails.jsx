import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProduct } from '../../services/ProductService';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const ProductDetails = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState('');
  const [qtyStatus, setQtyStatus] = useState('');
  const [productIdEvent, setProductIdEvent] = useState(''); // Nouveau état

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
          setDescription(response.data.description);
          setLocation(response.data.location);
          setPrice(response.data.price);
          setQty(response.data.qty);
          setQtyStatus(response.data.qtyStatus);
          setProductIdEvent(response.data.productIdEvent || ''); // On récupère le nouveau champ
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
    <div className="container">
      <br /> <br />
      <div className="row">
        <div className="card col-md-6 offset-md-3 position-relative">
          {/* Ligne titre + bouton fermer */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-4 px-3 position-relative" style={{ height: '48px' }}>
            <h2 className="m-0 flex-grow-1 text-center">{t('Product_Details', { ns: 'products' })}</h2>
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={close}
              title={t('Close', { ns: 'products' })}
              style={{ minWidth: '40px' }}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          <div className="card-body">
            <form>
              <div className="row">
                {/* Colonne 1 */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">{t('Name', { ns: 'products' })}:</label>
                    <input type="text" value={name} className="form-control" readOnly />
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label">{t('Description', { ns: 'products' })}:</label>
                    <textarea value={description} className="form-control" readOnly />
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label">{t('Price', { ns: 'products' })}:</label>
                    <input type="text" value={price} className="form-control" readOnly />
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label">{t('Quantity_Status', { ns: 'products' })}:</label>
                    <input
                      type="text"
                      value={t(`qtyStatus.${qtyStatus}`, { ns: 'products' })}
                      className="form-control"
                      readOnly
                    />
                  </div>
                </div>

                {/* Colonne 2 */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">{t('Category', { ns: 'products' })}:</label>
                    <input type="text" value={category} className="form-control" readOnly />
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label">{t('Location', { ns: 'products' })}:</label>
                    <textarea value={location} className="form-control" readOnly />
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label">{t('Quantity', { ns: 'products' })}:</label>
                    <input type="text" value={qty} className="form-control" readOnly />
                  </div>

                  {/* Nouveau champ productIdEvent */}
                  <div className="form-group mb-3">
                    <label className="form-label">{t('Product_ID_Event', { ns: 'products' })}:</label>
                    <input type="text" value={productIdEvent} className="form-control" readOnly />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
