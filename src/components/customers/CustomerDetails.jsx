import React, { useEffect, useState } from 'react';
import { getCustomer } from '../../services/CustomerService';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const CustomerDetails = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [customerIdEvent, setCustomerIdEvent] = useState(''); // 🆕 Nouveau champ

  const navigator = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading && token && id) {
      getCustomer(id)
        .then((response) => {
          setName(response.data.name);
          setAddress(response.data.address);
          setCity(response.data.city);
          setPostalCode(response.data.postalCode);
          setPhone(response.data.phone);
          setEmail(response.data.email);
          setStatus(response.data.status);
          setCustomerIdEvent(response.data.customerIdEvent || ''); // 🆕 récupération
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [loading, token, id]);

  function close() {
    navigator('/admin/customers');
  }

  return (
    <div className='container'>
      <br /> <br />
      <div className='row'>
        <div className='card col-md-8 offset-md-2'>
          <div className='card-body'>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className='text-center flex-grow-1 m-0'>
                {t('Customer_Details', { ns: 'customers' })}
              </h2>
              <button
                onClick={close}
                className='btn btn-outline-danger'
                title={t('Close', { ns: 'customers' })}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <form>
              <div className='row'>
                {/* Colonne gauche */}
                <div className='col-md-6'>
                  <div className='form-group mb-2'>
                    <label className='form-label'>{t('Name', { ns: 'customers' })}:</label>
                    <input type='text' value={name} className='form-control' readOnly />
                  </div>

                  <div className='form-group mb-2'>
                    <label className='form-label'>{t('Address', { ns: 'customers' })}:</label>
                    <input type='text' value={address} className='form-control' readOnly />
                  </div>

                  <div className='form-group mb-2'>
                    <label className='form-label'>{t('City', { ns: 'customers' })}:</label>
                    <input type='text' value={city} className='form-control' readOnly />
                  </div>

                  <div className='form-group mb-2'>
                    <label className='form-label'>{t('Postal_Code', { ns: 'customers' })}:</label>
                    <input type='text' value={postalCode} className='form-control' readOnly />
                  </div>
                </div>

                {/* Colonne droite */}
                <div className='col-md-6'>
                  <div className='form-group mb-2'>
                    <label className='form-label'>{t('Phone', { ns: 'customers' })}:</label>
                    <input type='text' value={phone} className='form-control' readOnly />
                  </div>

                  <div className='form-group mb-2'>
                    <label className='form-label'>{t('Email', { ns: 'customers' })}:</label>
                    <input type='text' value={email} className='form-control' readOnly />
                  </div>

                  <div className='form-group mb-2'>
                    <label className='form-label'>{t('Status', { ns: 'customers' })}:</label>
                    <input
                      type='text'
                      value={t(`customers.statusValues.${status}`, { ns: 'customers' })}
                      className='form-control'
                      readOnly
                    />
                  </div>

                  {/* 🆕 Nouveau champ pour équilibrer la colonne */}
                  <div className='form-group mb-2'>
                    <label className='form-label'>{t('Customer_ID_Event', { ns: 'customers' })}:</label>
                    <input type='text' value={customerIdEvent} className='form-control' readOnly />
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

export default CustomerDetails;
