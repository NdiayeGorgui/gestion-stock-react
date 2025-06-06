import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell,
  PieChart, Pie
} from 'recharts';
import {
  TextField, Grid, Paper, Typography, Box, Table, TableHead, TableBody,
  TableRow, TableCell
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';

import {
  getMostOrderedProducts,
  getTop10CustomersMostOrdered,
  listProducts
} from '../../services/OrderSrvice';
import { useTranslation } from 'react-i18next';

const COLORS = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F6', '#84d8c5', '#c584d8', '#ffc658', '#6495ED', '#FF7F50'];

const Dashboard = () => {
  const [mostOrderedProducts, setMostOrderedProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [productsRemaining, setProductsRemaining] = useState([]);

  const { t } = useTranslation();

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

      setMostOrderedProducts(orderedProductsRes.data.map(item => ({
        name: item.name, value: item.totalQuantite
      })));

      setTopCustomers(topCustomersRes.data.map(item => ({
        name: item.name, value: item.totalOrder
      })));

      setProductsRemaining(productsRes.data.map(item => ({
        name: item.name, value: item.qty
      })));
    } catch (error) {
      console.error('Erreur lors du chargement des données du tableau de bord', error);
    }
  };

  const renderStatCard = (icon, title, value) => (
    <Grid item xs={12} sm={6} md={3}>
      <Paper elevation={3} sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
        <Box sx={{ mr: 2 }}>{icon}</Box>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>{t(title)}</Typography>
          <Typography variant="h6">{value}</Typography>
        </Box>
      </Paper>
    </Grid>
  );

  const renderBarChart = (title, data) => (
   <Box sx={{ mt: 6, mb: 5 }}>

      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>{title}</Typography>
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
    </Box>
  );

  const renderPieChart = (title, data) => (
    <div className="mb-5">
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>{title}</Typography>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150} label>
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

  const renderRecentProductsTable = () => (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}> {t('recent_products')}</Typography>

      <Table>
        <TableHead>
  <TableRow>
    <TableCell sx={{ fontWeight: 'bold' }}>{t('name')}</TableCell>
    <TableCell sx={{ fontWeight: 'bold' }}>{t('category')}</TableCell>
    <TableCell sx={{ fontWeight: 'bold' }}>{t('stock')}</TableCell>
    <TableCell sx={{ fontWeight: 'bold' }}>{t('price')}</TableCell>
    <TableCell sx={{ fontWeight: 'bold' }}>{t('status')}</TableCell>
  </TableRow>
</TableHead>

        <TableBody>
          {[ 
            { name: 'Wireless Mouse', category: 'Accessories', stock: 45, price: 19.99 },
            { name: 'Mechanical Keyboard', category: 'Accessories', stock: 12, price: 89.99 },
            { name: 'Office Chair', category: 'Furniture', stock: 0, price: 129.99 }
          ].map((prod, idx) => (
            <TableRow key={idx}>
              <TableCell>{prod.name}</TableCell>
              <TableCell>{prod.category}</TableCell>
              <TableCell>{prod.stock}</TableCell>
              <TableCell>${prod.price.toFixed(2)}</TableCell>
              <TableCell>
                <span className={`badge ${prod.stock === 0 ? 'out-stock' : prod.stock < 20 ? 'low-stock' : 'in-stock'}`}>
                  {prod.stock === 0
                    ? t('out')
                    : prod.stock < 20
                      ? t('low_stock')
                      : t('in_stock')}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );

  return (
    <Box sx={{ px: 4, py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>{t('dashboard_title')}</Typography>
        <TextField variant="outlined" size="small" placeholder={t('search_product')} />
      </Box>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          {renderStatCard(<InventoryIcon fontSize="large" color="primary" />, 'total_products', 124)}
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          {renderStatCard(<CategoryIcon fontSize="large" color="secondary" />, 'categories', 8)}
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          {renderStatCard(<ShoppingCartIcon fontSize="large" sx={{ color: '#FF9800' }} />, 'orders', 53)}
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          {renderStatCard(<PeopleIcon fontSize="large" sx={{ color: '#4CAF50' }} />, 'suppliers', 12)}
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          {renderStatCard(<InventoryIcon fontSize="large" sx={{ color: '#3f51b5' }} />, 'new_card_1', 77)}
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          {renderStatCard(<PeopleIcon fontSize="large" sx={{ color: '#9c27b0' }} />, 'new_card_2', 99)}
        </Grid>
      </Grid>

      {renderRecentProductsTable()}
      {renderBarChart(t('best_selling_products'), mostOrderedProducts)}
      {renderPieChart(t('top_10_customers'), topCustomers)}
      {renderBarChart(t('products_remaining'), productsRemaining)}
    </Box>
  );
};

export default Dashboard;
