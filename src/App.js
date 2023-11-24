//Library imports
import React, { useState, useEffect, useContext, useRef } from 'react';
//Project imports
import Roof from './components/Roof';
import SolarPanel from './components/SolarPanel';
import Calculator from './components/Calculator';
import SaveButton from './components/SaveButton';
import './styles.css';
import { RVRoof } from './components/RVRoof';
import RoofItem from './components/RoofItem';
// MUI imports
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import { RoofDimensionsContext } from './contexts/RoofDimensionsContext';
import { SolarPanelContext } from './contexts/SolarPanelContext';


const App = () => {
  const { roofDimensions, setRoofDimensions } = useContext(RoofDimensionsContext);
  const { solarPanels, setSolarPanels } = useContext(SolarPanelContext);
  const [powerOutput, setPowerOutput] = useState(0);
  const [grid, setGrid] = useState([[]]);
  const svgRef = useRef();

  const handleRoofDimensionsChange = (length, width) => {
    setRoofDimensions({ length, width });
  };

  const handleSolarPanelAdd = (length, width, powerCapacity) => {
    const x = 0;
    const y = 0;
    const id = solarPanels ? solarPanels.length : 0;
    const newSolarPanel = { id: id, x: x, y: y, length: length, width: width, powerCapacity: powerCapacity, type: 'solar' };
    setSolarPanels([...solarPanels, newSolarPanel]);
  };

  const handleSolarPanelRemove = (index) => {
    const removedSolarPanel = solarPanels[index];
    setSolarPanels(solarPanels.filter((_, i) => i !== index));

  };

  const calculateTotalCapacity = () => {
    let totalCapacity = 0;
    for (const solarPanel of solarPanels) {
      totalCapacity += isNaN(solarPanel.powerCapacity) ? 0 : solarPanel.powerCapacity;
    }
    setPowerOutput(totalCapacity);
  }

  const handleSolarPanelUpdate = (index, length, width, powerCapacity) => {
    const updatedSolarPanel = { id: index, x: solarPanels[index].x, y: solarPanels[index].y, length: length, width: width, powerCapacity: powerCapacity, type: 'solar' };
    const updatedSolarPanels = [...solarPanels];
    updatedSolarPanels[index] = updatedSolarPanel;
    setSolarPanels(updatedSolarPanels);
  };

  useEffect(() => {
    calculateTotalCapacity();
  }, [solarPanels]);


  const handleSave = () => {
    const data = { roofDimensions, solarPanels };
    const jsonData = JSON.stringify(data);
    // Save jsonData as a JSON file
  };

  const updateGrid = () => {
    const newGrid = [];
    for (let i = 0; i < roofDimensions.length; i++) {
      const row = [];
      for (let j = 0; j < roofDimensions.width; j++) {
        row.push(null);
      }
      newGrid.push(row);
    }
    solarPanels.forEach((solarPanel) => {
      const { x, y } = solarPanel;
      console.log(solarPanel);
      if (x !== undefined && y !== undefined) {
        newGrid[x][y] = solarPanel;
      }
    });
    setGrid(newGrid);
    console.log(newGrid);
  }

  return (
    <div className="app">
      <Container spacing={2}>
        <Grid container md={12} spacing={2} mb={2}>
          <Grid item xs={12} md={2}>
            <img src={`${process.env.PUBLIC_URL}/favicon.jpg`} alt="logo" width={"100%"} />
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h1" component="h1">
              RV Solar Power Calculator
            </Typography>
          </Grid>
          <Roof
            dimensions={roofDimensions}
            onDimensionsChange={handleRoofDimensionsChange}
          />
          Enter the dimensions of your roof in feet or meters.
        </Grid>
        <Grid md={12} spacing={2}>
          <RVRoof roofDimensions={roofDimensions} svgRef={svgRef}>
            {solarPanels.map((solarPanel, index) => (
              <RoofItem draggable
                onDragMove={(event) => {
                  const { x, y } = event.delta;
                  const limitedDelta = { x: Math.sign(x), y: Math.sign(y) };
                  const updatedSolarPanel = { ...solarPanel, x: solarPanel.x + limitedDelta.x, y: solarPanel.y + limitedDelta.y };
                  const updatedSolarPanels = [...solarPanels];
                  updatedSolarPanels[index] = updatedSolarPanel;
                  setSolarPanels(updatedSolarPanels);
                }} svgRef={svgRef} reference={`solarPanel-${index}`} x={solarPanel.x} y={solarPanel.y} width={solarPanel.length} height={solarPanel.width} type={solarPanel.type} />
            ))}
          </RVRoof>
        </Grid>
        <Grid md={12} spacing={2}>
          <Calculator powerOutput={powerOutput} />
          <Button onClick={() => handleSolarPanelAdd(1, 1, 1)}>Add Solar Panel</Button>
          {/* <div className="solar-panels"> */}
          <Grid container spacing={2} mb={2}>
            {solarPanels.map((solarPanel, index) => (
              <Grid xs={12} md={4}>
                <SolarPanel
                  key={index}
                  index={index}
                  length={solarPanel.length}
                  width={solarPanel.width}
                  powerCapacity={solarPanel.powerCapacity}
                  onRemove={handleSolarPanelRemove}
                  onUpdate={handleSolarPanelUpdate}
                  updateGrid={updateGrid}
                />
              </Grid>
            ))}
          </Grid>
          {/* </div> */}

          <SaveButton onSave={handleSave} />
        </Grid>
      </Container>
    </div>
  );
};


export default App;
