// src/utils/nrelUtils.test.js
import { getSolarIrradiance } from './nrelUtils';

global.fetch = jest.fn();
global.console = {
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(), // if you want to mock console.log as well
};

describe('getSolarIrradiance', () => {
  beforeEach(() => {
    fetch.mockClear();
    console.error.mockClear();
    console.warn.mockClear();
  });

  it('should return annual GHI on successful API call', async () => {
    const mockSuccessResponse = {
      outputs: {
        avg_ghi: {
          annual: 5.75,
        },
      },
    };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockSuccessResponse,
    });

    const ghi = await getSolarIrradiance(40, -105, 'DEMO_KEY');
    expect(ghi).toBe(5.75);
    expect(fetch).toHaveBeenCalledWith(
      'https://developer.nrel.gov/api/solar/solar_resource/v1.json?api_key=DEMO_KEY&lat=40&lon=-105'
    );
  });

  it('should return null and log error on API error (response not ok)', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error',
    });

    const ghi = await getSolarIrradiance(40, -105, 'DEMO_KEY');
    expect(ghi).toBeNull();
    expect(console.error).toHaveBeenCalledWith('NREL API request failed with status: 500');
    expect(console.error).toHaveBeenCalledWith('Error details: Internal Server Error');
  });

  it('should return null and log error on network error', async () => {
    fetch.mockRejectedValueOnce(new Error('Network failure'));

    const ghi = await getSolarIrradiance(40, -105, 'DEMO_KEY');
    expect(ghi).toBeNull();
    expect(console.error).toHaveBeenCalledWith('Error fetching or parsing NREL API data:', expect.any(Error));
  });

  it('should return null and log error on invalid data format', async () => {
    const mockInvalidResponse = {
      outputs: {
        // Missing avg_ghi or annual value
      },
    };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockInvalidResponse,
    });

    const ghi = await getSolarIrradiance(40, -105, 'DEMO_KEY');
    expect(ghi).toBeNull();
    expect(console.error).toHaveBeenCalledWith('Invalid or incomplete data received from NREL API:', mockInvalidResponse);
  });
});
