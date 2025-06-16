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
  listCompletedOrders,
  listProducts,
  listCustomers
} from '../../services/OrderSrvice';
import { useTranslation } from 'react-i18next';


const COLORS = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F6', '#84d8c5', '#c584d8', '#ffc658', '#6495ED', '#FF7F50'];

const Dashboard = () => {
  const [mostOrderedProducts, setMostOrderedProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [productsRemaining, setProductsRemaining] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [newCustomers, setNewCustomers] = useState([]);
  const [recentProductsTable, setRecentProductsTable] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecentProducts = recentProductsTable.filter(prod =>
    prod.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const { t } = useTranslation();

  useEffect(() => {
    fetchData();
  }, []);

  const isInLast7Days = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string') return false;

    // Nettoyage : format ISO
    const cleanDate = dateStr.includes('.')
      ? dateStr.replace(' ', 'T').replace(/\.(\d{3})\d*/, '.$1')
      : dateStr.replace(' ', 'T');

    // Convertit la date UTC (si c'est ce que tu as en BD)
    const utcDate = new Date(cleanDate);

    if (isNaN(utcDate.getTime())) return false;

    // Convertir la date UTC en locale (GMT-4)
    const gmtOffset = -4 * 60; // minutes
    const localDate = new Date(utcDate.getTime() + gmtOffset * 60000);

    const now = new Date();
    now.setHours(23, 59, 59, 999); // Fin de journée locale

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 6); // Inclut aujourd’hui
    sevenDaysAgo.setHours(0, 0, 0, 0); // Début du jour 7e

    return localDate >= sevenDaysAgo && localDate <= now;
  };




  const fetchData = async () => {
    try {
      const [
        orderedProductsRes,
        topCustomersRes,
        productsRes,
        customersRes,
        completedOrdersRes
      ] = await Promise.all([
        getMostOrderedProducts(),
        getTop10CustomersMostOrdered(),
        listProducts(),
        listCustomers(),
        listCompletedOrders()
      ]);

      const allProducts = productsRes.data;
      const allCustomers = customersRes.data;

      setProducts(allProducts);
      setCustomers(allCustomers);
      setCompletedOrders(completedOrdersRes.data);

      // 🔸 Carte "New Products" (7 derniers jours)
      const recentProducts = allProducts.filter(p => isInLast7Days(p.createdDate));
      setNewProducts(recentProducts);
      console.log("Produits récents (7 jours)", recentProducts.map(p => ({ name: p.name, date: p.createdDate })));


      // 🔸 Carte "New Customers" (7 derniers jours)
      const recentCustomers = allCustomers.filter(c => isInLast7Days(c.createdDate));
      setNewCustomers(recentCustomers);

      // 🔸 Tableau "10 derniers produits ajoutés" (par date)
      const sortedByDate = [...allProducts].sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
      const lastTenProducts = sortedByDate.slice(0, 10);
      setRecentProductsTable(lastTenProducts); // 👉 ajoute un nouvel état ci-dessous

      // 🔸 Produits les plus commandés
      setMostOrderedProducts(orderedProductsRes.data.map(item => ({
        name: item.name,
        value: item.totalQuantite
      })));

      // 🔸 Top 10 clients
      setTopCustomers(topCustomersRes.data.map(item => ({
        name: item.name,
        value: item.totalOrder
      })));

      // 🔸 Stock restant
      setProductsRemaining(allProducts.map(item => ({
        name: item.name,
        value: item.qty
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

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>{title}</Typography>
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
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>{title}</Typography>
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
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}> {t('recent_products')}</Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>{t('name')}</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>{t('category')}</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>{t('stock')}</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>{t('price')}</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>{t('status')}</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>{t('created_date')}</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredRecentProducts.map((prod, idx) => (

            <TableRow key={idx}>
              <TableCell>{prod.name}</TableCell>
              <TableCell>{prod.category}</TableCell>
              <TableCell>{prod.qty}</TableCell>
              <TableCell>${prod.price?.toFixed(2)}</TableCell>
              <TableCell>
                <span className={`badge ${prod.qty === 0 ? 'out-stock' : prod.qty < 10 ? 'low-stock' : 'in-stock'}`} style={{ fontWeight: 'bold' }}>
                  {prod.qty === 0
                    ? t('out')
                    : prod.qty < 10
                      ? t('low_stock')
                      : t('in_stock')}
                </span>
              </TableCell>
              <TableCell>
                {new Intl.DateTimeFormat('en-US', {
                  year: '2-digit',
                  month: 'numeric',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                }).format(new Date(prod.createdDate))}
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
        <Typography variant="h5" sx={{ mb: 2 ,fontWeight: 'bold'}}>{t('dashboard_title')}</Typography>
        <TextField
          variant="outlined"
          size="small"
          placeholder={t('search_product')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

      </Box>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          {renderStatCard(<InventoryIcon fontSize="large" color="primary" />, 'total_products', products.length)}
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          {renderStatCard(<CategoryIcon fontSize="large" color="secondary" />, 'categories', [...new Set(products.map(p => p.category))].length
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          {renderStatCard(<ShoppingCartIcon fontSize="large" sx={{ color: '#FF9800' }} />, 'orders', completedOrders.length)}
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          {renderStatCard(<PeopleIcon fontSize="large" sx={{ color: '#4CAF50' }} />, 'suppliers', 8)}
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          {renderStatCard(<InventoryIcon fontSize="large" sx={{ color: '#3f51b5' }} />, 'new_card_1', newProducts.length)}
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          {renderStatCard(<PeopleIcon fontSize="large" sx={{ color: '#9c27b0' }} />, 'new_card_2', newCustomers.length)}
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
