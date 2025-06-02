import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { listCreatedOrders, removeOrder } from '../../services/OrderSrvice';
import Swal from 'sweetalert2';
import { useAuth } from '../hooks/useAuth';

const CreatedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const navigator = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.refresh) {
      getAllCreatedOrders();
    }
  }, [location.state]);

  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading && token) {
      getAllCreatedOrders();
    }
  }, [loading, token]);


  function getAllCreatedOrders() {
    listCreatedOrders()
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function viewOrder(customerId) {
    navigator(`/admin/created-order-details/${customerId}`);
  }

  function cancelOrder(orderIdEvent) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        removeOrder(orderIdEvent)
          .then(() => {
            setOrders((prevOrders) =>
              prevOrders.filter((order) => order.orderIdEvent !== orderIdEvent)
            );
            Swal.fire('Removed!', 'The order has been removed.', 'success');
          })
          .catch((error) => {
            console.error(error);
            Swal.fire('Error!', 'Failed to remove the order.', 'error');
          });
      }
    });
  }

  function createPayment(customerIdEvent) {
    navigator(`/admin/create-payment/${customerIdEvent}`);
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
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Group by customer
  const groupedOrders = {};
  currentItems.forEach((order) => {
    const customerId = order?.order?.customer?.customerIdEvent;
    if (!groupedOrders[customerId]) {
      groupedOrders[customerId] = [];
    }
    groupedOrders[customerId].push(order);
  });

  return (
    <div className="container">
      <h2 className="text-center">List of created orders</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          className="form-control w-25"
          placeholder="🔍 Search by ..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        <div>
          Show:
          <select
            className="form-select d-inline-block w-auto ms-2"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
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
            <th>Customer</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Payment</th>
            <th>Details</th>
            <th>Cancel</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedOrders).length > 0 ? (
            Object.entries(groupedOrders).map(([customerId, group]) =>
              group.map((order, index) => (
                <tr key={`${customerId}-${index}`}>
                  {index === 0 && (
                    <td className="align-middle " rowSpan={group.length}>{order?.order?.customer?.name}</td>
                  )}
                  <td>{order?.product?.name}</td>
                  <td>{order?.quantity}</td>
                  <td>{order?.price.toFixed(2)}</td>
                  {index === 0 && (
                    <>
                      <td className="align-middle " rowSpan={group.length}>
                        <button
                          className="btn btn-outline-success btn-sm"
                          onClick={() =>
                            createPayment(order.order.customer.customerIdEvent)
                          }
                        >
                          <i className="bi bi-cash-coin"></i>
                        </button>
                      </td>
                      <td className="align-middle " rowSpan={group.length}>
                        <button
                          className="btn btn-outline-warning btn-sm"
                          onClick={() => viewOrder(order.order.customer.customerIdEvent)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                      </td>

                    </>
                  )}
                  <td >
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => cancelOrder(order.order.orderIdEvent)}
                    >
                      <i className="bi bi-x-circle"></i>
                    </button>
                  </td>
                </tr>
              ))
            )
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No orders found
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
                ⏮ First
              </button>
            </li>
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>
            </li>
            <li className="page-item disabled">
              <span className="page-link">
                Page {currentPage} of {totalPages}
              </span>
            </li>
            <li
              className={`page-item ${currentPage === totalPages ? 'disabled' : ''
                }`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </li>
            <li
              className={`page-item ${currentPage === totalPages ? 'disabled' : ''
                }`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                Last ⏭
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default CreatedOrders;
