import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listCreatedOrders, removeOrder } from '../../services/OrderSrvice';
import Swal from 'sweetalert2';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const CreatedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useTranslation();
  const navigator = useNavigate();
  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading && token) {
      listCreatedOrders()
        .then((response) => setOrders(response.data))
        .catch((error) => console.error(error));
    }
  }, [loading, token]);

  function viewOrder(orderId) {
    navigator(`/admin/created-order-details/${orderId}`);
  }

  function cancelOrder(orderId) {
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
        removeOrder(orderId)
          .then(() => {
            setOrders((prev) => prev.filter((order) => order.orderId !== orderId));
            Swal.fire(t('title_remove', { ns: 'createdorders' }), t('text_remove', { ns: 'createdorders' }), 'success');
          })
          .catch((error) => {
            console.error(error);
            Swal.fire(t('error_title', { ns: 'createdorders' }), t('error_message', { ns: 'createdorders' }), 'error');
          });
      }
    });
  }

  function createPayment(orderId) {
    navigator(`/admin/create-payment/${orderId}`);
  }

  // Filtered + pagination
  const filteredOrders = orders.filter((order) =>
    [order.customerName, order.customerEmail, order.orderId]
      .some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentItems = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-3">{t('List_Of_Created_Orders', { ns: 'createdorders' })}</h2>

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
            <th>{t('OrderId', { ns: 'createdorders' })}</th>
             <th>{t('Customer', { ns: 'createdorders' })}</th>
            <th className="text-center">{t('Email', { ns: 'createdorders' })}</th>
            <th className="text-center">{t('Amount', { ns: 'createdorders' })}</th>
             <th className="text-center">{t('Discount', { ns: 'createdorders' })}</th>
            <th className="text-center">{t('Tax', { ns: 'createdorders' })}</th>
             <th className="text-center">{t('Details', { ns: 'createdorders' })}</th>
            <th className="text-center">{t('Payment', { ns: 'createdorders' })}</th>
            <th className="text-center">{t('Cancel', { ns: 'createdorders' })}</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((order, index) => (
              <tr key={index}>
                <td>{order.orderId}</td>
                <td>{order.customerName}</td>
                <td>{order.customerEmail}</td>
                <td>{order.amount?.toFixed(2)}</td>
                <td>{order.totalDiscount?.toFixed(2)}</td>
                <td>{order.totalTax?.toFixed(2)}</td>
                <td className="text-center">
                  <button
                    className="btn btn-outline-warning btn-sm"
                    onClick={() => viewOrder(order.orderId)}
                  >
                    <i className="bi bi-eye"></i>
                  </button>
                </td>
                <td className="text-center">
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={() => createPayment(order.orderId)}
                  >
                    <i className="bi bi-cash-coin"></i>
                  </button>
                </td>
                <td className="text-center">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => cancelOrder(order.orderId)}
                  >
                    <i className="bi bi-x-circle"></i>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">
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
              <button className="page-link" onClick={() => setCurrentPage(1)}>
                ⏮ {t('First', { ns: 'createdorders' })}
              </button>
            </li>
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                ← {t('Previous', { ns: 'createdorders' })}
              </button>
            </li>
            <li className="page-item disabled">
              <span className="page-link">
                Page {currentPage} / {totalPages}
              </span>
            </li>
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                {t('Next', { ns: 'createdorders' })} →
              </button>
            </li>
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(totalPages)}>
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
