// Temperature conversion utilities for ConvertTemp

export type TemperatureUnit = 'C' | 'F' | 'K' | 'R';

export interface ConversionResult {
  celsius: number;
  fahrenheit: number;
  kelvin: number;
  rankine: number;
  formatted: {
    celsius: string;
    fahrenheit: string;
    kelvin: string;
    rankine: string;
  };
}

// Core conversion functions (all from Celsius base)
export const conversions = {
  // To Celsius
  toCelsius: {
    fromFahrenheit: (f: number) => (f - 32) * 5/9,
    fromKelvin: (k: number) => k - 273.15,
    fromRankine: (r: number) => (r - 491.67) * 5/9,
  },
  
  // From Celsius
  fromCelsius: {
    toFahrenheit: (c: number) => (c * 9/5) + 32,
    toKelvin: (c: number) => c + 273.15,
    toRankine: (c: number) => (c + 273.15) * 9/5,
  }
};

// Convert any temperature to all units
export function convertTemperature(value: number, fromUnit: TemperatureUnit): ConversionResult {
  let celsius: number;
  
  // First convert input to Celsius
  switch (fromUnit) {
    case 'C':
      celsius = value;
      break;
    case 'F':
      celsius = conversions.toCelsius.fromFahrenheit(value);
      break;
    case 'K':
      celsius = conversions.toCelsius.fromKelvin(value);
      break;
    case 'R':
      celsius = conversions.toCelsius.fromRankine(value);
      break;
    default:
      celsius = value;
  }
  
  // Convert from Celsius to all other units
  const fahrenheit = conversions.fromCelsius.toFahrenheit(celsius);
  const kelvin = conversions.fromCelsius.toKelvin(celsius);
  const rankine = conversions.fromCelsius.toRankine(celsius);
  
  return {
    celsius,
    fahrenheit,
    kelvin,
    rankine,
    formatted: {
      celsius: formatTemperature(celsius, 'C'),
      fahrenheit: formatTemperature(fahrenheit, 'F'),
      kelvin: formatTemperature(kelvin, 'K'),
      rankine: formatTemperature(rankine, 'R'),
    }
  };
}

// Format temperature with proper precision and unit symbol
export function formatTemperature(value: number, unit: TemperatureUnit): string {
  const precision = Math.abs(value) >= 100 ? 1 : 2;
  const symbol = getUnitSymbol(unit);
  return `${value.toFixed(precision)}${symbol}`;
}

// Get unit symbol
export function getUnitSymbol(unit: TemperatureUnit): string {
  const symbols = {
    'C': '°C',
    'F': '°F', 
    'K': 'K',
    'R': '°R'
  };
  return symbols[unit];
}

// Parse smart input like "100F", "36C", "273K"
export function parseSmartInput(input: string): { value: number; unit: TemperatureUnit } | null {
  const cleaned = input.trim().toUpperCase();
  
  // Try to extract number and unit
  const match = cleaned.match(/^(-?\d*\.?\d+)\s*([CFKR]?)$/);
  if (!match) return null;
  
  const value = parseFloat(match[1]);
  if (isNaN(value)) return null;
  
  const unitChar = match[2] as TemperatureUnit;
  const unit = unitChar || 'C'; // Default to Celsius if no unit specified
  
  return { value, unit };
}

// Detect user's preferred temperature unit based on locale
export function detectPreferredUnit(): TemperatureUnit {
  if (typeof window === 'undefined') return 'C';
  
  const locale = navigator.language || navigator.languages?.[0] || 'en-US';
  const region = locale.split('-')[1]?.toUpperCase();
  
  // Countries that primarily use Fahrenheit
  const fahrenheitCountries = ['US', 'BS', 'BZ', 'KY', 'PW'];
  
  return fahrenheitCountries.includes(region || '') ? 'F' : 'C';
}

// Validate temperature input (basic physics constraints)
export function validateTemperature(value: number, unit: TemperatureUnit): boolean {
  const minValues = {
    'C': -273.15,  // Absolute zero in Celsius
    'F': -459.67,  // Absolute zero in Fahrenheit
    'K': 0,        // Absolute zero in Kelvin
    'R': 0         // Absolute zero in Rankine
  };
  
  return value >= minValues[unit] && value <= 10000; // Reasonable upper limit
}