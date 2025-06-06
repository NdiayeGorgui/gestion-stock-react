import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './translations/en/translation.json';
import translationFR from './translations/fr/translation.json';
import drawerEN from './translations/en/drawer.json';
import drawerFR from './translations/fr/drawer.json';
import productsEN from './translations/en/products.json';
import productsFR from './translations/fr/products.json';
import customersEN from './translations/en/customers.json';
import customersFR from './translations/fr/customers.json';
import createorderEN from './translations/en/createorder.json';
import createorderFR from './translations/fr/createorder.json';
import shipsEN from './translations/en/ships.json';
import shipsFR from './translations/fr/ships.json';
import deliversEN from './translations/en/delivers.json';
import deliversFR from './translations/fr/delivers.json';
import billsEN from './translations/en/bills.json';
import billsFR from './translations/fr/bills.json';
import paymentsEN from './translations/en/payments.json';
import paymentsFR from './translations/fr/payments.json';
import ordereventsEN from './translations/en/orderevents.json';
import ordereventsFR from './translations/fr/orderevents.json';
import createdordersEN from './translations/en/createdorders.json';
import createdordersFR from './translations/fr/createdorders.json';
import profileEN from './translations/en/profile.json';
import profileFR from './translations/fr/profile.json';

const resources = {
  en: {
    translation: translationEN,
    drawer: drawerEN,
    products: productsEN,
    customers: customersEN,
    createorder: createorderEN,
    ships: shipsEN,
    delivers: deliversEN,
    bills: billsEN,
    payments: paymentsEN,
    orderevents: ordereventsEN,
    createdorders: createdordersEN,
    profile: profileEN
  },
  fr: {
    translation: translationFR,
    drawer: drawerFR,
    products: productsFR,
    customers: customersFR,
    createorder: createorderFR,
    ships: shipsFR,
    delivers: deliversFR,
    bills: billsFR,
    payments: paymentsFR,
    orderevents: ordereventsFR,
    createdorders: createdordersFR,
    profile: profileFR
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    ns: [
      'translation',
      'drawer',
      'customers',
      'ships',
      'delivers',
      'createorder',
      'bills',
      'payments',
      'orderevents',
      'createdorders',
      'profile',
      'products'
    ],

    defaultNS: 'translation',          // ✅ Définit le namespace par défaut
    interpolation: {
      escapeValue: false,              // Recommandé avec React
    },
  });

export default i18n;
