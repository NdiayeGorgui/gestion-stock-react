import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Vérifie si tu es en mode développement (Vite)
const isDev = import.meta.env.DEV;

createRoot(document.getElementById('root')).render(
  isDev ? <App /> : <StrictMode><App /></StrictMode>
);
