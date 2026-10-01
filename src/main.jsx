import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const root = document.getElementById('root');
// Static public pages hydrate their existing HTML; admin/unknown routes use the SPA.
if (root.hasChildNodes()) ReactDOM.hydrateRoot(root, app);
else ReactDOM.createRoot(root).render(app);
