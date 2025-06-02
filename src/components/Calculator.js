import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

const Calculator = ({ powerOutput, batteryCapacity, setBatteryCapacity, chargingTime }) => {
  const handleBatteryCapacityChange = (event) => {
    const value = event.target.value;
    // Ensure the value is a positive number, or set to 0 if invalid
    const numericValue = parseFloat(value);
    setBatteryCapacity(numericValue >= 0 ? numericValue : 0);
  };

  return (
    <div className="calculator">
      <Typography variant="h2" gutterBottom>Calculator</Typography>
      <Typography variant="body1">Power Output: {powerOutput} kW</Typography>
      <Typography variant="body1">Battery Capacity: {batteryCapacity} Ah</Typography>
      <Typography variant="body1">
        Estimated time to full charge: {
          chargingTime === Infinity || chargingTime > 1000000 // Check for Infinity or a very large number
            ? "N/A (check power output or sunlight hours)"
            : `${chargingTime.toFixed(2)} hours`
        }
      </Typography>
      <TextField
        label="Set Battery Capacity (Ah)"
        type="number"
        value={batteryCapacity}
        onChange={handleBatteryCapacityChange}
        variant="outlined"
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{ min: "0" }} // Optional: prevent negative numbers in the input field directly
      />
    </div>
  );
};

export default Calculator;
