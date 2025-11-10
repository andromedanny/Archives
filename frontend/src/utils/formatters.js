/**
 * Format course name to short code
 * If it's already a code (like "BSIT"), return it as is
 * If it's a full name, extract the code or convert it
 * @param {string} courseName - The course name or code
 * @returns {string} - The shortened course code
 */
export const formatCourseCode = (courseName) => {
  if (!courseName) return 'N/A';
  
  // If it's already a short code (uppercase, 2-10 chars, no spaces), return as is
  if (/^[A-Z]{2,10}$/.test(courseName.trim())) {
    return courseName.trim().toUpperCase();
  }
  
  // Try to extract code from common patterns
  // Pattern: "Bachelor of Science in Information Technology" -> "BSIT"
  const words = courseName.trim().split(/\s+/);
  const code = words
    .filter(word => /^[A-Z]/.test(word)) // Get words starting with capital
    .map(word => word[0]) // Get first letter
    .join('')
    .toUpperCase();
  
  // If we got a reasonable code (2-10 chars), return it
  if (code.length >= 2 && code.length <= 10) {
    return code;
  }
  
  // Common course name mappings
  const courseMappings = {
    'bachelor of science in information technology': 'BSIT',
    'bachelor of science in computer science': 'BSCS',
    'bachelor of science in entertainment and multimedia computing': 'BSEMC',
    'information technology': 'BSIT',
    'computer science': 'BSCS',
    'entertainment and multimedia computing': 'BSEMC',
  };
  
  const lowerName = courseName.toLowerCase().trim();
  if (courseMappings[lowerName]) {
    return courseMappings[lowerName];
  }
  
  // If all else fails, return the original (might already be a code)
  return courseName.trim().toUpperCase();
};

/**
 * Format academic year to short format
 * "2025-2026" -> "25-26"
 * "2023-2024" -> "23-24"
 * @param {string} academicYear - The academic year string
 * @returns {string} - The shortened academic year
 */
export const formatAcademicYear = (academicYear) => {
  if (!academicYear) return 'N/A';
  
  // Match pattern like "2025-2026" or "2025 - 2026"
  const match = academicYear.toString().match(/(\d{4})\s*-\s*(\d{4})/);
  if (match) {
    const startYear = match[1].substring(2); // Get last 2 digits
    const endYear = match[2].substring(2); // Get last 2 digits
    return `${startYear}-${endYear}`;
  }
  
  // If it's already in short format like "25-26", return as is
  if (/^\d{2}-\d{2}$/.test(academicYear.trim())) {
    return academicYear.trim();
  }
  
  // If it's just a single year like "2025", return last 2 digits
  const singleYearMatch = academicYear.toString().match(/^(\d{4})$/);
  if (singleYearMatch) {
    return singleYearMatch[1].substring(2);
  }
  
  // Return original if no pattern matches
  return academicYear;
};

