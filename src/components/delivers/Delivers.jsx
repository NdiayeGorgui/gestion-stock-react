import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listDelivers } from '../../services/DeliverService'
import { useAuth } from '../hooks/useAuth'
import { useTranslation } from 'react-i18next'

const Delivers = () => {

  const [delivers, setDelivers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')

  const navigator = useNavigate()
  const { t } = useTranslation();

  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading && token) {
      getAllDelivers();
    }
  }, [loading, token]);


  function getAllDelivers() {
    listDelivers()
      .then((response) => {
        console.log('Delivers:', response.data);
        setDelivers(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }


  function viewDeliver(orderId) {
    navigator(`/admin/deliver/${orderId}`)
  }


  // Filtering
  const filteredDelivers = delivers.filter((delivered) => {
    const term = searchTerm.toLowerCase();
    return (
      delivered.orderId?.toLowerCase().includes(term) ||
      delivered.customerName?.toLowerCase().includes(term) ||
      delivered.customerPhone?.toLowerCase().includes(term) ||
      delivered.customerMail?.toLowerCase().includes(term) ||
      delivered.eventTimeStamp?.toLowerCase().includes(term) ||
      delivered.status?.toLowerCase().includes(term)
    );
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredDelivers.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredDelivers.length / itemsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }


  return (
    <div className="container">
      <h2 className="text-center">{t('List_Of_Deliveries_Orders', { ns: 'delivers' })}</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">


        <input
          type="text"
          className="form-control w-25"
          placeholder={t('Search_By', { ns: 'delivers' })}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
        />

        <div>
          {t('Show', { ns: 'delivers' })}
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
          {t('Entries', { ns: 'delivers' })}
        </div>
      </div>

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>{t('Order_Id', { ns: 'delivers' })}</th><th>{t('Customer_Name', { ns: 'delivers' })}</th><th>{t('Email', { ns: 'delivers' })}</th><th>{t('Date', { ns: 'delivers' })}</th>
            <th>{t('Status', { ns: 'delivers' })}</th><th className="text-center">{t('Deliver_Order', { ns: 'delivers' })}</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((delivered) => (
              <tr key={delivered.id}>
                <td>{delivered.orderId}</td>
                <td>{delivered.customerName}</td>
                <td>{delivered.customerMail}</td>
                <td>{new Date(delivered.eventTimeStamp).toLocaleDateString('fr-FR')}</td>
                <td>{delivered.status}</td>
                <td className="text-center">


                  <button className="btn btn-outline-warning btn-sm" onClick={() => viewDeliver(delivered.orderId)}>
                    <i className="bi bi-house-door"></i>
                  </button>

                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">{t('No_Delivers', { ns: 'delivers' })}</td>
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
                ⏮ {t('First', { ns: 'delivers' })}
              </button>
            </li>
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                ← {t('Previous', { ns: 'delivers' })}
              </button>
            </li>

            <li className="page-item disabled">
              <span className="page-link">
                Page {currentPage} / {totalPages}
              </span>
            </li>

            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                {t('Next', { ns: 'delivers' })} →
              </button>
            </li>
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                {t('Last', { ns: 'delivers' })} ⏭
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  )
}

export default Delivers