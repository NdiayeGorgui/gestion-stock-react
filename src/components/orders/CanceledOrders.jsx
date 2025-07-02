import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listCanceledOrders } from '../../services/OrderSrvice';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const CanceledOrders = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useTranslation();
  const navigator = useNavigate();
  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading && token) {
      listCanceledOrders()
        .then((response) => setOrders(response.data))
        .catch((error) => console.error(error));
    }
  }, [loading, token]);

  function viewOrder(orderId) {
    navigator(`/admin/canceled-order-details/${orderId}`);
  }

  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();
    return (
      order?.customerName?.toLowerCase().includes(term) ||
      order?.customerEmail?.toLowerCase().includes(term) ||
      order?.orderId?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentItems = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mt-4">
      <h2 className="text-center">{t('List_Of_Canceled_Orders', { ns: 'createdorders' })}</h2>

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
              </tr>
            ))
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

export default CanceledOrders;
