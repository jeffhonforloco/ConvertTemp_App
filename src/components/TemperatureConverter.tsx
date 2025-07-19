import { useState, useEffect, useCallback } from 'react';
import { Copy, RotateCcw, Thermometer, Snowflake, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  convertTemperature, 
  parseSmartInput, 
  detectPreferredUnit, 
  validateTemperature,
  formatTemperature,
  getUnitSymbol,
  type TemperatureUnit,
  type ConversionResult 
} from '@/utils/conversion';
import { trackConversion, trackInteraction } from '@/lib/analytics';

const units: { value: TemperatureUnit; label: string; icon: JSX.Element }[] = [
  { value: 'C', label: 'Celsius', icon: <Thermometer className="w-4 h-4" /> },
  { value: 'F', label: 'Fahrenheit', icon: <Flame className="w-4 h-4" /> },
  { value: 'K', label: 'Kelvin', icon: <Snowflake className="w-4 h-4" /> },
  { value: 'R', label: 'Rankine', icon: <Thermometer className="w-4 h-4" /> },
];

export function TemperatureConverter() {
  const [input, setInput] = useState('');
  const [fromUnit, setFromUnit] = useState<TemperatureUnit>('C');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  // Auto-detect preferred unit on mount
  useEffect(() => {
    const preferredUnit = detectPreferredUnit();
    setFromUnit(preferredUnit);
    trackInteraction('preferred_unit_detected', { unit: preferredUnit });
  }, []);

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
        toValue: parsedValue, // Base value
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

  // Debounce input changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (input) {
        setIsConverting(true);
        performConversion(input, fromUnit);
        setTimeout(() => setIsConverting(false), 300);
      }
    }, 500);

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
    trackInteraction('clear_input');
  };

  const getTemperatureColor = (value: number, unit: TemperatureUnit) => {
    // Convert to Celsius for consistent color mapping
    let celsius = value;
    if (unit === 'F') celsius = (value - 32) * 5/9;
    if (unit === 'K') celsius = value - 273.15;
    if (unit === 'R') celsius = (value - 491.67) * 5/9;

    if (celsius <= 0) return 'text-blue-500 dark:text-blue-400';
    if (celsius <= 25) return 'text-green-500 dark:text-green-400';
    if (celsius <= 40) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-red-500 dark:text-red-400';
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Input Section */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Enter temperature (e.g., 100${getUnitSymbol(fromUnit)}, 32F, 273K)`}
                  className="text-lg h-12"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleClear}
                  className="h-12"
                  disabled={!input}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>

            {/* Unit Selection */}
            <div className="flex flex-wrap gap-2">
              {units.map((unit) => (
                <Button
                  key={unit.value}
                  variant={fromUnit === unit.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setFromUnit(unit.value);
                    trackInteraction('unit_changed', { unit: unit.value });
                  }}
                  className="flex items-center gap-2"
                >
                  {unit.icon}
                  {unit.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in ${isConverting ? 'animate-temp-pulse' : ''}`}>
          {units.map((unit) => {
            const value = result[unit.value.toLowerCase() as keyof ConversionResult] as number;
            const formatted = result.formatted[unit.value.toLowerCase() as keyof typeof result.formatted];
            const isInputUnit = unit.value === fromUnit;
            
            return (
              <Card 
                key={unit.value} 
                className={`shadow-card transition-all duration-300 hover:shadow-temp ${
                  isInputUnit ? 'ring-2 ring-primary bg-gradient-temp' : 'hover:scale-105'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {unit.icon}
                      <span className="font-medium text-sm">{unit.label}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(formatted)}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className={`text-2xl font-bold ${getTemperatureColor(value, unit.value)} ${isInputUnit ? 'text-white' : ''}`}>
                    {formatted}
                  </div>
                  {!isInputUnit && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {unit.value === 'K' || unit.value === 'R' ? 'Absolute scale' : 'Relative scale'}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Help Text */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">
            <p className="mb-2"><strong>Smart Input Tips:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Type "100F" or "36C" to auto-detect unit</li>
              <li>All conversions are calculated simultaneously</li>
              <li>Click any result to copy to clipboard</li>
              <li>Temperature range: Absolute zero to 10,000°</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}