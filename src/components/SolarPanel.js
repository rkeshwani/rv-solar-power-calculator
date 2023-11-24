import React from 'react';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

const SolarPanel = ({ index, length, width, powerCapacity, onRemove, onUpdate, updateGrid }) => {
  const handleLengthChange = (event) => {
    const newLength = parseInt(event.target.value);
    onUpdate(index, newLength, width, powerCapacity);
    updateGrid();
  };

  const handleWidthChange = (event) => {
    const newWidth = parseInt(event.target.value);
    onUpdate(index, length, newWidth, powerCapacity);
    updateGrid();
  };

  const handlePowerCapacityChange = (event) => {
    const newPowerCapacity = parseInt(event.target.value);
    onUpdate(index, length, width, newPowerCapacity);
  };

  const handleRemove = () => {
    onRemove(index);
  };

  return (
    <Card>
      <CardHeader title={`Solar Panel ${index + 1}`} />
      <CardContent>
        <Stack spacing={2}>
          <TextField
            type="number"
            id={`length-${index}`}
            value={length}
            onChange={handleLengthChange}
            label="Length (ft/m)"
          />
          <TextField
            type="number"
            id={`width-${index}`}
            value={width}
            onChange={handleWidthChange}
            label="Width (ft/m)"
          />
          <TextField
            type="number"
            id={`powerCapacity-${index}`}
            value={powerCapacity}
            onChange={handlePowerCapacityChange}
            label="Power Capacity (KwH/AH)"
          />
        </Stack>
        <CardActions>
          <Button onClick={handleRemove}>Remove</Button>
        </CardActions>
      </CardContent>
    </Card>
  );
};

export default SolarPanel;
