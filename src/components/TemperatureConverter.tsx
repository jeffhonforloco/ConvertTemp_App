import { useState, useEffect, useCallback, useRef } from 'react';
import { Copy, RotateCcw, Thermometer, Snowflake, Flame, Settings, Zap, ChevronRight, TrendingUp } from 'lucide-react';
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
      {/* Main Converter Card */}
      <Card className="shadow-card relative overflow-hidden">
        {animationEnabled && isConverting && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full animate-slide-right" />
        )}
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Thermometer className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold">ConvertTemp - Temperature Converter</h2>
            </div>
            <p className="text-muted-foreground">Convert between Celsius, Fahrenheit, Kelvin, and Rankine</p>
          </div>

          <div className="space-y-6">
            {/* Input Section */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1 relative max-w-md">
                <Input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="25"
                  className="text-xl h-14 text-center font-semibold"
                  autoFocus
                />
                {isConverting && animationEnabled && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Zap className="w-4 h-4 text-primary animate-pulse" />
                  </div>
                )}
              </div>
              
              {/* Unit Selector */}
              <select 
                value={fromUnit} 
                onChange={(e) => setFromUnit(e.target.value as TemperatureUnit)}
                className="px-4 py-3 border rounded-lg bg-background text-lg font-medium min-w-[140px]"
              >
                {units.map(unit => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label} ({getUnitSymbol(unit.value)})
                  </option>
                ))}
              </select>
              
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

            {/* Instant Results Section */}
            {result && (
              <Card className="bg-gradient-to-r from-yellow-400 via-green-400 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {units.map((unit) => {
                      const value = result[unit.value.toLowerCase() as keyof ConversionResult] as number;
                      const formatted = result.formatted[unit.value.toLowerCase() as keyof typeof result.formatted];
                      
                      return (
                        <div key={unit.value} className="text-center">
                          <div className="text-sm font-medium opacity-90 mb-1">{unit.label}</div>
                          <div className="text-xl font-bold flex items-center justify-center gap-1">
                            {formatted}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(formatted)}
                              className="h-6 w-6 p-0 hover:bg-white/20 text-white"
                              title={`Copy ${formatted}`}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Temperature Description */}
                  <div className="mt-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm font-medium">
                      <Thermometer className="w-4 h-4" />
                      <span>
                        {(() => {
                          const celsius = result.celsius;
                          if (celsius <= 0) return "Freezing point or below";
                          if (celsius <= 25) return "Comfortable room temperature";
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
            )}

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

          </div>
        </CardContent>
      </Card>

      {/* Feature Highlights */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Thermometer className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Smart Auto-Convert</h3>
            <p className="text-sm text-muted-foreground">
              Type "25C" or "77F" automatic unit detection and instant conversion
            </p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Science Facts</h3>
            <p className="text-sm text-muted-foreground">
              Learn fascinating temperature facts with every conversion
            </p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Thermometer className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">No Sign-up</h3>
            <p className="text-sm text-muted-foreground">
              Free to use, no account required. Just convert and learn!
            </p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Ad-Supported</h3>
            <p className="text-sm text-muted-foreground">
              Free forever, powered by ethical advertising
            </p>
          </CardContent>
        </Card>
      </div>

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