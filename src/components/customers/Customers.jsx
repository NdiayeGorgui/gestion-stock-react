import React, { useEffect, useState } from 'react'
import { deleteCustomer, listCustomers } from '../../services/CustomerService'
import Swal from 'sweetalert2'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTranslation } from 'react-i18next'
import AddIcon from '@mui/icons-material/Add';


const Customers = () => {

  const [customers, setCustomers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const location = useLocation();

  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading && token) {
      getAllCustomers();
    }
  }, [loading, token]);


  const navigator = useNavigate()
  const { t } = useTranslation();

  function getAllCustomers() {
    listCustomers()
      .then((response) => {
        console.log('customers:', response.data);
        setCustomers(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  function addNewCustomer() {
    navigator('/admin/add-customer')
  }

  function updateCustomer(customerIdEvent) {
    navigator(`/admin/edit-customer/${customerIdEvent}`)
  }

  function viewCustomer(customerIdEvent) {
    navigator(`/admin/customer-details/${customerIdEvent}`)
  }

  function removeCustomer(customerIdEvent) {
    Swal.fire({
      title: t('title_delete', { ns: 'customers' }),
      text: t('text_delete', { ns: 'customers' }),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: t('confirm_delete', { ns: 'customers' }),
      cancelButtonText: t('cancel', { ns: 'customers' })
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCustomer(customerIdEvent)
          .then(() => {
            setCustomers((prevCustomers) =>
              prevCustomers.filter((customer) => customer.customerIdEvent !== customerIdEvent)
            );
            Swal.fire(t('success_title', { ns: 'customers' }), t('success_message', { ns: 'customers' }), 'success');
          })
          .catch((error) => {
            console.error(error);
            Swal.fire(t('error_title', { ns: 'customers' }), t('error_message', { ns: 'customers' }), 'error');
          });
      }
    });
  }


  // Filtering
  const filteredCustomers = customers.filter((customer) => {
    const term = searchTerm.toLowerCase();
    return (
      customer.name?.toLowerCase().includes(term) ||
      customer.address?.toLowerCase().includes(term) ||
      customer.phone?.toLowerCase().includes(term) ||
      customer.email?.toLowerCase().includes(term) ||
      customer.status?.toLowerCase().includes(term)
    );
  });


  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }


  return (
    <div className="container">
      <h2 className="text-center">{t('List_Of_Customers', { ns: 'customers' })}</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={addNewCustomer}>
          <AddIcon />
          {t('Add_Customer', { ns: 'customers' })}
        </button>


        <input
          type="text"
          className="form-control w-25"
          placeholder={t('Search_By', { ns: 'customers' })}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
        />

        <div>
          {t('Show', { ns: 'customers' })}
          <select
            className="form-select d-inline-block w-auto ms-2"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value))
              setCurrentPage(1)
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={40}>40</option>
          </select>
          {t('Entries', { ns: 'customers' })}
        </div>
      </div>

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>{t('Name', { ns: 'customers' })}</th><th>{t('Address', { ns: 'customers' })}</th><th>{t('Phone', { ns: 'customers' })}</th><th>{t('Email', { ns: 'customers' })}</th>
            <th>{t('Status', { ns: 'customers' })}</th><th style={{ textAlign: 'center' }}>
              {t('Actions', { ns: 'customers' })}
            </th>

          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.address}</td>
                <td>{customer.phone}</td>
                <td>{customer.email}</td>
                <td>{t(`customers.statusValues.${customer.status}`, { ns: 'customers' })}</td>
                <td className="text-center">
                  <button className="btn btn-outline-info btn-sm me-2" onClick={() => updateCustomer(customer.customerIdEvent)}>
                    <i className="bi bi-pencil-square"></i>
                  </button>

                  <button className="btn btn-outline-danger btn-sm me-2" onClick={() => removeCustomer(customer.customerIdEvent)}>
                    <i className="bi bi-trash"></i>
                  </button>

                  <button className="btn btn-outline-warning btn-sm" onClick={() => viewCustomer(customer.customerIdEvent)}>
                    <i className="bi bi-eye"></i>
                  </button>

                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center"> {t('No_Customer', { ns: 'customers' })}</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination buttons */}
      {totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                ⏮ {t('First', { ns: 'customers' })}
              </button>
            </li>
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                ← {t('Previous', { ns: 'customers' })}
              </button>
            </li>

            <li className="page-item disabled">
              <span className="page-link">
                Page {currentPage} / {totalPages}
              </span>
            </li>

            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                {t('Next', { ns: 'customers' })} →
              </button>
            </li>
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                {t('Last', { ns: 'customers' })} ⏭
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  )
}

export default Customers