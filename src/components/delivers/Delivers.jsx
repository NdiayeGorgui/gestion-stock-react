import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listDelivers } from '../../services/DeliverService';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const Delivers = () => {
  const [delivers, setDelivers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const navigator = useNavigate();
  const { t } = useTranslation();
  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading && token) {
      getAllDelivers();
    }
  }, [loading, token]);

  const getAllDelivers = () => {
    listDelivers()
      .then((response) => {
        setDelivers(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const viewDeliver = (orderId) => {
    navigator(`/admin/deliver/${orderId}`);
  };

  // Filtrage
  const filteredDelivers = delivers.filter((d) => {
    const term = searchTerm.toLowerCase();
    return (
      d.orderId?.toLowerCase().includes(term) ||
      d.customerName?.toLowerCase().includes(term) ||
      d.customerMail?.toLowerCase().includes(term) ||
      d.timeStamp?.toLowerCase().includes(term) ||
      d.deliveryStatus?.toLowerCase().includes(term)
    );
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDelivers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDelivers.length / itemsPerPage);

  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-3">{t('List_Of_Deliveries_Orders', { ns: 'delivers' })}</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          className="form-control w-25"
          placeholder={t('Search_By', { ns: 'delivers' })}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        <div>
          {t('Show', { ns: 'delivers' })}
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
          {t('Entries', { ns: 'delivers' })}
        </div>
      </div>

      <table className="table table-striped table-bordered">
        <thead className="table-light">
          <tr>
            <th>{t('Order_Id', { ns: 'delivers' })}</th>
            <th>{t('Customer_Name', { ns: 'delivers' })}</th>
            <th>{t('Email', { ns: 'delivers' })}</th>
            <th>{t('Date', { ns: 'delivers' })}</th>
            <th>{t('Status', { ns: 'delivers' })}</th>
            <th className="text-center">{t('Deliver_Order', { ns: 'delivers' })}</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((d) => (
              <tr key={d.orderId}>
                <td>{d.orderId}</td>
                <td>{d.customerName}</td>
                <td>{d.customerMail}</td>
                <td>{new Date(d.timeStamp).toLocaleDateString('fr-FR')}</td>
              
                 <td>{t(`delivers.statusValues.${d.deliveryStatus}`, { ns: 'delivers' })}</td>
                <td className="text-center">
                  <button
                    className="btn btn-outline-warning btn-sm"
                    onClick={() => viewDeliver(d.orderId)}
                  >
                    <i className="bi bi-box-seam"></i>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                {t('No_Deliveries', { ns: 'delivers' })}
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
                ⏮ {t('First', { ns: 'delivers' })}
              </button>
            </li>
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                ← {t('Previous', { ns: 'delivers' })}
              </button>
            </li>
            <li className="page-item disabled">
              <span className="page-link">
                Page {currentPage} / {totalPages}
              </span>
            </li>
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                {t('Next', { ns: 'delivers' })} →
              </button>
            </li>
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(totalPages)}>
                {t('Last', { ns: 'delivers' })} ⏭
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Delivers;
