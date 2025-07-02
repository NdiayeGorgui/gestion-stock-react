import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listShips } from '../../services/ShippingService';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const Ships = () => {
  const [ships, setShips] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const navigator = useNavigate();
  const { t } = useTranslation();
  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading && token) {
      fetchShips();
    }
  }, [loading, token]);

  const fetchShips = () => {
    listShips()
      .then((response) => {
        setShips(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const viewShip = (orderId) => {
    navigator(`/admin/ship/${orderId}`);
  };

  // Filtrage
  const filteredShips = ships.filter((s) => {
    const term = searchTerm.toLowerCase();
    return (
      s.orderId?.toLowerCase().includes(term) ||
      s.customerName?.toLowerCase().includes(term) ||
      s.customerMail?.toLowerCase().includes(term) ||
      s.eventTimeStamp?.toLowerCase().includes(term) ||
      s.shippingStatus?.toLowerCase().includes(term)
    );
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredShips.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredShips.length / itemsPerPage);

  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-3">{t('List_Of_Shipping_Orders', { ns: 'ships' })}</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          className="form-control w-25"
          placeholder={t('Search_By', { ns: 'ships' })}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        <div>
          {t('Show', { ns: 'ships' })}
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
          {t('Entries', { ns: 'ships' })}
        </div>
      </div>

      <table className="table table-striped table-bordered">
        <thead className="table-light">
          <tr>
            <th>{t('Order_Id', { ns: 'ships' })}</th>
            <th>{t('Customer_Name', { ns: 'ships' })}</th>
            <th>{t('Email', { ns: 'ships' })}</th>
            <th>{t('Date', { ns: 'ships' })}</th>
            <th>{t('Status', { ns: 'ships' })}</th>
            <th className="text-center">{t('Ship_Order', { ns: 'ships' })}</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((s) => (
              <tr key={s.orderId}>
                <td>{s.orderId}</td>
                <td>{s.customerName}</td>
                <td>{s.customerMail}</td>
                <td>{new Date(s.eventTimeStamp).toLocaleDateString('fr-FR')}</td>
                <td>{t(`ships.statusValues.${s.shippingStatus}`, { ns: 'ships' })}</td>

                <td className="text-center">
                  <button
                    className="btn btn-outline-warning btn-sm"
                    onClick={() => viewShip(s.orderId)}
                  >
                    <i className="bi bi-truck"></i>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                {t('No_Shipping', { ns: 'ships' })}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(1)}>
                ⏮ {t('First', { ns: 'ships' })}
              </button>
            </li>
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                ← {t('Previous', { ns: 'ships' })}
              </button>
            </li>
            <li className="page-item disabled">
              <span className="page-link">
                Page {currentPage} / {totalPages}
              </span>
            </li>
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                {t('Next', { ns: 'ships' })} →
              </button>
            </li>
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(totalPages)}>
                {t('Last', { ns: 'ships' })} ⏭
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Ships;
