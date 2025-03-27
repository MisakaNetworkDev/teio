import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// only for debug
(window as any).dbg = () => {
  console.log('debug mode');
  window.location.href = "/debug";
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);