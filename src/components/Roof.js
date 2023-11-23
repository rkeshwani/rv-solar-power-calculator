import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2'; // G
const Roof = ({ dimensions, onDimensionsChange }) => {
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
