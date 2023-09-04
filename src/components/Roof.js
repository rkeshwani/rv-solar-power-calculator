import React from 'react';

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
    <div>
      <h2>Roof</h2>
      <label htmlFor="length">Length:</label>
      <input
        type="number"
        id="length"
        value={dimensions.length}
        onChange={handleLengthChange}
      />
      <label htmlFor="width">Width:</label>
      <input
        type="number"
        id="width"
        value={dimensions.width}
        onChange={handleWidthChange}
      />
    </div>
  );
};

export default Roof;
