import React, { createContext, useState } from 'react';

export const RoofFixturesContext = createContext();

const defaultFixtures = [
  {
    id: 'ac-1',
    type: 'ac',
    x: 2,
    y: 2,
    dimensions: {
      length: 3,
      width: 2,
      height: 1
    }
  }
];

export const RoofFixturesProvider = ({ children }) => {
  const [roofFixtures, setRoofFixtures] = useState(defaultFixtures);

  return (
    <RoofFixturesContext.Provider value={{ roofFixtures, setRoofFixtures }}>
      {children}
    </RoofFixturesContext.Provider>
  );
}; 