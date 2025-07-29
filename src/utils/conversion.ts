// Temperature conversion utilities for ConvertTemp

export type TemperatureUnit = 'C' | 'F' | 'K' | 'R' | 'Re' | 'De' | 'N' | 'Ro';

export interface ConversionResult {
  celsius: number;
  fahrenheit: number;
  kelvin: number;
  rankine: number;
  reaumur: number;
  delisle: number;
  newton: number;
  romer: number;
  formatted: {
    celsius: string;
    fahrenheit: string;
    kelvin: string;
    rankine: string;
    reaumur: string;
    delisle: string;
    newton: string;
    romer: string;
  };
}

// Core conversion functions (all from Celsius base)
export const conversions = {
  // To Celsius
  toCelsius: {
    fromFahrenheit: (f: number) => (f - 32) * 5/9,
    fromKelvin: (k: number) => k - 273.15,
    fromRankine: (r: number) => (r - 491.67) * 5/9,
    fromReaumur: (re: number) => re * 5/4,
    fromDelisle: (de: number) => 100 - de * 2/3,
    fromNewton: (n: number) => n * 100/33,
    fromRomer: (ro: number) => (ro - 7.5) * 40/21,
  },
  
  // From Celsius
  fromCelsius: {
    toFahrenheit: (c: number) => (c * 9/5) + 32,
    toKelvin: (c: number) => c + 273.15,
    toRankine: (c: number) => (c + 273.15) * 9/5,
    toReaumur: (c: number) => c * 4/5,
    toDelisle: (c: number) => (100 - c) * 3/2,
    toNewton: (c: number) => c * 33/100,
    toRomer: (c: number) => c * 21/40 + 7.5,
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
    case 'Re':
      celsius = conversions.toCelsius.fromReaumur(value);
      break;
    case 'De':
      celsius = conversions.toCelsius.fromDelisle(value);
      break;
    case 'N':
      celsius = conversions.toCelsius.fromNewton(value);
      break;
    case 'Ro':
      celsius = conversions.toCelsius.fromRomer(value);
      break;
    default:
      celsius = value;
  }
  
  // Convert from Celsius to all other units
  const fahrenheit = conversions.fromCelsius.toFahrenheit(celsius);
  const kelvin = conversions.fromCelsius.toKelvin(celsius);
  const rankine = conversions.fromCelsius.toRankine(celsius);
  const reaumur = conversions.fromCelsius.toReaumur(celsius);
  const delisle = conversions.fromCelsius.toDelisle(celsius);
  const newton = conversions.fromCelsius.toNewton(celsius);
  const romer = conversions.fromCelsius.toRomer(celsius);
  
  return {
    celsius,
    fahrenheit,
    kelvin,
    rankine,
    reaumur,
    delisle,
    newton,
    romer,
    formatted: {
      celsius: formatTemperature(celsius, 'C'),
      fahrenheit: formatTemperature(fahrenheit, 'F'),
      kelvin: formatTemperature(kelvin, 'K'),
      rankine: formatTemperature(rankine, 'R'),
      reaumur: formatTemperature(reaumur, 'Re'),
      delisle: formatTemperature(delisle, 'De'),
      newton: formatTemperature(newton, 'N'),
      romer: formatTemperature(romer, 'Ro'),
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
    'R': '°R',
    'Re': '°Re',
    'De': '°De',
    'N': '°N',
    'Ro': '°Ro'
  };
  return symbols[unit];
}

// Parse smart input like "100F", "36C", "273K", "80Re", "150De", "33N", "60Ro"
export function parseSmartInput(input: string): { value: number; unit: TemperatureUnit } | null {
  const cleaned = input.trim().toUpperCase();
  
  // Try to extract number and unit
  const match = cleaned.match(/^(-?\d*\.?\d+)\s*([CFKR]|RE|DE|N|RO)?$/);
  if (!match) return null;
  
  const value = parseFloat(match[1]);
  if (isNaN(value)) return null;
  
  let unitStr = match[2] || 'C'; // Default to Celsius if no unit specified
  
  // Map string units to TemperatureUnit
  const unitMap: Record<string, TemperatureUnit> = {
    'C': 'C', 'F': 'F', 'K': 'K', 'R': 'R',
    'RE': 'Re', 'DE': 'De', 'N': 'N', 'RO': 'Ro'
  };
  
  const unit = unitMap[unitStr] || 'C';
  
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
    'C': -273.15,    // Absolute zero in Celsius
    'F': -459.67,    // Absolute zero in Fahrenheit
    'K': 0,          // Absolute zero in Kelvin
    'R': 0,          // Absolute zero in Rankine
    'Re': -218.52,   // Absolute zero in Réaumur
    'De': 559.725,   // Absolute zero in Delisle
    'N': -90.14,     // Absolute zero in Newton
    'Ro': -135.90    // Absolute zero in Rømer
  };
  
  return value >= minValues[unit] && value <= 10000; // Reasonable upper limit
}

