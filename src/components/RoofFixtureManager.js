import React, { useContext, useState, useEffect } from 'react';
import { RoofFixturesContext } from '../contexts/RoofFixturesContext';
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const fixtureTypes = [
  { id: 'ac', label: 'Air Conditioner' },
  { id: 'vent', label: 'Vent' },
  { id: 'skylight', label: 'Skylight' },
  { id: 'antenna', label: 'Antenna' },
  { id: 'custom', label: 'Custom' }
];

const RoofFixtureManager = ({ onFixtureMove }) => {
  const { roofFixtures, setRoofFixtures } = useContext(RoofFixturesContext);
  const [open, setOpen] = useState(false);
  const [newFixture, setNewFixture] = useState({
    type: '',
    x: 0,
    y: 0,
    dimensions: {
      length: 1,
      width: 1,
      height: 0.5
    }
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddFixture = () => {
    const fixture = {
      ...newFixture,
      id: `fixture-${Date.now()}`,
    };
    setRoofFixtures([...roofFixtures, fixture]);
    setNewFixture({
      type: '',
      x: 0,
      y: 0,
      dimensions: {
        length: 1,
        width: 1,
        height: 0.5
      }
    });
    handleClose();
  };

  const handleRemoveFixture = (fixtureId) => {
    setRoofFixtures(roofFixtures.filter(fixture => fixture.id !== fixtureId));
  };

  const handleFixtureMove = (fixtureId, newPosition) => {
    setRoofFixtures(roofFixtures.map(fixture => 
      fixture.id === fixtureId 
        ? { ...fixture, x: newPosition.x, y: newPosition.y }
        : fixture
    ));
  };

  useEffect(() => {
    if (onFixtureMove) {
      onFixtureMove(handleFixtureMove);
    }
  }, [onFixtureMove]);

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Roof Fixtures</Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpen}
          >
            Add Fixture
          </Button>
        </Grid>
        <Grid item xs={12}>
          <List>
            {roofFixtures.map((fixture) => (
              <ListItem key={fixture.id}>
                <ListItemText
                  primary={fixture.type}
                  secondary={`${fixture.dimensions.length}' × ${fixture.dimensions.width}' at (${fixture.x}, ${fixture.y})`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleRemoveFixture(fixture.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Fixture</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={newFixture.type}
                  onChange={(e) => setNewFixture({ ...newFixture, type: e.target.value })}
                >
                  {fixtureTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="X Position"
                type="number"
                value={newFixture.x}
                onChange={(e) => setNewFixture({ ...newFixture, x: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Y Position"
                type="number"
                value={newFixture.y}
                onChange={(e) => setNewFixture({ ...newFixture, y: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Length"
                type="number"
                value={newFixture.dimensions.length}
                onChange={(e) => setNewFixture({
                  ...newFixture,
                  dimensions: { ...newFixture.dimensions, length: Number(e.target.value) }
                })}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Width"
                type="number"
                value={newFixture.dimensions.width}
                onChange={(e) => setNewFixture({
                  ...newFixture,
                  dimensions: { ...newFixture.dimensions, width: Number(e.target.value) }
                })}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Height"
                type="number"
                value={newFixture.dimensions.height}
                onChange={(e) => setNewFixture({
                  ...newFixture,
                  dimensions: { ...newFixture.dimensions, height: Number(e.target.value) }
                })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddFixture} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RoofFixtureManager; 