import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listProducts, deleteProduct } from '../../services/ProductService'
import Swal from 'sweetalert2';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const Products = () => {
  const [products, setProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')

  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading && token) {
      getAllProducts();
    }
  }, [loading, token]);

  const { t } = useTranslation();
  const navigator = useNavigate()

  const { roles } = useAuth()

  // Supposons que le rôle admin est la string 'ADMIN'
  const isAdmin = roles && roles.includes('ADMIN')


  function getAllProducts() {
    listProducts()
      .then((response) => {
        console.log('Products:', response.data); // <-- check si qtyStatus est là
        setProducts(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  function addNewProduct() {
    navigator('/admin/add-product')
  }

  function updateProduct(productIdEvent) {
    navigator(`/admin/edit-product/${productIdEvent}`)
  }

  function viewProduct(productIdEvent) {
    navigator(`/admin/product-details/${productIdEvent}`)
  }

  function removeProduct(productIdEvent) {
    Swal.fire({
      title: t('title_delete', { ns: 'products' }),
      text: t('text_delete', { ns: 'products' }),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: t('confirm_delete', { ns: 'products' }),
      cancelButtonText: t('cancel', { ns: 'products' })
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProduct(productIdEvent)
          .then(() => {
            setProducts((prevProducts) =>
              prevProducts.filter((product) => product.productIdEvent !== productIdEvent)
            );
            Swal.fire( t('success_title', { ns: 'products' }), t('success_message', { ns: 'products' }), 'success');
          })
          .catch((error) => {
            console.error(error);
            Swal.fire(t('error_title', { ns: 'products' }), t('error_message', { ns: 'products' }), 'error');
          });
      }
    });
  }


  // Filtering
  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    return (
      product.name?.toLowerCase().includes(term) ||
      product.qty?.toString().toLowerCase().includes(term) ||
      product.price?.toString().toLowerCase().includes(term) ||
      product.status?.toLowerCase().includes(term) ||
      product.category?.toLowerCase().includes(term)
    );
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  return (
    <div className="container">
      <h2 className="text-center">{t('List_Of_Products', { ns: 'products' })}</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        {isAdmin && (
          <button className="btn btn-primary" onClick={addNewProduct}>
            {t('Add_Product', { ns: 'products' })}
          </button>
        )}

        <input
          type="text"
          className="form-control w-25"
          placeholder= {t('Search_By', { ns: 'products' })}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
        />

        <div>
          {t('Show', { ns: 'products' })}
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
          {t('Entries', { ns: 'products' })}
        </div>
      </div>

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>{t('Name', { ns: 'products' })}</th><th>{t('Category', { ns: 'products' })}</th><th>{t('Price', { ns: 'products' })}</th><th>{t('Quantity', { ns: 'products' })}</th>
            <th>{t('Quantity_Status', { ns: 'products' })}</th><th>{t('Status', { ns: 'products' })}</th><th>{t('Actions', { ns: 'products' })}</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.price.toFixed(2)}</td>
                <td>{product.qty}</td>

                <td>
                  {product.qtyStatus === 'UNAVAILABLE' ? (
                    <span className="text-danger fw-bold">OUT OF STOCK</span>
                  ) : product.qtyStatus === 'LOW' ? (
                    <span className="text-warning fw-bold">LOW STOCK</span>
                  ) : product.qtyStatus === 'AVAILABLE' ? (
                    <span className="text-success fw-bold">AVAILABLE</span>
                  ) : (
                    <span>{product.qtyStatus}</span> // fallback si statut inconnu
                  )}
                </td>



                <td>{product.status}</td>
                <td>
                  {isAdmin && (
                    <>
                      <button className="btn btn-outline-info btn-sm me-2" onClick={() => updateProduct(product.productIdEvent)}>
                        <i className="bi bi-pencil-square"></i>
                      </button>

                      <button className="btn btn-outline-danger btn-sm me-2" onClick={() => removeProduct(product.productIdEvent)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </>
                  )}

                  <button className="btn btn-outline-warning btn-sm" onClick={() => viewProduct(product.productIdEvent)}>
                    <i className="bi bi-eye"></i>
                  </button>

                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center"> {t('No_Product', { ns: 'products' })}</td>
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
                ⏮  {t('First', { ns: 'products' })}
              </button>
            </li>
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                ←  {t('Previous', { ns: 'products' })}
              </button>
            </li>

            <li className="page-item disabled">
              <span className="page-link">
                Page {currentPage} / {totalPages}
              </span>
            </li>

            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                 {t('Next', { ns: 'products' })} →
              </button>
            </li>
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                 {t('Last', { ns: 'products' })} ⏭
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  )
}

export default Products