// Get conversion formula for display
export function getConversionFormula(fromUnit: TemperatureUnit, toUnit: TemperatureUnit): string {
  if (fromUnit === toUnit) return `${toUnit} = ${toUnit}`;
  
  const formulas: Record<string, Record<string, string>> = {
    'C': {
      'F': '°F = (°C × 9/5) + 32',
      'K': 'K = °C + 273.15',
      'R': '°R = (°C + 273.15) × 9/5',
      'Re': '°Re = °C × 4/5',
      'De': '°De = (100 - °C) × 3/2',
      'N': '°N = °C × 33/100',
      'Ro': '°Ro = °C × 21/40 + 7.5'
    },
    'F': {
      'C': '°C = (°F - 32) × 5/9',
      'K': 'K = (°F - 32) × 5/9 + 273.15',
      'R': '°R = °F + 459.67',
      'Re': '°Re = (°F - 32) × 4/9',
      'De': '°De = (212 - °F) × 5/6',
      'N': '°N = (°F - 32) × 11/60',
      'Ro': '°Ro = (°F - 32) × 7/24 + 7.5'
    },
    'K': {
      'C': '°C = K - 273.15',
      'F': '°F = (K - 273.15) × 9/5 + 32',
      'R': '°R = K × 9/5',
      'Re': '°Re = (K - 273.15) × 4/5',
      'De': '°De = (373.15 - K) × 3/2',
      'N': '°N = (K - 273.15) × 33/100',
      'Ro': '°Ro = (K - 273.15) × 21/40 + 7.5'
    },
    'R': {
      'C': '°C = (°R - 491.67) × 5/9',
      'F': '°F = °R - 459.67',
      'K': 'K = °R × 5/9',
      'Re': '°Re = (°R - 491.67) × 4/9',
      'De': '°De = (671.67 - °R) × 5/6',
      'N': '°N = (°R - 491.67) × 11/60',
      'Ro': '°Ro = (°R - 491.67) × 7/24 + 7.5'
    },
    'Re': {
      'C': '°C = °Re × 5/4',
      'F': '°F = °Re × 9/4 + 32',
      'K': 'K = °Re × 5/4 + 273.15',
      'R': '°R = °Re × 9/4 + 491.67',
      'De': '°De = (80 - °Re) × 15/8',
      'N': '°N = °Re × 33/80',
      'Ro': '°Ro = °Re × 21/32 + 7.5'
    },
    'De': {
      'C': '°C = 100 - °De × 2/3',
      'F': '°F = 212 - °De × 6/5',
      'K': 'K = 373.15 - °De × 2/3',
      'R': '°R = 671.67 - °De × 6/5',
      'Re': '°Re = 80 - °De × 8/15',
      'N': '°N = 33 - °De × 11/50',
      'Ro': '°Ro = 60 - °De × 7/20'
    },
    'N': {
      'C': '°C = °N × 100/33',
      'F': '°F = °N × 60/11 + 32',
      'K': 'K = °N × 100/33 + 273.15',
      'R': '°R = °N × 60/11 + 491.67',
      'Re': '°Re = °N × 80/33',
      'De': '°De = (33 - °N) × 50/11',
      'Ro': '°Ro = °N × 35/22 + 7.5'
    },
    'Ro': {
      'C': '°C = (°Ro - 7.5) × 40/21',
      'F': '°F = (°Ro - 7.5) × 24/7 + 32',
      'K': 'K = (°Ro - 7.5) × 40/21 + 273.15',
      'R': '°R = (°Ro - 7.5) × 24/7 + 491.67',
      'Re': '°Re = (°Ro - 7.5) × 32/21',
      'De': '°De = (60 - °Ro) × 20/7',
      'N': '°N = (°Ro - 7.5) × 22/35'
    }
  };
  
  return formulas[fromUnit]?.[toUnit] || `${fromUnit} → ${toUnit}`;
}

// Get unit description
export function getUnitDescription(unit: TemperatureUnit): string {
  const descriptions = {
    'C': 'Celsius - Water freezes at 0°C, boils at 100°C',
    'F': 'Fahrenheit - Water freezes at 32°F, boils at 212°F',
    'K': 'Kelvin - Absolute temperature scale, 0K = absolute zero',
    'R': 'Rankine - Absolute Fahrenheit scale, 0°R = absolute zero',
    'Re': 'Réaumur - Water freezes at 0°Re, boils at 80°Re',
    'De': 'Delisle - Water freezes at 150°De, boils at 0°De (inverted)',
    'N': 'Newton - Water freezes at 0°N, boils at 33°N',
    'Ro': 'Rømer - Water freezes at 7.5°Ro, boils at 60°Ro'
  };
  return descriptions[unit];
}