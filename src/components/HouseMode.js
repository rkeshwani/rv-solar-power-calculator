import React, { useState, useRef, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { generateOverheadView } from '../services/geminiService';
import interact from 'interactjs';

const DraggablePanel = ({ id, x, y, onMove }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const interactable = interact(ref.current).draggable({
      listeners: {
        move(event) {
          const target = event.target;
          // Keep the dragged position in the data attributes
          const dataX = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
          const dataY = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

          // Translate the element
          target.style.transform = `translate(${dataX}px, ${dataY}px)`;

          // Update the posiion attributes
          target.setAttribute('data-x', dataX);
          target.setAttribute('data-y', dataY);

          // Notify parent of new position
          onMove(id, dataX, dataY);
        },
      },
    });

    return () => {
      interactable.unset();
    };
  }, [id, onMove]);

  return (
    <div
      ref={ref}
      style={{
        width: '50px',
        height: '30px',
        backgroundColor: 'rgba(0, 0, 255, 0.5)',
        border: '1px solid blue',
        position: 'absolute',
        top: 0,
        left: 0,
        // Initialize transform with props
        transform: `translate(${x}px, ${y}px)`,
        touchAction: 'none',
        cursor: 'grab'
      }}
      data-x={x}
      data-y={y}
    >
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'white' }}>
        Panel
      </div>
    </div>
  );
};

const HouseMode = () => {
  const [images, setImages] = useState([]);
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  const [error, setError] = useState('');
  const [panels, setPanels] = useState([]);

  const handleImageChange = (event) => {
    if (event.target.files) {
      setImages(Array.from(event.target.files));
    }
  };

  const handleAnalyze = async () => {
    if (images.length === 0) {
      setError('Please upload at least one image.');
      return;
    }
    if (!apiKey) {
      setError('Please enter your Gemini API Key.');
      return;
    }

    setLoading(true);
    setError('');
    setResultImage(null);
    setPanels([]);

    try {
      const generatedImage = await generateOverheadView(images, apiKey);
      setResultImage(generatedImage);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  };

  const addPanel = () => {
    setPanels([...panels, { id: Date.now(), x: 50, y: 50 }]);
  };

  const handlePanelMove = (id, x, y) => {
    setPanels(prevPanels => prevPanels.map(p => p.id === id ? { ...p, x, y } : p));
  };

  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      <Grid item xs={12}>
        <Typography variant="h4" component="h2" gutterBottom>
          House Roof Analyzer
        </Typography>
        <Typography variant="body1" paragraph>
          Add pictures of your house. It doesn't need to include a roof.
          We will use Nano Banana Pro (Gemini 3) to extrapolate and measure the roof automatically.
        </Typography>
      </Grid>

      <Grid item xs={12} md={4}>
        <Button
          variant="contained"
          component="label"
          fullWidth
          sx={{ mb: 2 }}
        >
          Upload Images
          <input
            type="file"
            hidden
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button>

        {images.length > 0 && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            {images.length} image(s) selected
          </Typography>
        )}

        <TextField
          fullWidth
          label="Gemini API Key"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          variant="outlined"
          sx={{ mb: 2 }}
          helperText="Enter your Google Gemini API Key to use Nano Banana Pro."
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleAnalyze}
          disabled={loading || images.length === 0}
          fullWidth
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Analyze with Nano Banana Pro'}
        </Button>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {resultImage && (
          <Button
            variant="outlined"
            onClick={addPanel}
            fullWidth
            sx={{ mt: 2 }}
          >
            Add Solar Panel
          </Button>
        )}
      </Grid>

      <Grid item xs={12} md={8}>
        {resultImage ? (
          <Card sx={{ position: 'relative', overflow: 'hidden' }}>
             {/* Using a div container for relative positioning of panels */}
             <div style={{ position: 'relative', width: '100%' }}>
                <img
                  src={resultImage}
                  alt="Generated Overhead View"
                  style={{ width: '100%', display: 'block' }}
                  draggable={false}
                />
                {panels.map(panel => (
                  <DraggablePanel
                    key={panel.id}
                    id={panel.id}
                    x={panel.x}
                    y={panel.y}
                    onMove={handlePanelMove}
                  />
                ))}
             </div>
            <Box p={2}>
              <Typography variant="caption">
                Generated Overhead View with Measurements. Drag panels to place them.
              </Typography>
            </Box>
          </Card>
        ) : (
          <Box
            sx={{
              height: 300,
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed #ccc',
              borderRadius: 1
            }}
          >
            <Typography variant="body2" color="textSecondary">
              Result will appear here
            </Typography>
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default HouseMode;
