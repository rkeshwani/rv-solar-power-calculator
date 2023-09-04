import React from 'react';

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
    <div className="solar-panel">
      <h3>Solar Panel {index + 1}</h3>
      <label htmlFor={`length-${index}`}>Length:</label>
      <input
        type="number"
        id={`length-${index}`}
        value={length}
        onChange={handleLengthChange}
      />
      <label htmlFor={`width-${index}`}>Width:</label>
      <input
        type="number"
        id={`width-${index}`}
        value={width}
        onChange={handleWidthChange}
      />
      <label htmlFor={`powerCapacity-${index}`}>Power Capacity:</label>
      <input
        type="number"
        id={`powerCapacity-${index}`}
        value={powerCapacity}
        onChange={handlePowerCapacityChange}
      />
      <button onClick={handleRemove}>Remove</button>
    </div>
  );
};

export default SolarPanel;
