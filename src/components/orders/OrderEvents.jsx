import React, { useEffect, useState } from 'react'
import { listOrderEvents } from '../../services/OrderSrvice'
import { useAuth } from '../hooks/useAuth'

const OrderEvents = () => {

    const [orders, setOrders] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [searchTerm, setSearchTerm] = useState('')


    const { token, loading } = useAuth();

    useEffect(() => {
        if (!loading && token) {
            getAllOrderEvents();
        }
    }, [loading, token]);


    function getAllOrderEvents() {
        listOrderEvents()
            .then((response) => {
                console.log('Orders:', response.data);
                setOrders(response.data)
            })
            .catch((error) => {
                console.error(error)
            })
    }



    // Filtering
    const filteredOrders = orders.filter((order) => {
        const term = searchTerm.toLowerCase();
        return (
            order?.orderId?.toLowerCase().includes(term) ||
            order?.customerId?.toLowerCase().includes(term) ||
            order?.status?.toLowerCase().includes(term) ||
            order?.details?.toLowerCase().includes(term)


        );
    });


    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)



    return (
        <div className="container">
            <h2 className="text-center">List of order events</h2>

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
                        <th>Order Id</th><th>Customer Id</th><th>Status</th><th>Details</th><th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length > 0 ? (
                        currentItems.map((order) => (
                            <tr key={order?.id}>
                                <td>{order?.orderId}</td>
                                <td>{order?.customerId}</td>
                                <td>{order?.status}</td>
                                <td>{order?.details}</td>
                                <td>{new Date(order?.eventTimeStamp).toLocaleDateString('fr-FR')}</td>
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

export default OrderEvents