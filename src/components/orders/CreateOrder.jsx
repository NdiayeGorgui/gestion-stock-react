import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { createOrder, listCustomers, listProducts } from '../../services/OrderSrvice';
import Swal from 'sweetalert2';



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


  useEffect(() => {
    getAllCustomers();
    getAllProducts();
  }, []);

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
  if (!selectedProduct || itemQty <= 0) {
    Swal.fire('Warning', 'Please select a product and enter a valid quantity.', 'warning');
    return;
  }

  const alreadyInOrder = orderItems.some(
    item => item.productIdEvent === selectedProduct.productIdEvent
  );

  if (alreadyInOrder) {
    Swal.fire('Warning', 'This product is already in the cart, please update the quantity.', 'warning');
    return;
  }

  if (itemQty > selectedProduct.qty) {
    Swal.fire(
      'Insufficient Stock',
      `Only ${selectedProduct.qty} item(s) left in stock.`,
      'error'
    );
    return;
  }

  const newItem = {
    ...selectedProduct,
    qty: itemQty,
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

    if (newQty <= 0 || newQty > item.qtyStock) {
      Swal.fire('Invalid Quantity', 'Please enter a valid quantity within available stock.', 'warning');
      return;
    }

    const totalHT = item.price * newQty;
    const newTax = totalHT * 0.2;
    let newDiscount = 0;
    if (totalHT >= 200) newDiscount = totalHT * 0.01;
    else if (totalHT >= 100) newDiscount = totalHT * 0.005;

    updatedItems[index] = {
      ...item,
      qty: newQty,
      tax: newTax,
      discount: newDiscount,
      amount: totalHT + newTax - newDiscount,
    };

    setOrderItems(updatedItems);
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-between align-items-center mb-3">
        <Col><h2>New Order</h2></Col>
        <Col>
          {showPaymentButton && (
            <div className="text-center mt-4">
              <Button variant="success" size="lg" onClick={() => navigator('/admin/created-orders')}>
                💳 Proceed to Payment
              </Button>
            </div>
          )}
        </Col>
        <Col className="text-end">
          <Button
            variant="outline-primary"
            className="position-relative"
            onClick={() => setShowCart(true)}
          >
            🛒 Cart
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {orderItems.reduce((sum, item) => sum + item.qty, 0)}
            </span>
          </Button>

        </Col>

      </Row>

      <Form>
        {/* Select Customer */}
        <Row className="mb-3">
          <Col md={4}>
            <Form.Label><b>Customer</b></Form.Label>
            <Form.Select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
            >
              <option value="">-- Select customer --</option>
              {customers.map((client) => (
                <option key={client.customerIdEvent} value={client.customerIdEvent}>
                  {client.name}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label><b>Name</b></Form.Label>
              <Form.Control value={selectedClient?.name || ''} readOnly />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label><b>Email</b></Form.Label>
              <Form.Control value={selectedClient?.email || ''} readOnly />
            </Form.Group>
          </Col>
        </Row>

        <hr />

        {/* Select Product */}
        <Row className="mb-3">
          <Col md={4}>
            <Form.Label><b>Product</b></Form.Label>
            <Form.Select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
            >
              <option value="">-- Select product --</option>
              {products.map((product) => (
                <option key={product.productIdEvent} value={product.productIdEvent}>
                  {product.name} - {product.price} $
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Label><b>Product Name</b></Form.Label>
            <Form.Control value={selectedProduct?.name || ''} readOnly />
          </Col>
          <Col md={4}>
            <Form.Label><b>Price ($)</b></Form.Label>
            <Form.Control value={selectedProduct?.price || ''} readOnly />
          </Col>
        </Row>

        {/* Quantity & Calculations */}
        {selectedProduct && (
          <Row className="mb-3">
            <Col md={2}>
              <Form.Label><b>Quantity</b></Form.Label>
              <Form.Control
                type="number"
                value={itemQty}
                min={1}
                onChange={(e) => setItemQty(parseInt(e.target.value))}
              />
            </Col>
            <Col md={2}>
              <Form.Label><b>Amount ($)</b></Form.Label>
              <Form.Control value={amount.toFixed(2)} readOnly />
            </Col>
            <Col md={2}>
              <Form.Label><b>Tax ($)</b></Form.Label>
              <Form.Control value={tax.toFixed(2)} readOnly />
            </Col>
            <Col md={2}>
              <Form.Label><b>Discount ($)</b></Form.Label>
              <Form.Control value={discount.toFixed(2)} readOnly />
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button onClick={addProductToOrder}>Add order</Button>
            </Col>
          </Row>
        )}

        {/* Order Items Table */}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Tax</th>
              <th>Discount</th>
              <th>Remove</th>
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
                  value={item.qty}
                  onChange={(e) => handleQtyChange(idx, parseInt(e.target.value))}
                />
              </td>
                <td>{(item.price * item.qty).toFixed(2)} $</td>
                <td>{item.tax.toFixed(2)} $</td>
                <td>{item.discount.toFixed(2)} $</td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => handleRemoveItem(idx)}>
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Totals */}
        <Row>
          <Col className="text-end">
            <h6>Total Amount HT: {totalPrice.toFixed(2)} $</h6>
            <h6>Total Tax : {totalTax.toFixed(2)} $</h6>
            <h6>Total Discount: {totalDiscount.toFixed(2)} $</h6>
            <h5>Amount : {totalAmount.toFixed(2)} $</h5>

          </Col>
        </Row>

      </Form>
      {/* 🛒 Cart Modal */}
      <Modal show={showCart} onHide={() => setShowCart(false)} size="lg" style={{ marginTop: '80px' }}>
        <Modal.Header closeButton>
          <Modal.Title>🛒 Order Summary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orderItems.length === 0 ? (
            <p>No products added.</p>
          ) : (
            <>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Amount</th>
                    <th>Tax</th>
                    <th>Discount</th>
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
              <h6>Total Amount HT: {totalPrice.toFixed(2)} $</h6>
              <h6>Total Tax: {totalTax.toFixed(2)} $</h6>
              <h6>Total Discount: {totalDiscount.toFixed(2)} $</h6>
              <h6>Total Amount: {totalAmount.toFixed(2)} $</h6>

            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCart(false)}>
            Close
          </Button>
          <Button
            variant="success"
            disabled={orderItems.length === 0 || !selectedClient}
            onClick={() => {
              Swal.fire({
                title: 'Confirm Order',
                text: 'Are you sure you want to submit this order?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#28a745',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, submit it!',
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

                    Swal.fire('Success!', 'Order(s) successfully created.', 'success');
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
                    Swal.fire('Error', 'An error occurred while creating the order(s).', 'error');
                  }
                }
              });
            }}
          >
            ✅ Place Order
          </Button>

        </Modal.Footer>
      </Modal>


    </Container>
  );
};

export default CreateOrder;
