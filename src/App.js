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
import { RV3DViewer } from './components/RV3D';
import { RoofFixturesContext } from './contexts/RoofFixturesContext';
import RoofFixtureManager from './components/RoofFixtureManager';
// MUI imports
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2'; // Grid version 2
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import { RoofDimensionsContext } from './contexts/RoofDimensionsContext';
import { SolarPanelContext } from './contexts/SolarPanelContext';


const App = () => {
  const { roofDimensions, setRoofDimensions } = useContext(RoofDimensionsContext);
  const { solarPanels, setSolarPanels } = useContext(SolarPanelContext);
  const { roofFixtures, setRoofFixtures } = useContext(RoofFixturesContext);
  const [powerOutput, setPowerOutput] = useState(0);
  const [grid, setGrid] = useState([[]]);
  const svgRef = useRef();

  const handleRoofDimensionsChange = (length, width) => {
    setRoofDimensions({ length, width });
  };

  const handleSolarPanelAdd = (length, width, powerCapacity) => {
    const newPosition = findValidPosition(length, width, roofFixtures, solarPanels);
    if (!newPosition) {
      alert('No valid position found for the solar panel');
      return;
    }
    
    const id = solarPanels ? solarPanels.length : 0;
    const newSolarPanel = {
      id,
      x: newPosition.x,
      y: newPosition.y,
      length,
      width,
      powerCapacity,
      type: 'solar'
    };
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

  const findValidPosition = (length, width, fixtures, existingPanels) => {
    const gridSize = 0.5; // 0.5 foot grid
    for (let x = 0; x <= roofDimensions.length - length; x += gridSize) {
      for (let y = 0; y <= roofDimensions.width - width; y += gridSize) {
        if (isPositionValid(x, y, length, width, fixtures, existingPanels)) {
          return { x, y };
        }
      }
    }
    return null;
  };

  const checkCollision = (rect1, rect2) => {
    return !(rect1.x + rect1.length <= rect2.x ||
      rect1.x >= rect2.x + rect2.length ||
      rect1.y + rect1.width <= rect2.y ||
      rect1.y >= rect2.y + rect2.width);
  };

  const isPositionValid = (x, y, length, width, fixtures, existingPanels) => {
    // Check roof boundaries
    if (x < 0 || y < 0 || x + length > roofDimensions.length || y + width > roofDimensions.width) {
      return false;
    }

    // Check collision with fixtures
    for (const fixture of fixtures) {
      if (checkCollision(
        { x, y, length, width },
        { x: fixture.x, y: fixture.y, length: fixture.dimensions.length, width: fixture.dimensions.width }
      )) {
        return false;
      }
    }

    // Check collision with existing panels
    for (const panel of existingPanels) {
      if (checkCollision(
        { x, y, length, width },
        { x: panel.x, y: panel.y, length: panel.length, width: panel.width }
      )) {
        return false;
      }
    }

    return true;
  };

  const handlePanelMove = (index, newPosition) => {
    const updatedSolarPanels = [...solarPanels];
    updatedSolarPanels[index] = {
      ...updatedSolarPanels[index],
      x: newPosition.x,
      y: newPosition.y
    };
    
    // Check if the new position is valid
    if (isPositionValid(
      newPosition.x,
      newPosition.y,
      updatedSolarPanels[index].length,
      updatedSolarPanels[index].width,
      roofFixtures,
      updatedSolarPanels.filter((_, i) => i !== index)
    )) {
      setSolarPanels(updatedSolarPanels);
    }
  };

  const handleFixtureMove = (fixtureId, newPosition) => {
    setRoofFixtures(prevFixtures => 
      prevFixtures.map(fixture =>
        fixture.id === fixtureId
          ? { ...fixture, x: newPosition.x, y: newPosition.y }
          : fixture
      )
    );
  };

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
          <RV3DViewer
            dimensions={roofDimensions}
            solarPanels={solarPanels}
            roofFixtures={roofFixtures}
            onPanelMove={handlePanelMove}
            onFixtureMove={handleFixtureMove}
          />
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
        <RoofFixtureManager />
      </Container>
    </div>
  );
};


export default App;
