import React from 'react';
import Button from '@mui/material/Button';
const SaveButton = ({ onSave }) => {
  const handleClick = () => {
    onSave();
  };

  return (
    <Button variant="contained" onClick={handleClick}>
      Save
    </Button>
  );
};

export default SaveButton;
