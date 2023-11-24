import { createContext, useState } from 'react';

export const SolarPanelContext = createContext();

export const SolarPanelProvider = ({ children }) => {
  const [solarPanels, setSolarPanels] = useState([]);

  return (
    <SolarPanelContext.Provider value={{ solarPanels, setSolarPanels }}>
      {children}
    </SolarPanelContext.Provider>
  );
};