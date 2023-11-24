import React, { createContext, useState } from 'react';

export const RoofDimensionsContext = createContext();

export const RoofDimensionsProvider = ({ children }) => {
  const [roofDimensions, setRoofDimensions] = useState({ length: 0, width: 0 });

  return (
    <RoofDimensionsContext.Provider value={{ roofDimensions, setRoofDimensions }}>
      {children}
    </RoofDimensionsContext.Provider>
  );
};