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
  const [newCategories, setNewCategories] = useState([]);
  const [newOrders, setNewOrders] = useState([]);


  const filteredRecentProducts = recentProductsTable.filter(prod =>
    prod.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const { t } = useTranslation();

  useEffect(() => {
    fetchData();
  }, []);
const isInLast7Days = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') return false;

  const cleanDate = dateStr.includes('.')
    ? dateStr.replace(' ', 'T').replace(/\.(\d{3})\d*/, '.$1')
    : dateStr.replace(' ', 'T');

  const utcDate = new Date(cleanDate);
  if (isNaN(utcDate.getTime())) return false;

  // ✅ Appliquer GMT-4 (correction identique à Angular)
  const localDate = new Date(utcDate.getTime() - 4 * 60 * 60 * 1000);

  const now = new Date();
  now.setHours(23, 59, 59, 999);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const inRange = localDate >= sevenDaysAgo && localDate <= now;
  console.log(`React - Date: ${localDate.toISOString()} -> InLast7Days: ${inRange}`);
  return inRange;
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
      // 🔹 Nouvelles catégories (dans les 7 derniers jours)
      const uniqueNewCategories = [...new Set(recentProducts.map(p => p.category))];
      setNewCategories(uniqueNewCategories);

      // 🔹 Nouvelles commandes (dans les 7 derniers jours)
      const recentOrders = completedOrdersRes.data.filter(o => isInLast7Days(o.createdDate));
      setNewOrders(recentOrders);


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

       console.log("React - Nouveaux produits:", recentProducts.map(p => ({ name: p.name, date: p.createdDate })));
    console.log("React - Nouveaux clients:", recentCustomers.map(c => ({ name: c.name, date: c.createdDate })));
    console.log("React - Nouvelles catégories:", uniqueNewCategories);
    } catch (error) {
      console.error('Erreur lors du chargement des données du tableau de bord', error);
    }
  };

const renderStatCard = (icon, title, value) => (
  <Paper
    elevation={3}
    sx={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      height: '140px', // Hauteur uniforme stricte
      p: 2
    }}
  >
    <Box sx={{ mr: 2, fontSize: 40 }}>{icon}</Box>
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
        {t(title)}
      </Typography>
      <Typography variant="h6">{value}</Typography>
    </Box>
  </Paper>
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
    <Box sx={{ maxWidth: '100%', px: 0, py: 3 }}>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>{t('dashboard_title')}</Typography>
        <TextField
          variant="outlined"
          size="small"
          placeholder={t('search_product')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

      </Box>
<Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
 {t('Overview')}
</Typography>

<Grid container spacing={2} sx={{ mb: 3, display: 'flex', flexWrap: 'wrap' }}>
  {[
    { icon: <InventoryIcon fontSize="large" color="primary" />, title: 'total_products', value: products.length },
    { icon: <CategoryIcon fontSize="large" color="secondary" />, title: 'categories', value: [...new Set(products.map(p => p.category))].length },
    { icon: <ShoppingCartIcon fontSize="large" sx={{ color: '#FF9800' }} />, title: 'orders', value: completedOrders.length },
    { icon: <PeopleIcon fontSize="large" sx={{ color: '#4CAF50' }} />, title: 'suppliers', value: 8 },
    { icon: <InventoryIcon fontSize="large" sx={{ color: '#3f51b5' }} />, title: 'new_products', value: newProducts.length },
    { icon: <PeopleIcon fontSize="large" sx={{ color: '#9c27b0' }} />, title: 'new_customers', value: newCustomers.length },
    // { icon: <CategoryIcon fontSize="large" sx={{ color: '#00bcd4' }} />, title: 'new_categories', value: newCategories.length },
    { icon: <ShoppingCartIcon fontSize="large" sx={{ color: '#e91e63' }} />, title: 'new_orders', value: newOrders.length }
  ].map((card, index) => (
    <Grid
      item
      key={index}
      xs={12}
      sm={6}
      md={3}
      lg={1.5}
      sx={{
        flexBasis: { xs: '100%', sm: '50%', md: '12.5%' },
        maxWidth: { xs: '100%', sm: '50%', md: '12.5%' }
      }}
    >
      {renderStatCard(card.icon, card.title, card.value)}
    </Grid>
  ))}
</Grid>



      {renderRecentProductsTable()}
      {renderBarChart(t('best_selling_products'), mostOrderedProducts)}
      {renderPieChart(t('top_10_customers'), topCustomers)}
      {renderBarChart(t('products_remaining'), productsRemaining)}
    </Box>
  );
};

export default Dashboard;
