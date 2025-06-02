import React from 'react';
import { render, screen, fireEvent, within, waitFor, act } from '@testing-library/react';
import App from './App';
import { getSolarIrradiance } from './utils/nrelUtils'; // Import the actual function
import { RoofDimensionsProvider } from './contexts/RoofDimensionsContext';
import { SolarPanelProvider } from './contexts/SolarPanelContext';
import { RoofFixturesProvider } from './contexts/RoofFixturesContext';
import { BatteryProvider, BatteryContext } from './contexts/BatteryContext'; // Ensure BatteryContext is imported if used directly
import { RoofDimensionsContext } from './contexts/RoofDimensionsContext'; // Ensure these are imported for direct use
import { SolarPanelContext } from './contexts/SolarPanelContext'; // if needed by new tests directly
import { RoofFixturesContext } from './contexts/RoofFixturesContext'; // if needed


// Mock child components that are complex or not relevant to these specific tests
jest.mock('./components/RV3D', () => ({
  RV3DViewer: () => <div data-testid="rv-3d-viewer-mock">RV 3D Viewer Mock</div>,
}));
jest.mock('./components/RoofFixtureManager', () => () => <div data-testid="roof-fixture-manager-mock">Roof Fixture Manager Mock</div>);

// Mock the MUI TextField component used in Calculator.js to simplify interaction
// This is the same mock as in Calculator.test.js
jest.mock('@mui/material/TextField', () => (props) => {
  const { label, value, onChange, type } = props;
  return (
    <label>
      {label}
      <input
        type={type || 'text'}
        value={value}
        onChange={onChange}
        data-testid={`mock-textfield-${label.toLowerCase().replace(/\s+/g, '-')}`}
      />
    </label>
  );
});

// Mock the nrelUtils module
jest.mock('./utils/nrelUtils', () => ({
  getSolarIrradiance: jest.fn(),
}));

// Mock console methods
global.console = {
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
};

// Mock navigator.geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
};
global.navigator.geolocation = mockGeolocation;

// Mock window.alert
global.alert = jest.fn();

// Wrapper with ACTUAL providers for the OLD tests
const AllProvidersForOldTests = ({ children }) => {
  return (
    <RoofDimensionsProvider>
      <SolarPanelProvider>
        <RoofFixturesProvider>
          <BatteryProvider>{children}</BatteryProvider>
        </RoofFixturesProvider>
      </SolarPanelProvider>
    </RoofDimensionsProvider>
  );
};

// Render function for the OLD tests, uses actual context providers
const renderAppOldTests = () => render(<App />, { wrapper: AllProvidersForOldTests });

// Specific MOCK context values for the NEW solar integration tests
const mockRoofDimensionsContext = {
  roofDimensions: { length: 10, width: 10 },
  setRoofDimensions: jest.fn(),
};
const mockSolarPanelContext = {
  solarPanels: [], // Start with no panels for these tests initially
  setSolarPanels: jest.fn(),
};
const mockRoofFixturesContext = {
  roofFixtures: [],
  setRoofFixtures: jest.fn(),
};
const mockBatteryContext = {
  batteryCapacity: 100, // Default battery capacity
  setBatteryCapacity: jest.fn(),
};

// Render function for the NEW solar integration tests, using MOCKED context values
const renderAppWithMockedProvidersForNewTests = () => {
  return render(
    <RoofDimensionsContext.Provider value={mockRoofDimensionsContext}>
      <SolarPanelContext.Provider value={mockSolarPanelContext}>
        <RoofFixturesContext.Provider value={mockRoofFixturesContext}>
          <BatteryContext.Provider value={mockBatteryContext}>
            <App />
          </BatteryContext.Provider>
        </RoofFixturesContext.Provider>
      </SolarPanelContext.Provider>
    </RoofDimensionsContext.Provider>
  );
};


