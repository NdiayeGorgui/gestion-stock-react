import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listPayments } from '../../services/PaymentService'
import { useAuth } from '../hooks/useAuth'
import { useTranslation } from 'react-i18next'

const Payments = () => {

  const [payments, setPayments] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')

  const { t } = useTranslation();
  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading && token) {
      getAllPayments();
    }
  }, [loading, token]);


  const navigator = useNavigate()


  function getAllPayments() {
    listPayments()
      .then((response) => {
        console.log('Payments:', response.data);
        setPayments(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }


  function viewPayment(orderId) {
    navigator(`/admin/payment/${orderId}`)
  }


  // Filtering
  const filteredPayments = payments.filter((payment) => {
    const term = searchTerm.toLowerCase();
    return (
      payment.customerName?.toLowerCase().includes(term) ||
      payment.paymentMode?.toLowerCase().includes(term) ||
      payment.amount?.toString().toLowerCase().includes(term) ||
      payment.timeStamp?.toLowerCase().includes(term) ||
      payment.paymentStatus?.toLowerCase().includes(term)
    );
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredPayments.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  return (
    <div className="container">
      <h2 className="text-center">{t('List_Of_Payments', { ns: 'payments' })}</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">


        <input
          type="text"
          className="form-control w-25"
          placeholder={t('Search_By', { ns: 'payments' })}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
        />

        <div>
          {t('Show', { ns: 'payments' })}
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
          {t('Entries', { ns: 'payments' })}
        </div>
      </div>

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>{t('OrderId', { ns: 'payments' })}</th> <th>{t('Customer', { ns: 'payments' })}</th><th>{t('Payment_Mode', { ns: 'payments' })}</th><th>{t('Amount', { ns: 'payments' })}</th>
            <th>{t('Date', { ns: 'payments' })}</th><th>{t('Status', { ns: 'payments' })}</th><th className="text-center">{t('Details', { ns: 'payments' })}</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.orderId}</td>
                <td>{payment.customerName}</td>
                <td>{payment.paymentMode}</td>
                <td>{payment.amount.toFixed(2)}</td>
                <td>{new Date(payment.timeStamp).toLocaleDateString('fr-FR')}</td>
                <td>{t(`payments.paymentStatusValues.${payment.paymentStatus}`, { ns: 'payments' })}</td>
                <td className="text-center">


                  <button className="btn btn-outline-warning btn-sm" onClick={() => viewPayment(payment.orderId)}>
                    <i className="bi bi-eye"></i>
                  </button>

                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">{t('No_Payments', { ns: 'payments' })}</td>
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
                ⏮ {t('First', { ns: 'payments' })}
              </button>
            </li>
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                ← {t('Previous', { ns: 'payments' })}
              </button>
            </li>

            <li className="page-item disabled">
              <span className="page-link">
                Page {currentPage} / {totalPages}
              </span>
            </li>

            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                {t('Next', { ns: 'payments' })} →
              </button>
            </li>
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                {t('Last', { ns: 'payments' })} ⏭
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  )
}

export default Payments