import { useState, useEffect, useCallback, useRef } from 'react';
import { Copy, RotateCcw, Thermometer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  convertTemperature, 
  parseSmartInput, 
  validateTemperature,
  getUnitSymbol,
  type TemperatureUnit,
  type ConversionResult 
} from '@/utils/conversion';
import { trackConversion, trackInteraction } from '@/lib/analytics';

const units: { value: TemperatureUnit; label: string }[] = [
  { value: 'C', label: 'Celsius' },
  { value: 'F', label: 'Fahrenheit' },
  { value: 'K', label: 'Kelvin' },
  { value: 'R', label: 'Rankine' },
];

export function TemperatureConverter() {
  const [input, setInput] = useState('');
  const [fromUnit, setFromUnit] = useState<TemperatureUnit>('C');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced conversion
  const performConversion = useCallback((value: string, unit: TemperatureUnit) => {
    if (!value.trim()) {
      setResult(null);
      return;
    }

    // Try smart input parsing first
    const smartParsed = parseSmartInput(value);
    if (smartParsed) {
      const { value: parsedValue, unit: parsedUnit } = smartParsed;
      
      if (!validateTemperature(parsedValue, parsedUnit)) {
        toast({
          title: "Invalid Temperature",
          description: "Temperature is below absolute zero or unreasonably high.",
          variant: "destructive"
        });
        return;
      }

      const conversionResult = convertTemperature(parsedValue, parsedUnit);
      setResult(conversionResult);
      
      // Update unit if smart input detected a different unit
      if (parsedUnit !== unit) {
        setFromUnit(parsedUnit);
        trackInteraction('smart_input_unit_switch', { 
          from: unit, 
          to: parsedUnit,
          value: parsedValue 
        });
      }

      trackConversion({
        fromUnit: parsedUnit,
        toUnit: 'all',
        fromValue: parsedValue,
        toValue: parsedValue,
        method: smartParsed ? 'smart_input' : 'manual'
      });
    } else {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        setResult(null);
        return;
      }

      if (!validateTemperature(numValue, unit)) {
        toast({
          title: "Invalid Temperature",
          description: "Temperature is below absolute zero or unreasonably high.",
          variant: "destructive"
        });
        return;
      }

      const conversionResult = convertTemperature(numValue, unit);
      setResult(conversionResult);

      trackConversion({
        fromUnit: unit,
        toUnit: 'all',
        fromValue: numValue,
        toValue: numValue,
        method: 'manual'
      });
    }
  }, [toast]);

  // Improved debounce with 300ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (input) {
        performConversion(input, fromUnit);
      } else {
        setResult(null);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [input, fromUnit, performConversion]);

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      toast({
        title: "Copied!",
        description: `${value} copied to clipboard`,
      });
      trackInteraction('copy_result', { value });
    });
  };

  const handleClear = () => {
    setInput('');
    setResult(null);
    inputRef.current?.focus();
    trackInteraction('clear_input');
  };

  // Keyboard navigation handlers
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input) {
      performConversion(input, fromUnit);
      trackInteraction('keyboard_convert', { key: 'Enter' });
    } else if (e.key === 'Escape') {
      handleClear();
      trackInteraction('keyboard_clear', { key: 'Escape' });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Main Converter Card - Clean Mobile Design */}
      <Card className="bg-background/95 backdrop-blur-sm border shadow-lg">
        <CardContent className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Thermometer className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold">ConvertTemp - Temperature Converter</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Convert between Celsius, Fahrenheit, Kelvin, and Rankine
            </p>
          </div>

          {/* Input Section */}
          <div className="space-y-4">
            <div className="relative">
              <Input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., 25C, 77F, 298K"
                className="text-2xl h-16 text-center font-bold border-2"
                autoFocus
              />
              {input && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  title="Clear"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            {/* Unit Selector */}
            <select 
              value={fromUnit} 
              onChange={(e) => setFromUnit(e.target.value as TemperatureUnit)}
              className="w-full px-4 py-3 border-2 rounded-lg bg-background text-base font-medium"
            >
              {units.map(unit => (
                <option key={unit.value} value={unit.value}>
                  {unit.label} ({getUnitSymbol(unit.value)})
                </option>
              ))}
            </select>
          </div>

          {/* Instant Results - Dynamic colors based on temperature */}
          {result && (
            <div className="mt-6">
              <Card className={`text-white shadow-xl border-0 ${(() => {
                const celsius = result.celsius;
                if (celsius < -20) return "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800"; // Extremely cold
                if (celsius < 0) return "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600"; // Freezing
                if (celsius < 10) return "bg-gradient-to-br from-cyan-400 via-blue-400 to-blue-500"; // Very cold
                if (celsius < 20) return "bg-gradient-to-br from-green-400 via-cyan-400 to-blue-400"; // Cool
                if (celsius < 30) return "bg-gradient-to-br from-yellow-400 via-green-400 to-green-500"; // Comfortable
                if (celsius < 60) return "bg-gradient-to-br from-orange-400 via-yellow-400 to-orange-500"; // Warm
                if (celsius < 100) return "bg-gradient-to-br from-red-500 via-orange-500 to-red-600"; // Hot
                if (celsius < 150) return "bg-gradient-to-br from-red-600 via-red-700 to-pink-600"; // Very hot
                return "bg-gradient-to-br from-purple-600 via-red-600 to-pink-700"; // Extremely hot
              })()}`}>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Celsius */}
                    <div className="text-center">
                      <div className="text-sm font-medium opacity-90 mb-1">Celsius</div>
                      <div className="text-xl font-bold flex items-center justify-center gap-2">
                        {result.formatted.celsius}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(result.formatted.celsius)}
                          className="h-6 w-6 p-0 hover:bg-white/20 text-white"
                          title={`Copy ${result.formatted.celsius}`}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Fahrenheit */}
                    <div className="text-center">
                      <div className="text-sm font-medium opacity-90 mb-1">Fahrenheit</div>
                      <div className="text-xl font-bold flex items-center justify-center gap-2">
                        {result.formatted.fahrenheit}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(result.formatted.fahrenheit)}
                          className="h-6 w-6 p-0 hover:bg-white/20 text-white"
                          title={`Copy ${result.formatted.fahrenheit}`}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Kelvin */}
                    <div className="text-center">
                      <div className="text-sm font-medium opacity-90 mb-1">Kelvin</div>
                      <div className="text-xl font-bold flex items-center justify-center gap-2">
                        {result.formatted.kelvin}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(result.formatted.kelvin)}
                          className="h-6 w-6 p-0 hover:bg-white/20 text-white"
                          title={`Copy ${result.formatted.kelvin}`}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Rankine */}
                    <div className="text-center">
                      <div className="text-sm font-medium opacity-90 mb-1">Rankine</div>
                      <div className="text-xl font-bold flex items-center justify-center gap-2">
                        {result.formatted.rankine}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(result.formatted.rankine)}
                          className="h-6 w-6 p-0 hover:bg-white/20 text-white"
                          title={`Copy ${result.formatted.rankine}`}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Temperature Description */}
                  <div className="mt-4 text-center border-t border-white/20 pt-4">
                    <div className="flex items-center justify-center gap-2 text-sm font-medium">
                      <Thermometer className="w-4 h-4" />
                      <span>
                        {(() => {
                          const celsius = result.celsius;
                          if (celsius <= 0) return "Freezing point or below";
                          if (celsius <= 10) return "Very cold temperature";
                          if (celsius <= 20) return "Cool temperature";
                          if (celsius <= 25) return "Comfortable room temperature";
                          if (celsius <= 30) return "Warm temperature";
                          if (celsius <= 37) return "Body temperature range";
                          if (celsius <= 60) return "Hot temperature";
                          if (celsius <= 100) return "Very hot - near boiling point";
                          return "Extremely hot temperature";
                        })()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}