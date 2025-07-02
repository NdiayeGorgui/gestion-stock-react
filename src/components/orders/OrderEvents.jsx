import React, { useEffect, useState } from 'react'
import { listOrderEvents } from '../../services/OrderSrvice'
import { useAuth } from '../hooks/useAuth'
import { useTranslation } from 'react-i18next'

const OrderEvents = () => {

    const [orders, setOrders] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [searchTerm, setSearchTerm] = useState('')

    const { t } = useTranslation();

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

    const getDetailsTranslationKey = (message) => {
        const map = {
            "Order created.": "ORDER_CREATED",
            "Order confirmed after payment.": "ORDER_CONFIRMED",
            "Order Shipped": "ORDER_SHIPPED",
            "Order Delivered": "ORDER_DELIVERED",
            "Order canceled.": "ORDER_CANCELED"
        };
        return map[message] || null;
    };


    return (
        <div className="container">
            <h2 className="text-center">{t('List_Of_Order_Events', { ns: 'orderevents' })}</h2>

            <div className="d-flex justify-content-between align-items-center mb-3">


                <input
                    type="text"
                    className="form-control w-25"
                    placeholder={t('Search_By', { ns: 'orderevents' })}
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setCurrentPage(1)
                    }}
                />

                <div>
                    {t('Show', { ns: 'orderevents' })}
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
                    {t('Entries', { ns: 'orderevents' })}
                </div>
            </div>

            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>{t('Order_Id', { ns: 'orderevents' })}</th><th>{t('Customer_Id', { ns: 'orderevents' })}</th><th>{t('Status', { ns: 'orderevents' })}</th><th>{t('Details', { ns: 'orderevents' })}</th><th>{t('Date', { ns: 'orderevents' })}</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length > 0 ? (
                        currentItems.map((order) => (
                            <tr key={order?.id}>
                                <td>{order?.orderId}</td>
                                <td>{order?.customerId}</td>
                                <td>{t(`orderevents.statusValues.${order?.status}`, { ns: 'orderevents' })}</td>
                                <td>
                                    {
                                        getDetailsTranslationKey(order?.details)
                                            ? t(`orderevents.detailsValues.${getDetailsTranslationKey(order.details)}`, { ns: 'orderevents' })
                                            : order?.details // fallback si aucun mapping trouvé
                                    }
                                </td>

                                <td>{new Date(order?.eventTimeStamp).toLocaleDateString('fr-FR')}</td>
                            </tr>

                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center">{t('No_Order_Events', { ns: 'orderevents' })}</td>
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
                                ⏮ {t('First', { ns: 'orderevents' })}
                            </button>
                        </li>
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                                ← {t('Previous', { ns: 'orderevents' })}
                            </button>
                        </li>

                        <li className="page-item disabled">
                            <span className="page-link">
                                Page {currentPage} / {totalPages}
                            </span>
                        </li>

                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                                {t('Next', { ns: 'orderevents' })} →
                            </button>
                        </li>
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                                {t('Last', { ns: 'orderevents' })} ⏭
                            </button>
                        </li>
                    </ul>
                </nav>
            )}

        </div>
    )
}

export default OrderEvents