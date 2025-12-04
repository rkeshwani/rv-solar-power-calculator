import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { RoofDimensionsProvider } from './contexts/RoofDimensionsContext';
import { SolarPanelProvider } from './contexts/SolarPanelContext';
import { RoofFixturesProvider } from './contexts/RoofFixturesContext';

// Mock the components that use Three.js to avoid Jest transformation issues
jest.mock('./components/RV3D', () => ({
  RV3DViewer: () => <div data-testid="rv3d-viewer">RV3DViewer</div>
}));

const MockProviders = ({ children }) => {
  return (
    <RoofDimensionsProvider>
      <SolarPanelProvider>
        <RoofFixturesProvider>
          {children}
        </RoofFixturesProvider>
      </SolarPanelProvider>
    </RoofDimensionsProvider>
  );
};

test('renders Solar Power Calculator title', () => {
  render(
    <MockProviders>
      <App />
    </MockProviders>
  );
  const titleElement = screen.getByText(/Solar Power Calculator/i);
  expect(titleElement).toBeInTheDocument();
});

test('switches to House Mode and back to RV Mode', () => {
  render(
    <MockProviders>
      <App />
    </MockProviders>
  );
  const houseModeButton = screen.getByRole('button', { name: /House Mode/i });

  // Switch to House Mode
  fireEvent.click(houseModeButton);
  const houseModeText = screen.getByText(/House Roof Analyzer/i);
  expect(houseModeText).toBeInTheDocument();

  // Verify RV components are hidden
  const rvText = screen.queryByText(/Select a Recreational Vehicle/i);
  expect(rvText).not.toBeInTheDocument();

  // Switch back to RV Mode
  const rvModeButton = screen.getByRole('button', { name: /RV Mode/i });
  fireEvent.click(rvModeButton);

  const rvTextBack = screen.getByText(/Select a Recreational Vehicle/i);
  expect(rvTextBack).toBeInTheDocument();
});
