import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { listCreatedOrders, removeOrder } from '../../services/OrderSrvice';
import Swal from 'sweetalert2';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const CreatedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const navigator = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

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
      title: t('title_order', { ns: 'createdorders' }),
      text: t('text_order', { ns: 'createdorders' }),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: t('confirm_cancel', { ns: 'createdorders' }),
      cancelButtonText: t('cancel', { ns: 'createdorders' }),
    }).then((result) => {
      if (result.isConfirmed) {
        removeOrder(orderIdEvent)
          .then(() => {
            setOrders((prevOrders) =>
              prevOrders.filter((order) => order.orderIdEvent !== orderIdEvent)
            );
            Swal.fire(t('title_remove', { ns: 'createdorders' }), t('text_remove', { ns: 'createdorders' }), 'success');
          })
          .catch((error) => {
            console.error(error);
            Swal.fire(t('error_title', { ns: 'createdorders' }), t('error_message', { ns: 'createdorders' }), 'error');
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
      <h2 className="text-center">{t('List_Of_Created_Orders', { ns: 'createdorders' })}</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          className="form-control w-25"
          placeholder={t('Search_By', { ns: 'createdorders' })}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        <div>
         {t('Show', { ns: 'createdorders' })}
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
          {t('Entries', { ns: 'createdorders' })}
        </div>
      </div>

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>{t('Customer', { ns: 'createdorders' })}</th>
            <th>{t('Product', { ns: 'createdorders' })}</th>
            <th>{t('Quantity', { ns: 'createdorders' })}</th>
            <th>{t('Price', { ns: 'createdorders' })}</th>
            <th>{t('Payment', { ns: 'createdorders' })}</th>
            <th>{t('Details', { ns: 'createdorders' })}</th>
            <th>{t('Cancel', { ns: 'createdorders' })}</th>
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
                {t('No_Orders', { ns: 'createdorders' })}
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
                ⏮ {t('First', { ns: 'createdorders' })}
              </button>
            </li>
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ← {t('Previous', { ns: 'createdorders' })}
              </button>
            </li>
            <li className="page-item disabled">
              <span className="page-link">
                Page {currentPage} / {totalPages}
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
                {t('Next', { ns: 'createdorders' })} →
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
                {t('Last', { ns: 'createdorders' })} ⏭
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default CreatedOrders;
