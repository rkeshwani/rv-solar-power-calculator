
/**
 * Convert a file to a Base64 string.
 * @param {File} file
 * @returns {Promise<string>}
 */
const fileToGenerativePart = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type
        }
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Call the Gemini API (Nano Banana Pro) to generate an overhead view.
 * @param {File[]} images
 * @param {string} apiKey
 * @returns {Promise<string>} The URL or Base64 of the generated image.
 */
export const generateOverheadView = async (images, apiKey) => {
  if (!apiKey) {
    throw new Error("API Key is required");
  }

  const model = "gemini-3-pro-image-preview"; // Nano Banana Pro identifier
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const imageParts = await Promise.all(images.map(fileToGenerativePart));

  const payload = {
    contents: [
      {
        parts: [
          { text: "Can you extrapolate an overhead image view with measurements of the roof given these images?" },
          ...imageParts
        ]
      }
    ]
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error calling Gemini API: ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();

  // Extract the image from the response.
  // Note: The response format for image generation models might differ slightly.
  // Standard text generation structure: candidates[0].content.parts[...]
  // If it returns an image, it is often in base64 within inline_data or a separate field.
  // Assuming the model returns a generated image in the candidates.

  const candidate = data.candidates?.[0];
  if (!candidate) {
    throw new Error("No candidates returned from API");
  }

  // Look for image part
  const imagePart = candidate.content.parts.find(part => part.inline_data || part.inlineData);

  if (imagePart) {
    const inlineData = imagePart.inline_data || imagePart.inlineData;
    return `data:${inlineData.mime_type || inlineData.mimeType};base64,${inlineData.data}`;
  }

  // If no image part found, maybe it returned text describing the failure or a link.
  const textPart = candidate.content.parts.find(part => part.text);
  if (textPart) {
    throw new Error(`Model returned text instead of image: ${textPart.text}`);
  }

  throw new Error("Unexpected response format from Gemini API");
};
