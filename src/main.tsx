import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ProgressionProvider } from './contexts/ProgressionContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProgressionProvider>
      <App />
    </ProgressionProvider>
  </StrictMode>
);