describe('App Component - Integration Tests for Power and Charging Time', () => {
  beforeEach(() => {
    // Clear mocks that might be affected by these older tests if they also use them
    console.log.mockClear();
    console.warn.mockClear();
    console.error.mockClear();
    alert.mockClear(); // Clear alert mock before each test in this suite
    // getSolarIrradiance.mockClear(); // Not used by this suite
    // mockGeolocation.getCurrentPosition.mockClear(); // Not used by this suite
  });

  test('renders App and initial Calculator values', () => {
    renderAppOldTests();
    // Check for a high-level element in App
    expect(screen.getByText(/RV Solar Power Calculator/i)).toBeInTheDocument();

    // Initial state from BatteryContext is 100Ah, 0 power output, so N/A charging time
    expect(screen.getByText(/Power Output: 0 kW/i)).toBeInTheDocument();
    expect(screen.getByText(/Battery Capacity: 100 Ah/i)).toBeInTheDocument(); // Initial from BatteryContext
    expect(screen.getByText(/Estimated time to full charge: N\/A/i)).toBeInTheDocument();
  });

  test('calculatePowerAndChargeTime: updates power output and charging time when a solar panel is added', async () => {
    renderAppOldTests();

    // Set roof dimensions before adding panels
    const lengthInput = screen.getByTestId('mock-textfield-length-(ft/m)');
    const widthInput = screen.getByTestId('mock-textfield-width-(ft/m)');
    
    fireEvent.change(lengthInput, { target: { value: '10' } });
    fireEvent.change(widthInput, { target: { value: '10' } });

    // Wait for dimension update to reflect if necessary, though context updates should be synchronous with re-renders.
    // Check that App component has received the new dimensions (optional, direct check might be hard)
    // For now, assume dimensions are set and proceed to test panel addition.

    // Initial state: 0 power, 100Ah battery, N/A charge time
    expect(screen.getByText(/Power Output: 0 kW/i)).toBeInTheDocument();
    expect(screen.getByText(/Battery Capacity: 100 Ah/i)).toBeInTheDocument();
    expect(screen.getByText(/Estimated time to full charge: N\/A/i)).toBeInTheDocument();

    // Add a solar panel (default is 1 length, 1 width, 1 powerCapacity)
    const addPanelButton = screen.getByRole('button', { name: /Add Solar Panel/i });
    fireEvent.click(addPanelButton);
    
    // Wait for state updates if necessary, though with simple mocks it might be synchronous
    // Power output should be 1 kW (from the added panel)
    // Battery capacity is 100 Ah
    // Sunlight hours is 5 (constant in App.js initially, this test doesn't involve geolocation)
    // Expected charging time = 100 / (1 * 5) = 20 hours
    // Note: findByText has a default timeout of 1000ms. If updates are slow, might need to increase.
    expect(await screen.findByText(/Power Output: 1 kW/i, {}, { timeout: 2000 })).toBeInTheDocument();
    expect(screen.getByText(/Battery Capacity: 100 Ah/i)).toBeInTheDocument();
    expect(await screen.findByText(/Estimated time to full charge: 20.00 hours/i, {}, { timeout: 2000 })).toBeInTheDocument();

    // Add another panel
    fireEvent.click(addPanelButton);
    // Power output should be 2 kW
    // Expected charging time = 100 / (2 * 5) = 10 hours
    expect(await screen.findByText(/Power Output: 2 kW/i, {}, { timeout: 2000 })).toBeInTheDocument();
    expect(screen.getByText(/Battery Capacity: 100 Ah/i)).toBeInTheDocument();
    expect(await screen.findByText(/Estimated time to full charge: 10.00 hours/i, {}, { timeout: 2000 })).toBeInTheDocument();
  });

  test('calculatePowerAndChargeTime: updates charging time when battery capacity changes', async () => {
    renderAppOldTests();

    // Set roof dimensions to allow panel placement
    const lengthInput = screen.getByTestId('mock-textfield-length-(ft/m)');
    const widthInput = screen.getByTestId('mock-textfield-width-(ft/m)');
    fireEvent.change(lengthInput, { target: { value: '10' } });
    fireEvent.change(widthInput, { target: { value: '10' } });

    // Add a solar panel to have some power output
    const addPanelButton = screen.getByRole('button', { name: /Add Solar Panel/i });
    fireEvent.click(addPanelButton); // Adds a 1kW panel

    // Initial calculation: 100Ah / (1kW * 5h) = 20 hours
    expect(await screen.findByText(/Power Output: 1 kW/i, {}, { timeout: 2000 })).toBeInTheDocument();
    expect(await screen.findByText(/Estimated time to full charge: 20.00 hours/i, {}, { timeout: 2000 })).toBeInTheDocument();

    // Change battery capacity using the input in Calculator
    const batteryInput = screen.getByLabelText(/Set Battery Capacity \(Ah\)/i);
    fireEvent.change(batteryInput, { target: { value: '200' } });

    // New calculation: 200Ah / (1kW * 5h) = 40 hours
    expect(screen.getByText(/Battery Capacity: 200 Ah/i)).toBeInTheDocument();
    expect(await screen.findByText(/Estimated time to full charge: 40.00 hours/i)).toBeInTheDocument();

    fireEvent.change(batteryInput, { target: { value: '50' } });
    // New calculation: 50Ah / (1kW * 5h) = 10 hours
    expect(screen.getByText(/Battery Capacity: 50 Ah/i)).toBeInTheDocument();
    expect(await screen.findByText(/Estimated time to full charge: 10.00 hours/i)).toBeInTheDocument();
  });

  test('calculatePowerAndChargeTime: chargingTime is N/A if powerOutput is 0 after panels are removed', async () => {
    renderAppOldTests();

        // Set roof dimensions to allow panel placement
    const lengthInput = screen.getByTestId('mock-textfield-length-(ft/m)');
    const widthInput = screen.getByTestId('mock-textfield-width-(ft/m)');
    fireEvent.change(lengthInput, { target: { value: '10' } });
    fireEvent.change(widthInput, { target: { value: '10' } });

    const addPanelButton = screen.getByRole('button', { name: /Add Solar Panel/i });
    fireEvent.click(addPanelButton); // Adds a 1kW panel

    expect(await screen.findByText(/Power Output: 1 kW/i, {}, { timeout: 2000 })).toBeInTheDocument();
    expect(await screen.findByText(/Estimated time to full charge: 20.00 hours/i, {}, { timeout: 2000 })).toBeInTheDocument(); // 100Ah / (1kW * 5h)
    
    const removeButtons = await screen.findAllByRole('button', { name: /Remove/i });
    expect(removeButtons.length).toBeGreaterThan(0); 
    fireEvent.click(removeButtons[0]); 

    expect(await screen.findByText(/Power Output: 0 kW/i)).toBeInTheDocument();
    expect(screen.getByText(/Battery Capacity: 100 Ah/i)).toBeInTheDocument(); 
    expect(await screen.findByText(/Estimated time to full charge: N\/A/i)).toBeInTheDocument();
  });

  test('calculatePowerAndChargeTime: chargingTime is 0.00 if battery capacity is 0', async () => {
    renderAppOldTests();

    // Set roof dimensions to allow panel placement
    const lengthInput = screen.getByTestId('mock-textfield-length-(ft/m)');
    const widthInput = screen.getByTestId('mock-textfield-width-(ft/m)');
    fireEvent.change(lengthInput, { target: { value: '10' } });
    fireEvent.change(widthInput, { target: { value: '10' } });

    const addPanelButton = screen.getByRole('button', { name: /Add Solar Panel/i });
    fireEvent.click(addPanelButton); // 1kW panel, 100Ah default battery -> 20 hours

    expect(await screen.findByText(/Power Output: 1 kW/i, {}, { timeout: 2000 })).toBeInTheDocument();
    expect(await screen.findByText(/Estimated time to full charge: 20.00 hours/i, {}, { timeout: 2000 })).toBeInTheDocument();

    const batteryInput = screen.getByLabelText(/Set Battery Capacity \(Ah\)/i);
    fireEvent.change(batteryInput, { target: { value: '0' } });
    
    // Calculation: 0Ah / (1kW * 5h) = 0 hours
    expect(screen.getByText(/Battery Capacity: 0 Ah/i)).toBeInTheDocument();
    expect(await screen.findByText(/Estimated time to full charge: 0.00 hours/i)).toBeInTheDocument();
  });
});

