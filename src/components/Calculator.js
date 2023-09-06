import React from 'react';
import Typography from '@mui/material/Typography';
const Calculator = ({ powerOutput }) => {
  return (
    <div className="calculator">
      <Typography variant="h2">Calculator</Typography>
      <Typography variant="p">Power Output: {powerOutput}</Typography>
    </div>
  );
};

export default Calculator;
