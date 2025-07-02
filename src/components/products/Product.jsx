import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, getProduct, updateProduct } from '../../services/ProductService';
import Swal from 'sweetalert2';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const Product = () => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [qty, setQty] = useState('');
    const [qtyStatus, setQtyStatus] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [createdDate] = useState(new Date().toISOString().slice(0, 10));



    const { id } = useParams();
    const [errors, setErrors] = useState({
        name: '',
        category: '',
        description: '',
        location: '',
        price: '',
        qty: ''
    });

    const navigator = useNavigate();
    const { t } = useTranslation();
    const { token, loading } = useAuth();

    useEffect(() => {
        if (!loading && token && id) {
            getProduct(id).then((response) => {
                setName(response.data.name);
                setCategory(response.data.category);
                setDescription(response.data.description);
                setLocation(response.data.location);
                setCreatedDate(response.data.createdDate || '');
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
            title: id ? t('title_update', { ns: 'products' }) : t('title_add', { ns: 'products' }),
            text: id ? t('text_update', { ns: 'products' }) : t('text_add', { ns: 'products' }),
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#d33',
            confirmButtonText: id ? t('confirm_update', { ns: 'products' }) : t('confirm_add', { ns: 'products' }),
            cancelButtonText: t('cancel', { ns: 'products' })
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

            const product = { name, category, description, location, qty: qtyNumber, price, qtyStatus: updatedQtyStatus };


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
            errorsCopy.name = t('Product_Name_Required', { ns: 'products' });
            valid = false;
        }
        if (description.trim()) {
            errorsCopy.description = '';
        } else {
            errorsCopy.description = t('Product_Description_Required', { ns: 'products' });
            valid = false;
        }

        if (location.trim()) {
            errorsCopy.location = '';
        } else {
            errorsCopy.location = t('Product_Location_Required', { ns: 'products' });
            valid = false;
        }


        if (category.trim()) {
            errorsCopy.category = '';
        } else {
            errorsCopy.category = t('Product_Category_Required', { ns: 'products' });
            valid = false;
        }

        if (String(price).trim() && !isNaN(price)) {
            errorsCopy.price = '';
        } else {
            errorsCopy.price = t('Product_Price_Required', { ns: 'products' });
            valid = false;
        }

        if (String(qty).trim() && !isNaN(qty)) {
            errorsCopy.qty = '';
        } else {
            errorsCopy.qty = t('Product_Quantity_Required', { ns: 'products' });
            valid = false;
        }

        setErrors(errorsCopy);
        return valid;
    }

    function pageTitle() {
        return (
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="text-center w-100">{id ? t('Update_Product', { ns: 'products' }) : t('Add_Product', { ns: 'products' })}</h2>

                {/* Bouton Fermer en haut à droite */}
                <button
                    type="button"
                    className="btn btn-outline-danger position-absolute end-0 top-0 m-3"
                    onClick={() => navigator('/admin/products')}
                    title={t('Close', { ns: 'products' })}
                >
                    <i className="bi bi-x-lg"></i>
                </button>
            </div>
        );
    }

    return (
        <div className='container'>
            <br /> <br />
            <div className='row'>
                <div className='card col-md-6 offset-md-3 offset-md-3 position-relative'>

                    {/* Ligne titre + bouton submit + bouton fermer */}
                    <div className="d-flex justify-content-between align-items-center mt-3 mb-4 px-3 position-relative">
                        {/* Bouton Submit à gauche */}
                        <button
                            className="btn btn-success"
                            onClick={confirmSaveOrUpdate}
                        >
                            {t('Submit', { ns: 'products' })}
                        </button>

                        {/* Titre centré */}
                        <h2 className="text-center flex-grow-1 m-0">
                            {id ? t('Update_Product', { ns: 'products' }) : t('Add_Product', { ns: 'products' })}
                        </h2>

                        {/* Bouton Fermer à droite */}
                        <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => navigator('/admin/products')}
                            title={t('Close', { ns: 'products' })}
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>

                    {/* Corps du formulaire */}
                    <div className='card-body'>
                        <form>
                            <div className="row">
                                {/* Colonne 1 */}
                                <div className="col-md-6">
                                    {/* Name */}
                                    <div className="form-group mb-3">
                                        <label className="form-label">{t('Name', { ns: 'products' })}:</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={name}
                                            placeholder={t('Product_Name', { ns: 'products' })}
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                    </div>

                                    {/* Description */}
                                    <div className="form-group mb-3">
                                        <label className="form-label">{t('Description', { ns: 'products' })}:</label>
                                        <textarea
                                            name="description"
                                            value={description}
                                            placeholder={t('Product_Description', { ns: 'products' })}
                                            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                                    </div>

                                    {/* Price */}
                                    <div className="form-group mb-3">
                                        <label className="form-label">{t('Price', { ns: 'products' })}:</label>
                                        <input
                                            type="text"
                                            name="price"
                                            value={price}
                                            placeholder={t('Product_Price', { ns: 'products' })}
                                            className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                                            onChange={(e) => setPrice(e.target.value)}
                                        />
                                        {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                                    </div>

                                    {/* Qty Status */}
                                    <div className="form-group mb-3">
                                        <label className="form-label">{t('Quantity_Status', { ns: 'products' })}:</label>
                                        <input
                                            type="text"
                                            value={qtyStatus}
                                            className="form-control"
                                            disabled
                                        />
                                    </div>
                                </div>

                                {/* Colonne 2 */}
                                <div className="col-md-6">
                                    {/* Category */}
                                    <div className="form-group mb-3">
                                        <label className="form-label">{t('Category', { ns: 'products' })}:</label>
                                        <input
                                            type="text"
                                            name="category"
                                            value={category}
                                            placeholder={t('Product_Category', { ns: 'products' })}
                                            className={`form-control ${errors.category ? 'is-invalid' : ''}`}
                                            onChange={(e) => setCategory(e.target.value)}
                                        />
                                        {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                                    </div>

                                    {/* Location */}
                                    <div className="form-group mb-3">
                                        <label className="form-label">{t('Location', { ns: 'products' })}:</label>
                                        <textarea
                                            name="location"
                                            value={location}
                                            placeholder={t('Product_Location', { ns: 'products' })}
                                            className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                                            onChange={(e) => setLocation(e.target.value)}
                                        />
                                        {errors.location && <div className="invalid-feedback">{errors.location}</div>}
                                    </div>

                                    {/* Quantity */}
                                    <div className="form-group mb-3">
                                        <label className="form-label">{t('Quantity', { ns: 'products' })}:</label>
                                        <input
                                            type="text"
                                            name="qty"
                                            value={qty}
                                            placeholder={t('Product_Quantity', { ns: 'products' })}
                                            className={`form-control ${errors.qty ? 'is-invalid' : ''}`}
                                            onChange={(e) => setQty(e.target.value)}
                                        />
                                        {errors.qty && <div className="invalid-feedback">{errors.qty}</div>}
                                    </div>

                                    {/* Created Date */}
                                    <div className="form-group mb-3">
                                        <label className="form-label">{t('Created_Date', { ns: 'products' })}:</label>
                                        <input
                                            type="date"
                                            value={createdDate}
                                            className="form-control"
                                            readOnly
                                        />
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

export default Product;
