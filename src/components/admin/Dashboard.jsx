import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  PieChart,
  Pie
} from 'recharts';

import {
  getMostOrderedProducts,
  getTop10CustomersMostOrdered,
  listProducts
} from '../../services/OrderSrvice';

const COLORS = [
  '#FF5733',
  '#33FF57',
  '#3357FF',
  '#F3FF33',
  '#FF33F6',
  '#84d8c5',
  '#c584d8',
  '#ffc658',
  '#6495ED',
  '#FF7F50'
];

const Dashboard = () => {
  const [mostOrderedProducts, setMostOrderedProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [productsRemaining, setProductsRemaining] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [orderedProductsRes, topCustomersRes, productsRes] = await Promise.all([
        getMostOrderedProducts(),
        getTop10CustomersMostOrdered(),
        listProducts()
      ]);

      setMostOrderedProducts(
        orderedProductsRes.data.map(item => ({
          name: item.name,
          value: item.totalQuantite
        }))
      );

      setTopCustomers(
        topCustomersRes.data.map(item => ({
          name: item.name,
          value: item.totalOrder
        }))
      );

      setProductsRemaining(
        productsRes.data.map(item => ({
          name: item.name,
          value: item.qty
        }))
      );
    } catch (error) {
      console.error('Erreur lors du chargement des données du tableau de bord', error);
    }
  };

  const renderBarChart = (title, data) => (
    <div className="mb-5">
      <h4>{title}</h4>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8">
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const renderPieChart = (title, data) => (
    <div className="mb-5">
      <h4>{title}</h4>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            label
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend layout="horizontal" verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="container mt-4">
      <h2>Dashboard</h2>
      {renderBarChart('Best-selling products', mostOrderedProducts)}
      {renderPieChart('Top 10 customers', topCustomers)}
      {renderBarChart('Products with remaining quantities', productsRemaining)}
    </div>
  );
};

export default Dashboard;
