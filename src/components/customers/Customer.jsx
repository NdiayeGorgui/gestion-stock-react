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
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');



    const { id } = useParams();
    const [errors, setErrors] = useState({
        name: '',
        address: '',
        city: '',
        postalCode: '',
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
                setCity(response.data.city || '');
                setPostalCode(response.data.postalCode || '');

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

        const customer = { name, address, city, postalCode, phone, email };


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
                    text: t('server_error_text', { ns: 'customers' }),
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
        if (city.trim()) {
            errorsCopy.city = '';
        } else {
            errorsCopy.city = t('Customer_City_Required', { ns: 'customers' });
            valid = false;
        }

        if (postalCode.trim()) {
            errorsCopy.postalCode = '';
        } else {
            errorsCopy.postalCode = t('Customer_PostalCode_Required', { ns: 'customers' });
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
      <div className='card col-md-8 offset-md-2'>
        
        {/* Ligne du haut : Submit | Titre | Fermer */}
        <div className="d-flex justify-content-between align-items-center mt-3 mb-4 px-3">
          <button className="btn btn-success" onClick={confirmSaveOrUpdate}>
            {t('Submit', { ns: 'customers' })}
          </button>

          <h2 className="text-center flex-grow-1 m-0">
            {id ? t('Update_Customer', { ns: 'customers' }) : t('Add_Customer', { ns: 'customers' })}
          </h2>

          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={() => navigator('/admin/customers')}
            title={t('Close', { ns: 'customers' })}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Formulaire */}
        <div className='card-body'>
          <form>
            <div className="row">
              {/* Colonne 1 */}
              <div className="col-md-6">
                {/* Name */}
                <div className='form-group mb-3'>
                  <label className='form-label'>{t('Name', { ns: 'customers' })}:</label>
                  <input
                    type='text'
                    name='name'
                    value={name}
                    placeholder={t('Customer_Name', { ns: 'customers' })}
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {errors.name && <div className='invalid-feedback'>{errors.name}</div>}
                </div>

                {/* Address */}
                <div className='form-group mb-3'>
                  <label className='form-label'>{t('Address', { ns: 'customers' })}:</label>
                  <input
                    type='text'
                    name='address'
                    value={address}
                    placeholder={t('Customer_Address', { ns: 'customers' })}
                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  {errors.address && <div className='invalid-feedback'>{errors.address}</div>}
                </div>

                {/* City */}
                <div className='form-group mb-3'>
                  <label className='form-label'>{t('City', { ns: 'customers' })}:</label>
                  <input
                    type='text'
                    name='city'
                    value={city}
                    placeholder={t('Customer_City', { ns: 'customers' })}
                    className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  {errors.city && <div className='invalid-feedback'>{errors.city}</div>}
                </div>
              </div>

              {/* Colonne 2 */}
              <div className="col-md-6">
                {/* Postal Code */}
                <div className='form-group mb-3'>
                  <label className='form-label'>{t('PostalCode', { ns: 'customers' })}:</label>
                  <input
                    type='text'
                    name='postalCode'
                    value={postalCode}
                    placeholder={t('Customer_PostalCode', { ns: 'customers' })}
                    className={`form-control ${errors.postalCode ? 'is-invalid' : ''}`}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                  {errors.postalCode && <div className='invalid-feedback'>{errors.postalCode}</div>}
                </div>

                {/* Phone */}
                <div className='form-group mb-3'>
                  <label className='form-label'>{t('Phone', { ns: 'customers' })}:</label>
                  <input
                    type='text'
                    name='phone'
                    value={phone}
                    placeholder={t('Customer_Phone', { ns: 'customers' })}
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  {errors.phone && <div className='invalid-feedback'>{errors.phone}</div>}
                </div>

                {/* Email */}
                <div className='form-group mb-3'>
                  <label className='form-label'>{t('Email', { ns: 'customers' })}:</label>
                  <input
                    type='email'
                    name='email'
                    value={email}
                    placeholder={t('Customer_Email', { ns: 'customers' })}
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && <div className='invalid-feedback'>{errors.email}</div>}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
);

}

export default Customer