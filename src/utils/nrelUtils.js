// src/utils/nrelUtils.js

/**
 * Fetches solar irradiance data from the NREL API.
 *
 * @param {number} lat Latitude
 * @param {number} lon Longitude
 * @param {string} apiKey NREL API key (use 'DEMO_KEY' for testing)
 * @returns {Promise<number|null>} A promise that resolves to the annual average
 *                                 Global Horizontal Irradiance (GHI) value,
 *                                 or null if an error occurs.
 */
export const getSolarIrradiance = async (lat, lon, apiKey = 'DEMO_KEY') => {
  const apiUrl = `https://developer.nrel.gov/api/solar/solar_resource/v1.json?api_key=${apiKey}&lat=${lat}&lon=${lon}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error(`NREL API request failed with status: ${response.status}`);
      const errorBody = await response.text();
      console.error(`Error details: ${errorBody}`);
      return null;
    }

    const data = await response.json();

    if (data && data.outputs && data.outputs.avg_ghi && typeof data.outputs.avg_ghi.annual === 'number') {
      return data.outputs.avg_ghi.annual;
    } else {
      console.error('Invalid or incomplete data received from NREL API:', data);
      return null;
    }
  } catch (error) {
    console.error('Error fetching or parsing NREL API data:', error);
    return null;
  }
};
