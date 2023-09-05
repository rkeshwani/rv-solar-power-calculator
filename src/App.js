import React, { useState } from 'react';
import Roof from './components/Roof';
import SolarPanel from './components/SolarPanel';
import Calculator from './components/Calculator';
import SaveButton from './components/SaveButton';
import './styles.css';
import { RVRoof } from './components/RVRoof';
import { RoofItem } from './components/RoofItem';
import { DndContext } from '@dnd-kit/core';

const App = () => {
  const [roofDimensions, setRoofDimensions] = useState({ length: 0, width: 0 });
  const [solarPanels, setSolarPanels] = useState([]);
  const [powerOutput, setPowerOutput] = useState(0);
  const [grid, setGrid] = useState([[]]);

  const handleRoofDimensionsChange = (length, width) => {
    setRoofDimensions({ length, width });
  };

  const handleSolarPanelAdd = (length, width, powerCapacity) => {
    const x = 0;
    const y = 0;
    const newSolarPanel = { x: x, y: y, length: length, width: width, powerCapacity: powerCapacity, type: 'solar' };
    setSolarPanels([...solarPanels, newSolarPanel]);
    setPowerOutput(powerOutput + powerCapacity);
  };

  const handleSolarPanelRemove = (index) => {
    const removedSolarPanel = solarPanels[index];
    setSolarPanels(solarPanels.filter((_, i) => i !== index));
    setPowerOutput(powerOutput - (isNaN(removedSolarPanel.powerCapacity) ? 0 : removedSolarPanel.powerCapacity ));
  };

  const handleSolarPanelUpdate = (index, length, width, powerCapacity) => {

    const oldCapacity = solarPanels[index].powerCapacity;
    console.log(oldCapacity, solarPanels[index].powerCapacity)
    const updatedSolarPanel = { x: solarPanels[index].x, y: solarPanels[index].y, length: length, width: width, powerCapacity:powerCapacity, type: 'solar' };
    const updatedSolarPanels = [...solarPanels];
    updatedSolarPanels[index] = updatedSolarPanel;
    setSolarPanels(updatedSolarPanels);

    if(isNaN(powerCapacity)){
       setPowerOutput(powerOutput - oldCapacity);   // Subtract the old powerCapacity of that solar panel if user has emptied the input field
       solarPanels[index].powerCapacity = 0;
    }
    else{
      const powerOutputDiff = updatedSolarPanel.powerCapacity - (isNaN(oldCapacity) ? 0 : oldCapacity);
      setPowerOutput(powerOutput + (isNaN(powerOutputDiff) ? 0 : powerOutputDiff ));
    }
   
  };

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
      <Roof
        dimensions={roofDimensions}
        onDimensionsChange={handleRoofDimensionsChange}
      />
      <DndContext>
        <RVRoof roofDimensions={roofDimensions}>
          <div
            style={{
              content: '',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: -1,
            }}
          ></div>
          {/* {grid.map((row, rowIndex) => (
            <g key={rowIndex}>
              {row.map((cell, cellIndex) => (
                cell && (
                  <RoofItem key={`${rowIndex}-${cellIndex}`} x={cell.x} y={cell.y} width={cell.length} height={cell.width} type={cell.type} />
                )
              ))}
            </g>
          ))} */}
          {solarPanels.map((solarPanel, index) => (
            <RoofItem key={`solarPanel-${index}`} x={solarPanel.x} y={solarPanel.y} width={solarPanel.length} height={solarPanel.width} type={solarPanel.type} />
          ))}
        </RVRoof>
      </DndContext>
      <Calculator powerOutput={powerOutput} />
      <button onClick={() => handleSolarPanelAdd(1, 1, 1)}>Add Solar Panel</button>
      <div className="solar-panels">
        {solarPanels.map((solarPanel, index) => (
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
        ))}
      </div>
      <SaveButton onSave={handleSave} />
    </div>
  );
};


export default App;
