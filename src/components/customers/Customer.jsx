import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createCustomer, customerExistByEmail, getCustomer, updateCustomer } from '../../services/CustomerService'
import Swal from 'sweetalert2'
import { useAuth } from '../hooks/useAuth'
import { useTranslation } from 'react-i18next'

const Customer = () => {

    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')


    const { id } = useParams();
    const [errors, setErrors] = useState({
        name: '',
        address: '',
        phone: '',
        email: ''
    })

    const { t } = useTranslation();
    const navigator = useNavigate();
    const { token, loading } = useAuth();

    useEffect(() => {

         if (!loading && token && id) {
            getCustomer(id).then((response) => {
                setName(response.data.name);
                setAddress(response.data.address);
                setPhone(response.data.phone);
                setEmail(response.data.email);

            }).catch(error => {
                console.error(error);
            })
        }

   }, [loading, token, id]);

    function confirmSaveOrUpdate(e) {
        e.preventDefault();

        if (!validateForm()) {
            return; // Ne rien faire si la validation échoue
        }

        Swal.fire({
            title: id ? t('title_update', { ns: 'customers' }) : t('title_add', { ns: 'customers' }),
            text: id ? t('text_update', { ns: 'customers' }) : t('text_add', { ns: 'customers' }),
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#d33',
            confirmButtonText: id ? t('confirm_update', { ns: 'customers' }) : t('confirm_add', { ns: 'customers' }),
            cancelButtonText: t('cancel', { ns: 'customers' })
        }).then((result) => {
            if (result.isConfirmed) {
                saveOrUpdateCustomer(e);
            }
        });
    }


    const saveOrUpdateCustomer = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const customer = { name, address, phone, email };

        if (!id) {
            try {
                const response = await customerExistByEmail(email);
                const exists = response.data.exists;

                if (exists) {
                    Swal.fire({
                        icon: 'error',
                        title: t('warning_title', { ns: 'customers' }),
                        text: response.data.message,
                        confirmButtonColor: '#d33'
                    });
                    return;
                }
            } catch (error) {
                console.error('Error verifying email:', error);
                Swal.fire({
                    icon: 'error',
                    title: t('title_server_error', { ns: 'customers' }),
                    text: t('server_error', { ns: 'customers' }),
                    confirmButtonColor: '#d33'
                });
                return;
            }
        }

        const action = id
            ? updateCustomer(id, customer)
            : createCustomer(customer);

        action
            .then(() => {
                navigator('/admin/customers', { state: { refresh: true } });
            })
            .catch((error) => {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: t('error_title', { ns: 'customers' }),
                    text:  t('server_error_text', { ns: 'customers' }),
                    confirmButtonColor: '#d33'
                });
            });
    };

    function validateForm() {
        let valid = true;

        const errorsCopy = { ...errors }

        if (name.trim()) {
            errorsCopy.name = '';
        } else {
            errorsCopy.name = t('Customer_Name_Required', { ns: 'customers' });
            valid = false;
        }

        if (address.trim()) {
            errorsCopy.address = '';
        } else {
            errorsCopy.address = t('Customer_Address_Required', { ns: 'customers' });
            valid = false;
        }

        if (phone.trim()) {
            errorsCopy.phone = '';
        } else {
            errorsCopy.phone = t('Customer_Phone_Required', { ns: 'customers' });
            valid = false;
        }

        if (email.trim()) {
            errorsCopy.email = '';
        } else {
            errorsCopy.email = t('Customer_Email_Required', { ns: 'customers' });
            valid = false;
        }

        setErrors(errorsCopy);

        return valid;

    }
    function pageTitle() {
        if (id) {
            return <h2 className='text-center'> {t('Update_Customer', { ns: 'customers' })}</h2>
        } else {
            return <h2 className='text-center'> {t('Add_Customer', { ns: 'customers' })}</h2>
        }
    }

    return (
        <div className='container'>
            <br /> <br />
            <div className='row'>
                <div className='card col-md-6 offset-md-3 offset-md-3'>
                    {
                        pageTitle()
                    }
                    <div className='card-body'>
                        <form>
                            <div className='form-group mb-2'>
                                <label className='form-label'>{t('Name', { ns: 'customers' })}:</label>
                                <input
                                    type='text'
                                    placeholder={t('Customer_Name', { ns: 'customers' })}
                                    name='name'
                                    value={name}
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    onChange={(e) => setName(e.target.value)}
                                >
                                </input>
                                {errors.name && <div className='invalid-feedback'> {errors.name} </div>}
                            </div>

                            <div className='form-group mb-2'>
                                <label className='form-label'>{t('Address', { ns: 'customers' })}:</label>
                                <input
                                    type='text'
                                    placeholder={t('Customer_Address', { ns: 'customers' })}
                                    name='address'
                                    value={address}
                                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                    onChange={(e) => setAddress(e.target.value)}
                                >
                                </input>
                                {errors.address && <div className='invalid-feedback'> {errors.address} </div>}
                            </div>

                            <div className='form-group mb-2'>
                                <label className='form-label'>{t('Phone', { ns: 'customers' })}:</label>
                                <input
                                    type='text'
                                    placeholder={t('Customer_Phone', { ns: 'customers' })}
                                    name='phone'
                                    value={phone}
                                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                    onChange={(e) => setPhone(e.target.value)}
                                >
                                </input>
                                {errors.phone && <div className='invalid-feedback'> {errors.phone} </div>}
                            </div>

                            <div className='form-group mb-2'>
                                <label className='form-label'>{t('Email', { ns: 'customers' })}:</label>
                                <input
                                    type='text'
                                    placeholder={t('Customer_Email', { ns: 'customers' })}
                                    name='email'
                                    value={email}
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    onChange={(e) => setEmail(e.target.value)}
                                >
                                </input>
                                {errors.email && <div className='invalid-feedback'> {errors.email} </div>}
                            </div>
                            <button className='btn btn-success' onClick={confirmSaveOrUpdate}>{t('Submit', { ns: 'customers' })}</button>
                        </form>

                    </div>
                </div>

            </div>

        </div>
    )
}

export default Customer