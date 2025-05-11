import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const clients = [
  { id: 1, name: 'Jean Dupont', email: 'jean@example.com' },
  { id: 2, name: 'Marie Curie', email: 'marie@example.com' },
];

const products = [
  { id: 101, name: 'Laptop', price: 1200 },
  { id: 102, name: 'Smartphone', price: 800 },
  { id: 103, name: 'Casque Audio', price: 150 },
];

const CreateOrder = () => {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);

  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [itemQty, setItemQty] = useState(1);

  const [amount, setAmount] = useState(0);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);

  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    const client = clients.find(c => c.id === parseInt(selectedClientId));
    setSelectedClient(client || null);
  }, [selectedClientId]);

  useEffect(() => {
    const product = products.find(p => p.id === parseInt(selectedProductId));
    setSelectedProduct(product || null);
    setItemQty(1); // Reset quantity
  }, [selectedProductId]);

  useEffect(() => {
    if (selectedProduct && itemQty > 0) {
      const amt = selectedProduct.price * itemQty;
      const taxVal = amt * 0.2;
      const discountVal = amt * 0.1;
      setAmount(amt);
      setTax(taxVal);
      setDiscount(discountVal);
    } else {
      setAmount(0);
      setTax(0);
      setDiscount(0);
    }
  }, [selectedProduct, itemQty]);

  const addProductToOrder = () => {
    if (selectedProduct && itemQty > 0) {
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
    }
  };

  const totalAmount = orderItems.reduce((sum, item) => sum + item.amount, 0);
  const totalTax = orderItems.reduce((sum, item) => sum + item.tax, 0);
  const totalDiscount = orderItems.reduce((sum, item) => sum + item.discount, 0);

  const handleRemoveItem = (index) => {
    const updatedItems = [...orderItems];
    updatedItems.splice(index, 1);
    setOrderItems(updatedItems);
  };
  const navigator = useNavigate()

  function gotoCreatedOrders() {
    navigator('/admin/created-orders')
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-between align-items-center mb-3">
  <Col><h2>New Order</h2></Col>
  <Col className="text-end">
    <Button variant="outline-primary" className="position-relative" onClick={gotoCreatedOrders}>
      🛒 Panier
      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
        {orderItems.reduce((sum, item) => sum + item.qty, 0)}
      </span>
    </Button>
  </Col>
</Row>

      {/* Sélection du client */}
      <Form>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Label>Customer</Form.Label>
            <Form.Select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
            >
              <option value="">-- Select customer --</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control value={selectedClient?.name || ''} readOnly />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control value={selectedClient?.email || ''} readOnly />
            </Form.Group>
          </Col>
        </Row>

        <hr />

        {/* Sélection du produit */}
        <Row className="mb-3">
          <Col md={4}>
            <Form.Label>Product</Form.Label>
            <Form.Select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
            >
              <option value="">-- Select product --</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - {product.price} $
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Label>Product Name</Form.Label>
            <Form.Control value={selectedProduct?.name || ''} readOnly />
          </Col>
          <Col md={3}>
            <Form.Label>Price ($)</Form.Label>
            <Form.Control value={selectedProduct?.price || ''} readOnly />
          </Col>
        </Row>

        {/* Quantité et calculs */}
        {selectedProduct && (
          <Row className="mb-3">
            <Col md={2}>
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={itemQty}
                min={1}
                onChange={(e) => setItemQty(parseInt(e.target.value))}
              />
            </Col>
            <Col md={2}>
              <Form.Label>Amount ($)</Form.Label>
              <Form.Control value={amount.toFixed(2)} readOnly />
            </Col>
            <Col md={2}>
              <Form.Label>Tax ($)</Form.Label>
              <Form.Control value={tax.toFixed(2)} readOnly />
            </Col>
            <Col md={2}>
              <Form.Label>Discount ($)</Form.Label>
              <Form.Control value={discount.toFixed(2)} readOnly />
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button onClick={addProductToOrder}>Ajouter</Button>
            </Col>
          </Row>
        )}

        {/* Tableau des articles */}
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
                <td>{item.qty}</td>
                <td>{item.amount.toFixed(2)} $</td>
                <td>{item.tax.toFixed(2)} $</td>
                <td>{item.discount.toFixed(2)} $</td>
                <td>
        <Button
          variant="danger"
          size="sm"
          onClick={() => handleRemoveItem(idx)}
        >
          Remove
        </Button>
      </td>

              </tr>
            ))}
          </tbody>
        </Table>

        {/* Totaux */}
        <Row>
          <Col className="text-end">
            <h5>Amount : {totalAmount.toFixed(2)} $</h5>
            <h6>Total Tax : {totalTax.toFixed(2)} $</h6>
            <h6>Total Discount: {totalDiscount.toFixed(2)} $</h6>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default CreateOrder;
