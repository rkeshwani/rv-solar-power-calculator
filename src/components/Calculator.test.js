import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Calculator from './Calculator';

// Mock the MUI TextField component to simplify testing;
// we are not testing MUI behavior itself but our component's logic.
jest.mock('@mui/material/TextField', () => (props) => {
  const { label, value, onChange, type, InputLabelProps, inputProps } = props;
  return (
    <label>
      {label}
      <input
        type={type || 'text'}
        value={value}
        onChange={onChange}
        data-testid={`mock-textfield-${label.toLowerCase().replace(/\s+/g, '-')}`}
        min={inputProps?.min}
      />
    </label>
  );
});

describe('Calculator Component', () => {
  let mockSetBatteryCapacity;

  beforeEach(() => {
    mockSetBatteryCapacity = jest.fn();
  });

  test('renders correctly with given props and displays values', () => {
    render(
      <Calculator
        powerOutput={500}
        batteryCapacity={100}
        setBatteryCapacity={mockSetBatteryCapacity}
        chargingTime={10}
      />
    );

    expect(screen.getByText(/Calculator/i)).toBeInTheDocument();
    expect(screen.getByText(/Power Output: 500 kW/i)).toBeInTheDocument();
    expect(screen.getByText(/Battery Capacity: 100 Ah/i)).toBeInTheDocument();
    expect(screen.getByText(/Estimated time to full charge: 10.00 hours/i)).toBeInTheDocument();
    
    const inputField = screen.getByLabelText(/Set Battery Capacity \(Ah\)/i);
    expect(inputField).toBeInTheDocument();
    expect(inputField.value).toBe('100');
  });

  test('displays "N/A" for charging time when it is Infinity', () => {
    render(
      <Calculator
        powerOutput={0}
        batteryCapacity={100}
        setBatteryCapacity={mockSetBatteryCapacity}
        chargingTime={Infinity}
      />
    );
    expect(screen.getByText(/Estimated time to full charge: N\/A \(check power output or sunlight hours\)/i)).toBeInTheDocument();
  });
  
  test('displays "N/A" for charging time when it is a very large number', () => {
    render(
      <Calculator
        powerOutput={1} // Non-zero power output
        batteryCapacity={10000000} // Large capacity
        setBatteryCapacity={mockSetBatteryCapacity}
        chargingTime={1000001} // Large charging time (batteryCapacity / (powerOutput * sunlightHours))
      />
    );
    expect(screen.getByText(/Estimated time to full charge: N\/A \(check power output or sunlight hours\)/i)).toBeInTheDocument();
  });

  test('calls setBatteryCapacity when input value changes', () => {
    render(
      <Calculator
        powerOutput={500}
        batteryCapacity={100}
        setBatteryCapacity={mockSetBatteryCapacity}
        chargingTime={10}
      />
    );

    const inputField = screen.getByLabelText(/Set Battery Capacity \(Ah\)/i);
    fireEvent.change(inputField, { target: { value: '150' } });
    expect(mockSetBatteryCapacity).toHaveBeenCalledWith(150);
  });

  test('calls setBatteryCapacity with 0 if input value is negative or invalid', () => {
    render(
      <Calculator
        powerOutput={500}
        batteryCapacity={100}
        setBatteryCapacity={mockSetBatteryCapacity}
        chargingTime={10}
      />
    );

    const inputField = screen.getByLabelText(/Set Battery Capacity \(Ah\)/i);
    fireEvent.change(inputField, { target: { value: '-50' } });
    // The component logic ensures it calls setBatteryCapacity with 0 for negative numbers
    expect(mockSetBatteryCapacity).toHaveBeenCalledWith(0); 

    fireEvent.change(inputField, { target: { value: 'abc' } });
     // The component logic ensures it calls setBatteryCapacity with 0 for non-numeric
    expect(mockSetBatteryCapacity).toHaveBeenCalledWith(0);
  });
});
