import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import storageUtils from './utils/storageUtils';
import memoryUtils from './utils/memoryUtils';

const root = ReactDOM.createRoot(document.getElementById('root'));

//从local读取user并保存到内存
const user = storageUtils.getUser()
memoryUtils.user = user
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