// New test suite for solar integration
describe('App component solar integration', () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
    getSolarIrradiance.mockReset();
    // Ensure navigator.geolocation is reset to the mock for each test in this suite
    global.navigator.geolocation = mockGeolocation; 
  });

  it('should fetch GHI and update sunlight hours on successful geolocation and API call', async () => {
    mockGeolocation.getCurrentPosition.mockImplementationOnce((successCallback) => {
      successCallback({ coords: { latitude: 40, longitude: -105 } });
    });
    getSolarIrradiance.mockResolvedValueOnce(5.5); // Mock successful GHI value

    renderAppWithMockedProvidersForNewTests(); // Use the correctly named render function
    
    await waitFor(() => {
      expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(getSolarIrradiance).toHaveBeenCalledWith(40, -105);
    });
    
    await waitFor(() => {
       expect(console.log).toHaveBeenCalledWith('Successfully fetched GHI: 5.5, updated sunlightHours.');
    });
    // Add assertions here to check if charging time updates based on 5.5 sunlight hours if possible
    // This depends on how App.js state changes propagate and if Calculator reflects it.
    // For example, if a panel was added, the charging time would use 5.5 instead of 5.
    // With 0 panels (current mockSolarPanelContext), power output is 0, so charging time is N/A.
    // If we want to test the effect on charging time, we'd need to set up panels in mockSolarPanelContext.
    // For now, the console.log confirms the GHI was received and state update was attempted.
  });

  it('should use default sunlight hours and log warning on geolocation failure', async () => {
    mockGeolocation.getCurrentPosition.mockImplementationOnce((_, errorCallback) => {
      errorCallback({ message: 'User denied Geolocation' });
    });

    renderAppWithMockedProvidersForNewTests(); // Use the correctly named render function

    await waitFor(() => {
      expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalledTimes(1);
    });
    expect(getSolarIrradiance).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(console.warn).toHaveBeenCalledWith('Using default sunlight hours (5) due to geolocation error.');
    });
  });

  it('should use default sunlight hours and log warning if NREL API call fails', async () => {
    mockGeolocation.getCurrentPosition.mockImplementationOnce((successCallback) => {
      successCallback({ coords: { latitude: 40, longitude: -105 } });
    });
    getSolarIrradiance.mockResolvedValueOnce(null); // Mock failed API call

    renderAppWithMockedProvidersForNewTests(); // Use the correctly named render function

    await waitFor(() => {
      expect(getSolarIrradiance).toHaveBeenCalledWith(40, -105);
    });
    await waitFor(() => {
      expect(console.warn).toHaveBeenCalledWith('Failed to fetch solar irradiance data. Using default sunlight hours (5).');
    });
  });

  it('should log warning if geolocation is not supported', async () => {
    global.navigator.geolocation = undefined; // Simulate no geolocation support
    renderAppWithMockedProvidersForNewTests(); // Use the correctly named render function
    await waitFor(() => {
        expect(console.warn).toHaveBeenCalledWith('Geolocation is not supported by this browser. Using default sunlight hours (5).');
    });
    // No need to restore global.navigator.geolocation here because beforeEach will handle it.
  });
});

