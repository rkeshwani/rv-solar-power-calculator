import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid2';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import rvData from '../data/rvData.json';
import { InputLabel } from '@mui/material';

const Roof = ({ dimensions, onDimensionsChange }) => {
  const [selectedRV, setSelectedRV] = useState(null);

  const handleRVChange = (event) => {
    const rvId = event.target.value;
    const selectedRV = rvData.find((rv) => rv.id === rvId);
    setSelectedRV(selectedRV);
    if (rvId !== '') {
      onDimensionsChange(selectedRV.length, selectedRV.width);
    }
  };

  const handleLengthChange = (event) => {
    const length = parseInt(event.target.value);
    onDimensionsChange(length, dimensions.width);
  };

  const handleWidthChange = (event) => {
    const width = parseInt(event.target.value);
    onDimensionsChange(dimensions.length, width);
  };

  return (
    <>
      <Grid xs={12}>
        <Typography variant="h2">Roof</Typography>
      </Grid>
      <Grid item xs={12} md={12}>
        <InputLabel id="rv-select-label">Select a Recreational Vehicle or enter Custom dimensions</InputLabel>
        <Select
          id="rv"
          labelId='rv-select-label'
          value={selectedRV ? selectedRV.id : ''}
          onChange={handleRVChange}
          
        >
          <MenuItem value="">Custom</MenuItem>
          {rvData.map((rv) => (
            <MenuItem key={rv.id} value={rv.id}>
              {rv.name}
            </MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          type="number"
          id="length"
          value={dimensions.length}
          onChange={handleLengthChange}
          label="Length (ft/m)"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          type="number"
          id="width"
          value={dimensions.width}
          onChange={handleWidthChange}
          label="Width (ft/m)"
        />
      </Grid>
    </>
  );
};

export default Roof;
