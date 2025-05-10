import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listShips } from '../../services/ShippingService'

const Ships = () => {

    const [ships, setShips] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [searchTerm, setSearchTerm] = useState('')
  
    const navigator = useNavigate()
  
    useEffect(() => {
      getAllShips()
    }, [])
  
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
    <h2 className="text-center">List of shipping orders</h2>

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
         <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
        entries
      </div>
    </div>

    <table className="table table-striped table-bordered">
      <thead>
        <tr>
          <th>Order Id</th><th>Customer Name</th><th>Email</th><th>Date</th>
          <th>Status</th><th>Ship order</th>
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
              <td>
                  

                  <button className="btn btn-outline-warning btn-sm" onClick={() => viewShip(ship.orderId)}>
                  <i class="bi bi-truck"></i>
                  </button>

              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7" className="text-center">No shippings found</td>
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

export default Ships