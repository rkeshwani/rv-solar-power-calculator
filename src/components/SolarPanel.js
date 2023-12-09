import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { MenuItem, Select } from '@mui/material';
import solarPanelList from '../data/solarPanels.json';

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

  // const filePath = './data/solarPanels.json';

  // const getSolarPanels = async () => {
  //   try {
  //     console.log('Reading solarPanels.json...');
  //     const response = await fetch(filePath);
  //     const solarPanels = await response.json();
  //     return solarPanels;
  //   } catch (error) {
  //     console.error('Error reading solarPanels.json:', error);
  //     return [];
  //   }
  // };

  // useEffect(() => {
  //   getSolarPanels().then((solarPanels) => setSolarPanelList(solarPanels));
  // }, []);
  const handleOnSolarTemplateChange = (event) => {
    //find solar panel in solarPanelList
    const templateValue = solarPanelList.find((solarPanel) => solarPanel.name === event.target.value);
    //update length, width, powerCapacity
    onUpdate(index, templateValue.length, templateValue.width, templateValue.powerOutput);
  };
  return (
    <Card>
      <CardHeader title={`Solar Panel ${index + 1}`} />
      <CardContent>
        <Stack spacing={2}>
          <Select onChange={handleOnSolarTemplateChange}>
            {solarPanelList.map((solarPanel, index) => (
              <MenuItem key={index} value={solarPanel.name}>{solarPanel.name}</MenuItem>
            ))}
          </Select>
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
