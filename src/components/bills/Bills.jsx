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

  const navigator = useNavigate()
   const { t } = useTranslation();

  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading && token) {
      getAllBills();
    }
  }, [loading, token]);



  function getAllBills() {
    listBills()
      .then((response) => {
        console.log('Bills:', response.data);
        setBills(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }


  function viewBill(orderRef) {
    navigator(`/admin/bill/${orderRef}`)
  }


  // Filtering
  const filteredBills = bills.filter((bill) => {
    const term = searchTerm.toLowerCase();
    return (
      bill.customerName?.toLowerCase().includes(term) ||
      bill.productName?.toLowerCase().includes(term) ||
      bill.price?.toString().toLowerCase().includes(term) ||
      bill.quantity?.toString().toLowerCase().includes(term) ||
      bill.discount?.toString().toLowerCase().includes(term) ||
      bill.billingDate?.toLowerCase().includes(term) ||
      bill.status?.toLowerCase().includes(term)
    );
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredBills.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredBills.length / itemsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }


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
            <th>{t('Customer', { ns: 'bills' })}</th><th>{t('Product', { ns: 'bills' })}</th><th>{t('Quantity', { ns: 'bills' })}</th><th>{t('Price', { ns: 'bills' })}</th>
            <th>{t('Discount', { ns: 'bills' })}</th><th>{t('Date', { ns: 'bills' })}</th><th>{t('Status', { ns: 'bills' })}</th><th className="text-center">{t('Details', { ns: 'bills' })}</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((bill) => (
              <tr key={bill.id}>
                <td>{bill.customerName}</td>
                <td>{bill.productName}</td>
                <td>{bill.quantity}</td>
                <td>{bill.price.toFixed(2)}</td>
                <td>{bill.discount.toFixed(2)}</td>

                <td>{new Date(bill.billingDate).toLocaleDateString('fr-FR')}</td>
                <td>{bill.status}</td>
                <td className="text-center">


                  <button className="btn btn-outline-warning btn-sm" onClick={() => viewBill(bill.orderRef)}>
                    <i className="bi bi-eye"></i>
                  </button>

                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">{t('No_Bills', { ns: 'bills' })}</td>
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
                ⏮ {t('First', { ns: 'bills' })}
              </button>
            </li>
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                ← {t('Previous', { ns: 'bills' })}
              </button>
            </li>

            <li className="page-item disabled">
              <span className="page-link">
                Page {currentPage} / {totalPages}
              </span>
            </li>

            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                {t('Next', { ns: 'bills' })} →
              </button>
            </li>
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
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