import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listPayments } from '../../services/PaymentService'

const Payments = () => {

  const [payments, setPayments] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')

  const navigator = useNavigate()

  useEffect(() => {
    getAllPayments()
  }, [])

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


  function viewPayment(paymentIdEvent) {
    navigator(`/admin/payment/${paymentIdEvent}`)
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
      <h2 className="text-center">List of Payments</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">


        <input
          type="text"
          className="form-control w-25"
          placeholder="🔍 Search by ..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
        />

        <div>
          Show:
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
          entries
        </div>
      </div>

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Customer</th><th>Payment Mode</th><th>Amount</th>
            <th>Date</th><th>Status</th><th>Details</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.customerName}</td>
                <td>{payment.paymentMode}</td>
                <td>{payment.amount}</td>
                <td>{new Date(payment.timeStamp).toLocaleDateString('fr-FR')}</td>
                <td>{payment.paymentStatus}</td>
                <td>


                  <button className="btn btn-outline-warning btn-sm" onClick={() => viewPayment(payment.paymentIdEvent)}>
                    <i className="bi bi-eye"></i>
                  </button>

                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No payments found</td>
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
                ⏮ First
              </button>
            </li>
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                ← Previous
              </button>
            </li>

            <li className="page-item disabled">
              <span className="page-link">
                Page {currentPage} sur {totalPages}
              </span>
            </li>

            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                Next →
              </button>
            </li>
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                Last ⏭
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  )
}

export default Payments