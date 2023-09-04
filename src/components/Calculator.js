import React from 'react';

const Calculator = ({ powerOutput }) => {
  return (
    <div className="calculator">
      <h2>Calculator</h2>
      <p>Power Output: {powerOutput}</p>
    </div>
  );
};

export default Calculator;
