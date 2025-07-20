import { useState, useEffect, useCallback, useRef } from 'react';
import { Copy, RotateCcw, Thermometer, Snowflake, Flame, Settings, Zap, ChevronRight } from 'lucide-react';
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
  const [showSettings, setShowSettings] = useState(false);
  const [defaultUnit, setDefaultUnit] = useState<TemperatureUnit>('C');
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Load settings from localStorage and auto-detect preferred unit
  useEffect(() => {
    const savedSettings = localStorage.getItem('converttemp-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setDefaultUnit(settings.defaultUnit || 'C');
      setFromUnit(settings.defaultUnit || 'C');
      setAnimationEnabled(settings.animationEnabled !== false);
    } else {
      const preferredUnit = detectPreferredUnit();
      setFromUnit(preferredUnit);
      setDefaultUnit(preferredUnit);
      trackInteraction('preferred_unit_detected', { unit: preferredUnit });
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = useCallback(() => {
    const settings = {
      defaultUnit,
      animationEnabled,
    };
    localStorage.setItem('converttemp-settings', JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Your preferences have been saved locally.",
    });
  }, [defaultUnit, animationEnabled, toast]);

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

  // Improved debounce with 300ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (input) {
        setIsConverting(true);
        performConversion(input, fromUnit);
        setTimeout(() => setIsConverting(false), animationEnabled ? 300 : 100);
      } else {
        setResult(null);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [input, fromUnit, performConversion, animationEnabled]);

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
    } else if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      setShowSettings(!showSettings);
    }
  };

  // Unit cycling with Tab + Shift
  const cycleUnit = (direction: 'next' | 'prev' = 'next') => {
    const currentIndex = units.findIndex(u => u.value === fromUnit);
    const nextIndex = direction === 'next' 
      ? (currentIndex + 1) % units.length
      : (currentIndex - 1 + units.length) % units.length;
    setFromUnit(units[nextIndex].value);
    trackInteraction('unit_cycled', { direction, unit: units[nextIndex].value });
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
      <Card className="shadow-card relative overflow-hidden">
        {animationEnabled && isConverting && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full animate-slide-right" />
        )}
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Enter temperature (e.g., 100${getUnitSymbol(fromUnit)}, 32F, 273K)`}
                  className="text-lg h-12 pr-10"
                  autoFocus
                />
                {isConverting && animationEnabled && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Zap className="w-4 h-4 text-primary animate-pulse" />
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowSettings(!showSettings)}
                  className="h-12"
                  title="Settings (Ctrl+S)"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleClear}
                  className="h-12"
                  disabled={!input}
                  title="Clear (Esc)"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>

            {/* Settings Panel */}
            {showSettings && (
              <Card className="border-dashed animate-fade-in">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Converter Settings
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Default Unit:</label>
                      <select 
                        value={defaultUnit} 
                        onChange={(e) => setDefaultUnit(e.target.value as TemperatureUnit)}
                        className="border rounded px-2 py-1 text-sm bg-background"
                      >
                        {units.map(unit => (
                          <option key={unit.value} value={unit.value}>
                            {unit.label} ({getUnitSymbol(unit.value)})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Animations:</label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAnimationEnabled(!animationEnabled)}
                        className="h-8"
                      >
                        {animationEnabled ? 'On' : 'Off'}
                      </Button>
                    </div>
                    <Button onClick={saveSettings} size="sm" className="w-full">
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Unit Selection */}
            <div className="flex flex-wrap gap-2">
              {units.map((unit, index) => (
                <Button
                  key={unit.value}
                  variant={fromUnit === unit.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setFromUnit(unit.value);
                    trackInteraction('unit_changed', { unit: unit.value });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowRight') {
                      e.preventDefault();
                      cycleUnit('next');
                    } else if (e.key === 'ArrowLeft') {
                      e.preventDefault();
                      cycleUnit('prev');
                    }
                  }}
                  className={`flex items-center gap-2 transition-all duration-200 ${
                    animationEnabled ? 'hover:scale-105' : ''
                  }`}
                  title={`${unit.label} (Arrow keys to cycle)`}
                >
                  {unit.icon}
                  {unit.label}
                  {fromUnit === unit.value && <ChevronRight className="w-3 h-3 ml-1" />}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <div 
          ref={resultsRef}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${
            animationEnabled ? 'animate-fade-in' : ''
          } ${isConverting && animationEnabled ? 'animate-temp-pulse' : ''}`}
        >
          {units.map((unit, index) => {
            const value = result[unit.value.toLowerCase() as keyof ConversionResult] as number;
            const formatted = result.formatted[unit.value.toLowerCase() as keyof typeof result.formatted];
            const isInputUnit = unit.value === fromUnit;
            
            return (
              <Card 
                key={unit.value} 
                className={`shadow-card transition-all duration-300 hover:shadow-temp ${
                  isInputUnit ? 'ring-2 ring-primary bg-gradient-temp' : ''
                } ${animationEnabled ? 'hover:scale-105' : 'hover:shadow-lg'}`}
                style={animationEnabled ? { 
                  animationDelay: `${index * 50}ms`,
                  animation: result ? 'fade-in 0.3s ease-out forwards' : undefined
                } : undefined}
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
                      className={`h-8 w-8 p-0 ${animationEnabled ? 'hover:scale-110' : ''} transition-transform`}
                      title={`Copy ${formatted}`}
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

      {/* Enhanced Help Text */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground">
            <p className="mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <strong>Smart Features & Shortcuts:</strong>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="list-disc list-inside space-y-1">
                <li>Type "100F" or "36C" to auto-detect unit</li>
                <li>Press <kbd className="bg-muted px-1 rounded">Enter</kbd> to convert</li>
                <li>Press <kbd className="bg-muted px-1 rounded">Esc</kbd> to clear input</li>
                <li>Use <kbd className="bg-muted px-1 rounded">Ctrl+S</kbd> for settings</li>
              </ul>
              <ul className="list-disc list-inside space-y-1">
                <li>Arrow keys cycle through units</li>
                <li>All conversions are calculated simultaneously</li>
                <li>Click any result to copy to clipboard</li>
                <li>Settings are saved to your browser</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}