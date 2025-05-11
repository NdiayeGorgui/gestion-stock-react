import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listCanceledOrders } from '../../services/OrderSrvice'

const CanceledOrders = () => {
    const [orders, setOrders] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [searchTerm, setSearchTerm] = useState('')
  
    const navigator = useNavigate()
  
    useEffect(() => {
        getAllCanceledOrders()
    }, [])
  
    function getAllCanceledOrders() {
      listCanceledOrders()
        .then((response) => {
          console.log('Orders:', response.data); 
          setOrders(response.data)
        })
        .catch((error) => {
          console.error(error)
        })
    }
  
  
    function viewOrder(orderIdEvent) {
      navigator(`/admin/orderDetails/${orderIdEvent}`)
    }
  
    
    // Filtering
    const filteredOrders = orders.filter((order) => {
        const term = searchTerm.toLowerCase();
        return (
            order?.order?.customer?.name?.toLowerCase().includes(term) ||
            order?.product?.name?.toLowerCase().includes(term) ||
            order?.price?.toString().toLowerCase().includes(term) ||
            order?.quantity?.toString().toLowerCase().includes(term) 
           
        );
      });
      
  
    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber)
    }
  

  return (
    <div className="container">
    <h2 className="text-center">List of canceled orders</h2>

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
          <th>Customer</th><th>Product</th><th>Quantity</th><th>Price</th><th>Details</th>
        </tr>
      </thead>
      <tbody>
        {currentItems.length > 0 ? (
          currentItems.map((order) => (
            <tr key={order?.order?.orderIdEvent}>
                <td>{order?.order?.customer?.name}</td>
                <td>{order?.product?.name}</td>
                <td>{order?.quantity}</td>
                <td>{order?.price}</td>
                <td>
                    <button className="btn btn-outline-warning btn-sm" onClick={() => viewOrder(order.order.orderIdEvent)}>
                    <i className="bi bi-eye"></i>
                    </button>
                </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="8" className="text-center">No orders found</td>
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

export default CanceledOrders