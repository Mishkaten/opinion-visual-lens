
/**
 * Validates if the uploaded file is a valid JSON file containing review data
 */
export const validateReviewJson = (jsonData: any): boolean => {
  if (!Array.isArray(jsonData)) {
    return false;
  }

  // Check if the array has at least one element and it has the expected properties
  return jsonData.length > 0 && jsonData.every(item => 
    typeof item === 'object' && 
    'Author' in item && 
    'Body' in item && 
    'Date' in item && 
    'Heading' in item && 
    'Location' in item && 
    'Rating' in item
  );
};

/**
 * Parse a file as JSON
 */
export const parseJsonFile = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        resolve(json);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};
