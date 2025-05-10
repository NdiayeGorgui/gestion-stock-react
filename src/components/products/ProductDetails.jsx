import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from '../../services/ProductService'; // ✅ Assure-toi que ce chemin est correct

const ProductDetails = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState('');
  const [qtyStatus, setQtyStatus] = useState('');

  const { id } = useParams();

  useEffect(() => {
    if (id) {
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
  }, [id]);

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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
