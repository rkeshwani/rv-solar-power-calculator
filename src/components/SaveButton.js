import React from 'react';

const SaveButton = ({ onSave }) => {
  const handleClick = () => {
    onSave();
  };

  return (
    <button onClick={handleClick}>Save</button>
  );
};

export default SaveButton;
