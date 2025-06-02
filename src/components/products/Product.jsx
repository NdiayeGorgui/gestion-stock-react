import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, getProduct, updateProduct } from '../../services/ProductService';
import Swal from 'sweetalert2';
import { useAuth } from '../hooks/useAuth';

const Product = () => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [qty, setQty] = useState('');
    const [qtyStatus, setQtyStatus] = useState('');

    const { id } = useParams();
    const [errors, setErrors] = useState({
        name: '',
        category: '',
        price: '',
        qty: ''
    });

    const navigator = useNavigate();
    const { token, loading } = useAuth();

    useEffect(() => {
         if (!loading && token && id) {
            getProduct(id).then((response) => {
                setName(response.data.name);
                setCategory(response.data.category);
                setPrice(response.data.price);
                setQty(response.data.qty);
                setQtyStatus(response.data.qtyStatus);
            }).catch(error => {
                console.error(error);
            });
        }
  }, [loading, token, id]);


    useEffect(() => {
        // recalcul qtyStatus à chaque changement de qty
        const q = parseInt(qty);
        if (isNaN(q)) return;

        if (q === 0) {
            setQtyStatus('UNAVAILABLE');
        } else if (q <= 10) {
            setQtyStatus('LOW');
        } else {
            setQtyStatus('AVAILABLE');
        }
    }, [qty]);

    function confirmSaveOrUpdate(e) {
    e.preventDefault();

    if (!validateForm()) {
        return; // Ne pas continuer si le formulaire est invalide
    }

    Swal.fire({
        title: id ? 'Confirm update' : 'Confirm add',
        text: id ? 'Are you sure you want to update this product ?' : 'Do you really want to save this product ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        confirmButtonText: id ? 'Yes, update' : 'Yes, save',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            saveOrUpdateProduct(e);
        }
    });
}

    function saveOrUpdateProduct(e) {
        e.preventDefault();

        if (validateForm()) {

            let updatedQtyStatus = '';
            const qtyNumber = parseInt(qty);

            if (qtyNumber === 0) {
                updatedQtyStatus = 'UNAVAILABLE';
            } else if (qtyNumber <= 5) {
                updatedQtyStatus = 'LOW';
            } else {
                updatedQtyStatus = 'AVAILABLE';
            }

            const product = { name, category, qty: qtyNumber, price, qtyStatus: updatedQtyStatus };


            console.log(product);

            if (id) {
                updateProduct(id, product).then((response) => {
                    console.log(response.data);
                    navigator('/admin/products', { state: { refresh: true } });

                }).catch(error => {
                    console.error(error);
                });
            } else {
                createProduct(product).then((response) => {
                    console.log(response.data);
                    navigator('/admin/products', { state: { refresh: true } });

                }).catch(error => {
                    console.error(error);
                });
            }
        }
    }

    function validateForm() {
        let valid = true;
        const errorsCopy = { ...errors };

        if (name.trim()) {
            errorsCopy.name = '';
        } else {
            errorsCopy.name = 'Product name is required';
            valid = false;
        }

        if (category.trim()) {
            errorsCopy.category = '';
        } else {
            errorsCopy.category = 'Product category is required';
            valid = false;
        }

        if (String(price).trim() && !isNaN(price)) {
            errorsCopy.price = '';
        } else {
            errorsCopy.price = 'Product price is required';
            valid = false;
        }

        if (String(qty).trim() && !isNaN(qty)) {
            errorsCopy.qty = '';
        } else {
            errorsCopy.qty = 'Product quantity is required';
            valid = false;
        }

        setErrors(errorsCopy);
        return valid;
    }

    function pageTitle() {
        return <h2 className='text-center'>{id ? 'Update Product' : 'Add Product'}</h2>;
    }

    return (
        <div className='container'>
            <br /> <br />
            <div className='row'>
                <div className='card col-md-6 offset-md-3 offset-md-3'>
                    {pageTitle()}
                    <div className='card-body'>
                        <form>
                            <div className='form-group mb-2'>
                                <label className='form-label'>Name:</label>
                                <input
                                    type='text'
                                    placeholder='Enter Product Name'
                                    name='name'
                                    value={name}
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                {errors.name && <div className='invalid-feedback'>{errors.name}</div>}
                            </div>

                            <div className='form-group mb-2'>
                                <label className='form-label'>Category:</label>
                                <input
                                    type='text'
                                    placeholder='Enter Product category'
                                    name='category'
                                    value={category}
                                    className={`form-control ${errors.category ? 'is-invalid' : ''}`}
                                    onChange={(e) => setCategory(e.target.value)}
                                />
                                {errors.category && <div className='invalid-feedback'>{errors.category}</div>}
                            </div>

                            <div className='form-group mb-2'>
                                <label className='form-label'>Price:</label>
                                <input
                                    type='text'
                                    placeholder='Enter Product price'
                                    name='price'
                                    value={price}
                                    className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                                {errors.price && <div className='invalid-feedback'>{errors.price}</div>}
                            </div>

                            <div className='form-group mb-2'>
                                <label className='form-label'>Quantity:</label>
                                <input
                                    type='text'
                                    placeholder='Enter Product quantity'
                                    name='qty'
                                    value={qty}
                                    className={`form-control ${errors.qty ? 'is-invalid' : ''}`}
                                    onChange={(e) => setQty(e.target.value)}
                                />
                                {errors.qty && <div className='invalid-feedback'>{errors.qty}</div>}
                            </div>

                            <div className='form-group mb-2'>
                                <label className='form-label'>Quantity Status:</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={qtyStatus}
                                    disabled
                                />
                            </div>

                            <button className='btn btn-success' onClick={confirmSaveOrUpdate}>Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product;
