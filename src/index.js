import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RoofDimensionsProvider } from './contexts/RoofDimensionsContext';
import { SolarPanelProvider } from './contexts/SolarPanelContext';
import { RoofFixturesProvider } from './contexts/RoofFixturesContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RoofDimensionsProvider>
      <SolarPanelProvider>
        <RoofFixturesProvider>
          <App />
        </RoofFixturesProvider>
      </SolarPanelProvider>
    </RoofDimensionsProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
