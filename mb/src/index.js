import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { uploadToS3 } from './aws';
import reportWebVitals from './reportWebVitals';

// uploadToS3();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


reportWebVitals();
