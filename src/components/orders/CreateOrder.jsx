import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { createOrder, listCustomers, listProducts } from '../../services/OrderSrvice';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';



const CreateOrder = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [itemQty, setItemQty] = useState(1);
  const [amount, setAmount] = useState(0);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [orderItems, setOrderItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showPaymentButton, setShowPaymentButton] = useState(false);
  const navigator = useNavigate();

  const { t } = useTranslation();

  const customerOptions = customers.map((client) => ({
    value: client.customerIdEvent,
    label: client.name,
  }));

  const productOptions = products.map((product) => ({
    value: product.productIdEvent,
    label: `${product.name} - ${product.price} $`,
  }));

  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading && token) {
      getAllCustomers();
      getAllProducts();
    }
  }, [loading, token]);


  const getAllCustomers = () => {
    listCustomers()
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((error) => console.error(error));
  };

  const getAllProducts = () => {
    listProducts()
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    const client = customers.find((c) => c.customerIdEvent === selectedClientId);
    setSelectedClient(client || null);
  }, [selectedClientId, customers]);

  useEffect(() => {
    const product = products.find((p) => p.productIdEvent === selectedProductId);
    setSelectedProduct(product || null);
    setItemQty(1);
  }, [selectedProductId, products]);

  useEffect(() => {
    const calculateTotals = async () => {
      if (selectedProduct && itemQty > 0) {
        const price = Number(selectedProduct.price);
        const qty = Number(itemQty);
        const totalHT = price * qty;

        const calculatedTax = totalHT * 0.2;

        let calculatedDiscount = 0;
        if (totalHT >= 200) {
          calculatedDiscount = totalHT * 0.01;
        } else if (totalHT >= 100) {
          calculatedDiscount = totalHT * 0.005;
        }

        const calculatedAmount = totalHT + calculatedTax - calculatedDiscount;

        setTax(calculatedTax);
        setDiscount(calculatedDiscount);
        setAmount(calculatedAmount);
      } else {
        setTax(0);
        setDiscount(0);
        setAmount(0);
      }
    };

    calculateTotals();
  }, [selectedProduct, itemQty]);


  const addProductToOrder = () => {
    if (!selectedProduct || !itemQty || isNaN(itemQty) || itemQty <= 0) {
      Swal.fire(
        t('warning_title', { ns: 'createorder' }),
        t('valid_quantity', { ns: 'createorder' }),
        'warning'
      );

      return;
    }


    const alreadyInOrder = orderItems.some(
      item => item.productIdEvent === selectedProduct.productIdEvent
    );

    if (alreadyInOrder) {
      Swal.fire(
        t('warning_title', { ns: 'createorder' }),
        t('product_exist', { ns: 'createorder' }),
        'warning'
      );

      return;
    }

    if (itemQty > selectedProduct.qty) {
      Swal.fire(
        t('insufficient_stock_title', { ns: 'createorder' }),
        t('insufficient_stock_text', { count: selectedProduct.qty, ns: 'createorder' }),
        'error'
      );
      return;
    }

    const newItem = {
      ...selectedProduct,
      qty: itemQty,
      qtyStock: selectedProduct.qty, // Stock initial
      amount,
      tax,
      discount,
    };


    setOrderItems([...orderItems, newItem]);
    setSelectedProductId('');
    setSelectedProduct(null);
    setItemQty(1);
    setAmount(0);
    setTax(0);
    setDiscount(0);
    setSelectedProductId(''); // ou null selon l'initialisation
  };


  const handleRemoveItem = (index) => {
    const updatedItems = [...orderItems];
    updatedItems.splice(index, 1);
    setOrderItems(updatedItems);
  };

  const totalAmount = orderItems.reduce((sum, item) => sum + item.amount, 0);
  const totalTax = orderItems.reduce((sum, item) => sum + item.tax, 0);
  const totalDiscount = orderItems.reduce((sum, item) => sum + item.discount, 0);
  const totalPrice = orderItems.reduce((sum, item) => sum + (item.price * item.qty), 0);


  const handleQtyChange = (index, newQty) => {
    const updatedItems = [...orderItems];
    const item = updatedItems[index];

    if (newQty === null || newQty === '') {
      // Temporairement vide, on ne calcule rien
      item.qty = newQty;
      setOrderItems(updatedItems);
      return;
    }

    const qty = parseInt(newQty);
    if (isNaN(qty) || qty <= 0) {
      Swal.fire(t('invalid_quantity_title', { ns: 'createorder' }), t('invalid_quantity_text', { ns: 'createorder' }), 'warning');
      return;
    }

    if (qty > item.qtyStock) {
      Swal.fire(
        t('insufficient_stock_title', { ns: 'createorder' }),
        t('insufficient_stock_item_text', {
          ns: 'createorder',
          count: item.qtyStock,
          name: item.name
        }),
        'error'
      );
      return;
    }


    const totalHT = item.price * qty;
    const newTax = totalHT * 0.2;
    let newDiscount = 0;
    if (totalHT >= 200) newDiscount = totalHT * 0.01;
    else if (totalHT >= 100) newDiscount = totalHT * 0.005;

    updatedItems[index] = {
      ...item,
      qty,
      tax: newTax,
      discount: newDiscount,
      amount: totalHT + newTax - newDiscount,
    };

    setOrderItems(updatedItems);
  };



  return (
    <Container className="mt-4">
 <Row className="align-items-center mb-3">
  <Col xs="auto">
    <h4 className="mb-0">{t('New_Order', { ns: 'createorder' })}</h4>
  </Col>

  <Col className="text-center">
    {showPaymentButton && (
      <Button
        variant="success"
        size="lg"
        onClick={() => navigator('/admin/created-orders')}
      >
        💳 {t('Proceed_To_Payment', { ns: 'createorder' })}
      </Button>
    )}
  </Col>

  <Col className="text-end">
    <Button
      variant="outline-primary"
      className="position-relative"
      onClick={() => setShowCart(true)}
    >
      🛒 {t('Cart', { ns: 'createorder' })}
      <span className="position-absolute top-0 start-100 translate-middle badge-order rounded-pill bg-danger">
        {orderItems.reduce((sum, item) => sum + item.qty, 0)}
      </span>
    </Button>
  </Col>
</Row>


      <Form>
        {/* Select Customer */}
        <Row className="mb-3">
          <Col md={4}>
            <Form.Label><b>{t('Customer', { ns: 'createorder' })}</b></Form.Label>
            <Select
              options={customerOptions}
              value={customerOptions.find(opt => opt.value === selectedClientId)}
              onChange={(selected) => setSelectedClientId(selected.value)}
              placeholder={t('Search_Customer', { ns: 'createorder' })}
            />

          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label><b>{t('Address', { ns: 'createorder' })}</b></Form.Label>
              <Form.Control value={selectedClient?.address || ''} readOnly />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label><b>{t('Email', { ns: 'createorder' })}</b></Form.Label>
              <Form.Control value={selectedClient?.email || ''} readOnly />
            </Form.Group>
          </Col>
        </Row>

        <hr />

        {/* Select Product */}
        <Row className="mb-3">
          <Col md={4}>
            <Form.Label><b>{t('Product', { ns: 'createorder' })}</b></Form.Label>
            <Select
              options={productOptions}
              value={productOptions.find(opt => opt.value === selectedProductId) || null}
              onChange={(selected) => setSelectedProductId(selected.value)}
              placeholder={t('Search_Product', { ns: 'createorder' })}
              isClearable
            />


          </Col>
          <Col md={4}>
            <Form.Label><b>{t('Category', { ns: 'createorder' })}</b></Form.Label>
            <Form.Control value={selectedProduct?.category || ''} readOnly />
          </Col>
          <Col md={4}>
            <Form.Label><b>{t('Price', { ns: 'createorder' })} ($)</b></Form.Label>
            <Form.Control value={selectedProduct?.price || ''} readOnly />
          </Col>
        </Row>

        {/* Quantity & Calculations */}
        {selectedProduct && (
          <Row className="mb-3">
            <Col md={2}>
              <Form.Label><b>{t('Quantity', { ns: 'createorder' })}</b></Form.Label>
              <Form.Control
                type="number"
                value={itemQty}
                min={1}
                onChange={(e) => setItemQty(parseInt(e.target.value))}
              />
            </Col>
            <Col md={2}>
              <Form.Label><b>{t('Amount', { ns: 'createorder' })} ($)</b></Form.Label>
              <Form.Control value={amount.toFixed(2)} readOnly />
            </Col>
            <Col md={2}>
              <Form.Label><b>{t('Tax', { ns: 'createorder' })} ($)</b></Form.Label>
              <Form.Control value={tax.toFixed(2)} readOnly />
            </Col>
            <Col md={2}>
              <Form.Label><b>{t('Discount', { ns: 'createorder' })} ($)</b></Form.Label>
              <Form.Control value={discount.toFixed(2)} readOnly />
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button
                variant="primary"
                className="d-flex align-items-center gap-2"
                onClick={addProductToOrder}
              >
                <AddIcon /> {t('Add_Order', { ns: 'createorder' })}
              </Button>
            </Col>


          </Row>
        )}

        {/* Order Items Table */}
        {orderItems.length > 0 && (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>{t('Product', { ns: 'createorder' })}</th>
                <th>{t('Quantity', { ns: 'createorder' })}</th>
                <th>{t('Amount', { ns: 'createorder' })}</th>
                <th>{t('Tax', { ns: 'createorder' })}</th>
                <th>{t('Discount', { ns: 'createorder' })}</th>
                <th>{t('Remove', { ns: 'createorder' })}</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td>
                    <Form.Control
                      type="number"
                      min={1}
                      max={item.qtyStock}
                      value={item.qty === null ? '' : item.qty}
                      onChange={(e) => {
                        const val = e.target.value;
                        // Permet d'effacer : on enregistre null temporairement
                        handleQtyChange(idx, val === '' ? null : parseInt(val));
                      }}
                      onBlur={(e) => {
                        const val = parseInt(e.target.value);
                        if (isNaN(val) || val < 1) {
                          Swal.fire({
                            icon: 'info',
                            title: t('quantity_reset_title', { ns: 'createorder' }),
                            text: t('quantity_reset_text', { ns: 'createorder' }),
                            timer: 2000,
                            showConfirmButton: false
                          });
                          handleQtyChange(idx, 1);
                        }
                      }}
                    />

                  </td>
                  <td>{(item.price * item.qty).toFixed(2)} $</td>
                  <td>{item.tax.toFixed(2)} $</td>
                  <td>{item.discount.toFixed(2)} $</td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => handleRemoveItem(idx)}>
                      {t('Remove', { ns: 'createorder' })}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}


        {/* Totals */}
        {orderItems.length > 0 && (
          <Row>
            <Col className="text-end">
              <h6>{t('Total_Amount_Ht', { ns: 'createorder' })}: {totalPrice.toFixed(2)} $</h6>
              <h6>{t('Total_Tax', { ns: 'createorder' })} : {totalTax.toFixed(2)} $</h6>
              <h6>{t('Total_Discount', { ns: 'createorder' })}: {totalDiscount.toFixed(2)} $</h6>
              <h5>{t('Total_Amount', { ns: 'createorder' })} : {totalAmount.toFixed(2)} $</h5>
            </Col>
          </Row>
        )}


      </Form>
      {/* 🛒 Cart Modal */}
      <Modal show={showCart} onHide={() => setShowCart(false)} size="lg" style={{ marginTop: '80px' }}>
        <Modal.Header closeButton>
          <Modal.Title>🛒 {t('Order_Summary', { ns: 'createorder' })}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orderItems.length === 0 ? (
            <p>{t('No_Products_Added', { ns: 'createorder' })}.</p>
          ) : (
            <>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>{t('Product', { ns: 'createorder' })}</th>
                    <th>{t('Quantity', { ns: 'createorder' })}</th>
                    <th>{t('Amount', { ns: 'createorder' })}</th>
                    <th>{t('Tax', { ns: 'createorder' })}</th>
                    <th>{t('Discount', { ns: 'createorder' })}</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.name}</td>
                      <td>{item.qty}</td>
                      <td>{(item.price * item.qty).toFixed(2)} $</td>
                      <td>{item.tax.toFixed(2)} $</td>
                      <td>{item.discount.toFixed(2)} $</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <h6>{t('Total_Amount_Ht', { ns: 'createorder' })}: {totalPrice.toFixed(2)} $</h6>
              <h6>{t('Total_Tax', { ns: 'createorder' })}: {totalTax.toFixed(2)} $</h6>
              <h6>{t('Total_Discount', { ns: 'createorder' })}: {totalDiscount.toFixed(2)} $</h6>
              <h6>{t('Total_Amount', { ns: 'createorder' })}: {totalAmount.toFixed(2)} $</h6>

            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCart(false)}>
            {t('Close', { ns: 'createorder' })}
          </Button>
          <Button
            variant="success"
            disabled={orderItems.length === 0 || !selectedClient}
            onClick={() => {
              Swal.fire({
                title: t('title_order', { ns: 'createorder' }),
                text: t('text_order', { ns: 'createorder' }),
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#28a745',
                cancelButtonColor: '#d33',
                confirmButtonText: t('confirm_order', { ns: 'createorder' }),
                cancelButtonText: t('cancel', { ns: 'createorder' }),
                heightAuto: false,
                width: '400px',
              }).then(async (result) => {
                if (result.isConfirmed) {
                  const ordersToSend = orderItems.map((item) => ({
                    customer: {
                      customerIdEvent: selectedClient.customerIdEvent,
                    },
                    product: {
                      productIdEvent: item.productIdEvent,
                    },
                    productItem: {
                      productQty: item.qty,
                    },
                  }));

                  try {
                    for (let i = 0; i < ordersToSend.length; i++) {
                      await createOrder(ordersToSend[i]);
                      await new Promise((resolve) => setTimeout(resolve, 300)); // ⏱️ Délai entre chaque commande
                    }

                    Swal.fire(t('success_title', { ns: 'createorder' }), t('order_success', { ns: 'createorder' }), 'success');
                    setOrderItems([]);
                    setSelectedClientId('');
                    setSelectedClient(null);
                    setSelectedProductId('');
                    setSelectedProduct(null);
                    setItemQty(1);
                    setAmount(0);
                    setTax(0);
                    setDiscount(0);

                    setShowCart(false);
                    setShowPaymentButton(true);
                  } catch (error) {
                    console.error("Failed to create order(s):", error);
                    Swal.fire(t('error_title', { ns: 'createorder' }), t('error_message', { ns: 'createorder' }), 'error');
                  }
                }
              });
            }}
          >
            ✅ {t('Place_Order', { ns: 'createorder' })}
          </Button>


        </Modal.Footer>
      </Modal>


    </Container>
  );
};

export default CreateOrder;
