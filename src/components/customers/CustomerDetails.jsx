import React, { useEffect, useState } from 'react'
import { getCustomer } from '../../services/CustomerService'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const CustomerDetails = () => {

    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState('')

     const navigator = useNavigate();
    
    const {id} = useParams();
    const { token, loading } = useAuth();

    useEffect(() => {
    
            if (!loading && token && id) {
                getCustomer(id).then((response) => {
                    setName(response.data.name);
                    setAddress(response.data.address);
                    setPhone(response.data.phone);
                    setEmail(response.data.email);
                    setStatus(response.data.status);
    
                }).catch(error => {
                    console.error(error);
                })
            }
    
      }, [loading, token, id]);

      function close() {
    navigator('/admin/customers');
  }

  return (
    <div className='container'>
      <br /> <br />
      <div className='row'>
        <div className='card col-md-6 offset-md-3'>
          <h2 className='text-center'>Customer Details</h2>
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
                <label className='form-label'>Address:</label>
                <input
                  type='text'
                  name='address'
                  value={address}
                  className='form-control'
                  readOnly
                />
              </div>

              <div className='form-group mb-2'>
                <label className='form-label'>Phone:</label>
                <input
                  type='text'
                  name='phone'
                  value={phone}
                  className='form-control'
                  readOnly
                />
              </div>

              <div className='form-group mb-2'>
                <label className='form-label'>Email:</label>
                <input
                  type='text'
                  name='email'
                  value={email}
                  className='form-control'
                  readOnly
                />
              </div>

              <div className='form-group mb-2'>
                <label className='form-label'>Status:</label>
                <input
                  type='text'
                  name='status'
                  value={status}
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
  )
}

export default CustomerDetails