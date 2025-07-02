import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listBills } from '../../services/BillingService'
import { useAuth } from '../hooks/useAuth'
import { useTranslation } from 'react-i18next'

const Bills = () => {
  const [bills, setBills] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')

  const navigate = useNavigate()
  const { t } = useTranslation()
  const { token, loading } = useAuth()

  useEffect(() => {
    if (!loading && token) {
      getAllBills()
    }
  }, [loading, token])

  function getAllBills() {
    listBills()
      .then((response) => {
        setBills(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  function viewBill(orderId) {
    navigate(`/admin/bill/${orderId}`)
  }

  // Filtrer sur les colonnes visibles
  const filteredBills = bills.filter((bill) => {
    const term = searchTerm.toLowerCase()
    return (
      bill.orderId?.toLowerCase().includes(term) ||
      bill.customerName?.toLowerCase().includes(term) ||
      bill.customerMail?.toLowerCase().includes(term) ||
      bill.amount.toString().includes(term) ||
      bill.billStatus?.toLowerCase().includes(term) ||
      new Date(bill.billingDate).toLocaleDateString('fr-FR').toLowerCase().includes(term)
    )
  })

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredBills.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredBills.length / itemsPerPage)

  return (
    <div className="container">
      <h2 className="text-center">{t('List_Of_Bills', { ns: 'bills' })}</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          className="form-control w-25"
          placeholder={t('Search_By', { ns: 'bills' })}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
        />

        <div>
          {t('Show', { ns: 'bills' })}
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
          {t('Entries', { ns: 'bills' })}
        </div>
      </div>

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>{t('OrderId', { ns: 'bills' })}</th>
            <th>{t('Customer', { ns: 'bills' })}</th>
            <th>{t('CustomerEmail', { ns: 'bills' })}</th>
            <th>{t('Amount', { ns: 'bills' })}</th>
            <th>{t('Date', { ns: 'bills' })}</th>
            <th>{t('Status', { ns: 'bills' })}</th>
            <th className="text-center">{t('Details', { ns: 'bills' })}</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((bill) => (
              <tr key={bill.orderId}>
                <td>{bill.orderId}</td>
                <td>{bill.customerName}</td>
                <td>{bill.customerMail}</td>
                <td>{bill.amount.toFixed(2)}</td>
                <td>{new Date(bill.billingDate).toLocaleDateString('fr-FR')}</td>
                
                 <td>{t(`bills.statusValues.${bill.billStatus}`, { ns: 'bills' })}</td>
                <td className="text-center">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => viewBill(bill.orderId)}
                    title={t('Details', { ns: 'bills' })}
                  >
                    <i className="bi bi-info-circle"></i>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                {t('No_Bills', { ns: 'bills' })}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                ⏮ {t('First', { ns: 'bills' })}
              </button>
            </li>
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ← {t('Previous', { ns: 'bills' })}
              </button>
            </li>
            <li className="page-item disabled">
              <span className="page-link">
                Page {currentPage} / {totalPages}
              </span>
            </li>
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                {t('Next', { ns: 'bills' })} →
              </button>
            </li>
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                {t('Last', { ns: 'bills' })} ⏭
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  )
}

export default Bills
