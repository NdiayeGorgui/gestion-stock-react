import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProduct } from '../../services/ProductService'; // ✅ Assure-toi que ce chemin est correct
import { useAuth } from '../hooks/useAuth';

const ProductDetails = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState('');
  const [qtyStatus, setQtyStatus] = useState('');

  const { id } = useParams();
  const navigator = useNavigate();

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
          <h2 className='text-center'>Product Details</h2>
          <div className='card-body'>
            <form>
              <div className='form-group mb-2'>
                <label className='form-label'>Name:</label>
                <input
                  type='text'
                  name='name'
                  value={name}
                  className='form-control'
                  readOnly
                />
              </div>

              <div className='form-group mb-2'>
                <label className='form-label'>Category:</label>
                <input
                  type='text'
                  name='category'
                  value={category}
                  className='form-control'
                  readOnly
                />
              </div>

              <div className='form-group mb-2'>
                <label className='form-label'>Price:</label>
                <input
                  type='text'
                  name='price'
                  value={price}
                  className='form-control'
                  readOnly
                />
              </div>

              <div className='form-group mb-2'>
                <label className='form-label'>Quantity:</label>
                <input
                  type='text'
                  name='qty'
                  value={qty}
                  className='form-control'
                  readOnly
                />
              </div>

              <div className='form-group mb-2'>
                <label className='form-label'>Quantity Status:</label>
                <input
                  type='text'
                  name='qtyStatus'
                  value={qtyStatus}
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
                  Close
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
