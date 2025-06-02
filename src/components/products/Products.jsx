import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listProducts, deleteProduct } from '../../services/ProductService'
import Swal from 'sweetalert2';
import { useAuth } from '../hooks/useAuth';

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
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProduct(productIdEvent)
          .then(() => {
            setProducts((prevProducts) =>
              prevProducts.filter((product) => product.productIdEvent !== productIdEvent)
            );
            Swal.fire('Deleted!', 'The product has been deleted.', 'success');
          })
          .catch((error) => {
            console.error(error);
            Swal.fire('Error!', 'Failed to delete the product.', 'error');
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
      <h2 className="text-center">List of products</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        {isAdmin && (
          <button className="btn btn-primary" onClick={addNewProduct}>
            Add Product
          </button>
        )}

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
            <th>Name</th><th>Category</th><th>Price</th><th>Quantity</th>
            <th>Quantity status</th><th>Status</th><th>Actions</th>
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
              <td colSpan="7" className="text-center">No products found</td>
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

export default Products
