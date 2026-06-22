import { THEME, TonConnectUIProvider } from '@tonconnect/ui-react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { TONCONNECT_MANIFEST_URL } from './config';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TonConnectUIProvider
      manifestUrl={TONCONNECT_MANIFEST_URL}
      uiPreferences={{ theme: THEME.LIGHT }}
    >
      <App />
    </TonConnectUIProvider>
  </React.StrictMode>,
);
