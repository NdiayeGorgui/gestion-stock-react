import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listShips } from '../../services/ShippingService'
import { useAuth } from '../hooks/useAuth'
import { useTranslation } from 'react-i18next'

const Ships = () => {

  const [ships, setShips] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')

  const navigator = useNavigate()
  const { t } = useTranslation();

  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading && token) {
      getAllShips();
    }
  }, [loading, token]);


  function getAllShips() {
    listShips()
      .then((response) => {
        console.log('Ships:', response.data);
        setShips(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }


  function viewShip(orderId) {
    navigator(`/admin/ship/${orderId}`)
  }


  // Filtering

  const filteredShips = ships.filter((ship) => {
    const term = searchTerm.toLowerCase();
    return (
      ship.orderId?.toLowerCase().includes(term) ||
      ship.customerName?.toLowerCase().includes(term) ||
      ship.customerPhone?.toLowerCase().includes(term) ||
      ship.customerMail?.toLowerCase().includes(term) ||
      ship.eventTimeStamp?.toLowerCase().includes(term) ||
      ship.status?.toLowerCase().includes(term)
    );
  });
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredShips.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredShips.length / itemsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }


  return (
    <div className="container">
      <h2 className="text-center">{t('List_Of_Shipping_Orders', { ns: 'ships' })}</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">


        <input
          type="text"
          className="form-control w-25"
          placeholder={t('Search_By', { ns: 'ships' })}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
        />

        <div>
          {t('Show', { ns: 'ships' })}
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
          {t('Entries', { ns: 'ships' })}
        </div>
      </div>

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>{t('Order_Id', { ns: 'ships' })}</th><th>{t('Customer_Name', { ns: 'ships' })}</th><th>{t('Email', { ns: 'ships' })}</th><th>{t('Date', { ns: 'ships' })}</th>
            <th>{t('Status', { ns: 'ships' })}</th><th className="text-center">{t('Ship_Order', { ns: 'ships' })}</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((ship) => (
              <tr key={ship.id}>
                <td>{ship.orderId}</td>
                <td>{ship.customerName}</td>
                <td>{ship.customerMail}</td>
                <td>{new Date(ship.eventTimeStamp).toLocaleDateString('fr-FR')}</td>
                <td>{ship.status}</td>
                <td className="text-center">


                  <button className="btn btn-outline-warning btn-sm" onClick={() => viewShip(ship.orderId)}>
                    <i className="bi bi-truck"></i>
                  </button>

                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">{t('No_Shipping', { ns: 'ships' })}</td>
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
                ⏮ {t('First', { ns: 'ships' })}
              </button>
            </li>
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                ← {t('Previous', { ns: 'ships' })}
              </button>
            </li>

            <li className="page-item disabled">
              <span className="page-link">
                Page {currentPage} / {totalPages}
              </span>
            </li>

            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                {t('Next', { ns: 'ships' })} →
              </button>
            </li>
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                {t('Last', { ns: 'ships' })} ⏭
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  )
}

export default Ships