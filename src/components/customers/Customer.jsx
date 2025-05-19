import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createCustomer, getCustomer, updateCustomer } from '../../services/CustomerService'
import Swal from 'sweetalert2'

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

    const navigator = useNavigate();

    useEffect(() => {

        if (id) {
            getCustomer(id).then((response) => {
                setName(response.data.name);
                setAddress(response.data.address);
                setPhone(response.data.phone);
                setEmail(response.data.email);

            }).catch(error => {
                console.error(error);
            })
        }

    }, [id])

    function confirmSaveOrUpdate(e) {
        e.preventDefault();

        Swal.fire({
            title: id ? 'Confirm update' : 'Confirm add',
            text: id ? 'Are you sure you want to update this customer ?' : 'Do you really want to save this customer ?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#d33',
            confirmButtonText: id ? 'Yes, update' : 'Yes, save',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                saveOrUpdateCustomer(e);
            }
        });
    }


    function saveOrUpdateCustomer(e) {
        e.preventDefault();

        if (validateForm()) {

            const customer = { name, address, phone, email }
            console.log(customer)

            if (id) {
                updateCustomer(id, customer).then((response) => {
                    console.log(response.data);
                    navigator('/admin/customers');
                    window.location.reload(); // recharge toute la page
                }).catch(error => {
                    console.error(error);
                })
            } else {
                createCustomer(customer).then((response) => {
                    console.log(response.data);
                    navigator('/admin/customers')
                    window.location.reload(); // recharge toute la page
                }).catch(error => {
                    console.error(error);
                })
            }
        }
    }

    function validateForm() {
        let valid = true;

        const errorsCopy = { ...errors }

        if (name.trim()) {
            errorsCopy.name = '';
        } else {
            errorsCopy.name = 'Customer name is required';
            valid = false;
        }

        if (address.trim()) {
            errorsCopy.address = '';
        } else {
            errorsCopy.address = 'Customer address is required';
            valid = false;
        }

        if (phone.trim()) {
            errorsCopy.phone = '';
        } else {
            errorsCopy.phone = 'Customer phone is required';
            valid = false;
        }

        if (email.trim()) {
            errorsCopy.email = '';
        } else {
            errorsCopy.email = 'Customer email is required';
            valid = false;
        }

        setErrors(errorsCopy);

        return valid;

    }
    function pageTitle() {
        if (id) {
            return <h2 className='text-center'>Update Customer</h2>
        } else {
            return <h2 className='text-center'>Add Customer</h2>
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
                                <label className='form-label'>Name:</label>
                                <input
                                    type='text'
                                    placeholder='Enter Customer Name'
                                    name='name'
                                    value={name}
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    onChange={(e) => setName(e.target.value)}
                                >
                                </input>
                                {errors.name && <div className='invalid-feedback'> {errors.name} </div>}
                            </div>

                            <div className='form-group mb-2'>
                                <label className='form-label'>Address:</label>
                                <input
                                    type='text'
                                    placeholder='Enter Customer address'
                                    name='address'
                                    value={address}
                                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                    onChange={(e) => setAddress(e.target.value)}
                                >
                                </input>
                                {errors.address && <div className='invalid-feedback'> {errors.address} </div>}
                            </div>

                            <div className='form-group mb-2'>
                                <label className='form-label'>Phone:</label>
                                <input
                                    type='text'
                                    placeholder='Enter Customer phone'
                                    name='phone'
                                    value={phone}
                                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                    onChange={(e) => setPhone(e.target.value)}
                                >
                                </input>
                                {errors.phone && <div className='invalid-feedback'> {errors.phone} </div>}
                            </div>

                            <div className='form-group mb-2'>
                                <label className='form-label'>Email:</label>
                                <input
                                    type='text'
                                    placeholder='Enter Customer email'
                                    name='email'
                                    value={email}
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    onChange={(e) => setEmail(e.target.value)}
                                >
                                </input>
                                {errors.email && <div className='invalid-feedback'> {errors.email} </div>}
                            </div>
                            <button className='btn btn-success' onClick={confirmSaveOrUpdate}>Submit</button>
                        </form>

                    </div>
                </div>

            </div>

        </div>
    )
}

export default Customer