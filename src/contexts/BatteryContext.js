import React, { createContext, useState } from 'react';

// Create the context
export const BatteryContext = createContext();

// Create the provider component
export const BatteryProvider = ({ children }) => {
  const [batteryCapacity, setBatteryCapacity] = useState(100); // Default battery capacity

  return (
    <BatteryContext.Provider value={{ batteryCapacity, setBatteryCapacity }}>
      {children}
    </BatteryContext.Provider>
  );
};
