import { useState, useEffect, useCallback, useRef } from 'react';
import { Copy, RotateCcw, Thermometer, Settings, Info, History, ChevronDown, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { 
  convertTemperature, 
  parseSmartInput, 
  validateTemperature,
  getUnitSymbol,
  getConversionFormula,
  getUnitDescription,
  type TemperatureUnit,
  type ConversionResult 
} from '@/utils/conversion';
import { trackConversion, trackInteraction } from '@/lib/analytics';

const basicUnits: { value: TemperatureUnit; label: string }[] = [
  { value: 'C', label: 'Celsius' },
  { value: 'F', label: 'Fahrenheit' },
  { value: 'K', label: 'Kelvin' },
  { value: 'R', label: 'Rankine' },
];

const advancedUnits: { value: TemperatureUnit; label: string }[] = [
  { value: 'Re', label: 'Réaumur' },
  { value: 'De', label: 'Delisle' },
  { value: 'N', label: 'Newton' },
  { value: 'Ro', label: 'Rømer' },
];

interface ConversionHistory {
  id: string;
  input: string;
  fromUnit: TemperatureUnit;
  result: ConversionResult;
  timestamp: number;
}

export function EnhancedTemperatureConverter() {
  const [input, setInput] = useState('');
  const [fromUnit, setFromUnit] = useState<TemperatureUnit>('C');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [userChangedUnit, setUserChangedUnit] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [history, setHistory] = useState<ConversionHistory[]>([]);
  const [conversionStats, setConversionStats] = useState({ count: 0, lastFrom: '', lastTo: '' });
  const [defaultUnit, setDefaultUnit] = useState<TemperatureUnit>('C');
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  // Load settings from localStorage
  useEffect(() => {
    const savedAdvanced = localStorage.getItem('converttemp-advanced-units');
    const savedHistory = localStorage.getItem('converttemp-show-history');
    const savedHistoryData = localStorage.getItem('converttemp-history');
    const savedDefaultUnit = localStorage.getItem('converttemp-default-unit');
    const savedStats = localStorage.getItem('converttemp-session-stats');
    
    if (savedAdvanced) setShowAdvanced(JSON.parse(savedAdvanced));
    if (savedHistory) setShowHistory(JSON.parse(savedHistory));
    if (savedDefaultUnit) {
      setDefaultUnit(savedDefaultUnit as TemperatureUnit);
      setFromUnit(savedDefaultUnit as TemperatureUnit);
    }
    if (savedStats) {
      try {
        setConversionStats(JSON.parse(savedStats));
      } catch (e) {
        console.error('Failed to parse stats data:', e);
      }
    }
    if (savedHistoryData) {
      try {
        setHistory(JSON.parse(savedHistoryData));
      } catch (e) {
        console.error('Failed to parse history data:', e);
      }
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('converttemp-advanced-units', JSON.stringify(showAdvanced));
  }, [showAdvanced]);

  useEffect(() => {
    localStorage.setItem('converttemp-show-history', JSON.stringify(showHistory));
  }, [showHistory]);

  useEffect(() => {
    localStorage.setItem('converttemp-history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('converttemp-default-unit', defaultUnit);
  }, [defaultUnit]);

  useEffect(() => {
    localStorage.setItem('converttemp-session-stats', JSON.stringify(conversionStats));
  }, [conversionStats]);

  const availableUnits = showAdvanced ? [...basicUnits, ...advancedUnits] : basicUnits;

  // Add to history
  const addToHistory = useCallback((input: string, fromUnit: TemperatureUnit, result: ConversionResult) => {
    const newEntry: ConversionHistory = {
      id: Date.now().toString(),
      input,
      fromUnit,
      result,
      timestamp: Date.now()
    };
    
    setHistory(prev => [newEntry, ...prev.slice(0, 9)]); // Keep last 10 entries
  }, []);

  // Debounced conversion
  const performConversion = useCallback((value: string, unit: TemperatureUnit) => {
    if (!value.trim()) {
      setResult(null);
      return;
    }

    // Try smart input parsing first, but only if user hasn't manually changed unit
    const smartParsed = parseSmartInput(value);
    if (smartParsed && !userChangedUnit) {
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
      addToHistory(value, parsedUnit, conversionResult);
      
      // Update conversion stats
      setConversionStats(prev => ({
        count: prev.count + 1,
        lastFrom: getUnitSymbol(parsedUnit),
        lastTo: 'all scales'
      }));
      
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
        method: 'smart_input'
      });
    } else {
      // Use the manually selected unit or parse as number
      const numValue = smartParsed ? smartParsed.value : parseFloat(value);
      const selectedUnit = userChangedUnit ? unit : (smartParsed ? smartParsed.unit : unit);
      
      if (isNaN(numValue)) {
        setResult(null);
        return;
      }

      if (!validateTemperature(numValue, selectedUnit)) {
        toast({
          title: "Invalid Temperature",
          description: "Temperature is below absolute zero or unreasonably high.",
          variant: "destructive"
        });
        return;
      }

      const conversionResult = convertTemperature(numValue, selectedUnit);
      setResult(conversionResult);
      addToHistory(value, selectedUnit, conversionResult);

      // Update conversion stats
      setConversionStats(prev => ({
        count: prev.count + 1,
        lastFrom: getUnitSymbol(selectedUnit),
        lastTo: 'all scales'
      }));

      trackConversion({
        fromUnit: selectedUnit,
        toUnit: 'all',
        fromValue: numValue,
        toValue: numValue,
        method: userChangedUnit ? 'manual' : 'smart_input'
      });
    }
  }, [toast, userChangedUnit, addToHistory]);

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

  const handleUnitChange = (newUnit: TemperatureUnit) => {
    setFromUnit(newUnit);
    setUserChangedUnit(true);
    // Reset the flag after a short delay to allow smart input to work again
    setTimeout(() => setUserChangedUnit(false), 1000);
  };

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
    setUserChangedUnit(false);
    inputRef.current?.focus();
    trackInteraction('clear_input');
  };

  const loadFromHistory = (historyItem: ConversionHistory) => {
    setInput(historyItem.input);
    setFromUnit(historyItem.fromUnit);
    setResult(historyItem.result);
    trackInteraction('load_from_history');
  };

  const clearHistory = () => {
    setHistory([]);
    toast({
      title: "History Cleared",
      description: "Conversion history has been cleared",
    });
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

  const renderResultGrid = () => {
    if (!result) return null;

    const unitsToShow = showAdvanced ? 
      ['celsius', 'fahrenheit', 'kelvin', 'rankine', 'reaumur', 'delisle', 'newton', 'romer'] :
      ['celsius', 'fahrenheit', 'kelvin', 'rankine'];

    return (
      <div className={`grid gap-4 ${showAdvanced ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2'}`}>
        {unitsToShow.map((unit) => {
          const unitKey = unit as keyof typeof result.formatted;
          const unitAbbr = unit === 'celsius' ? 'C' : 
                          unit === 'fahrenheit' ? 'F' :
                          unit === 'kelvin' ? 'K' :
                          unit === 'rankine' ? 'R' :
                          unit === 'reaumur' ? 'Re' :
                          unit === 'delisle' ? 'De' :
                          unit === 'newton' ? 'N' : 'Ro';
          
          return (
            <div key={unit} className="text-center">
              <div className="text-sm font-medium opacity-90 mb-1 capitalize">
                {unit === 'reaumur' ? 'Réaumur' : 
                 unit === 'romer' ? 'Rømer' : unit}
              </div>
              <div className="text-lg font-bold flex items-center justify-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 cursor-help">
                        <span>{result.formatted[unitKey]}</span>
                        <HelpCircle className="w-3 h-3 opacity-60" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-sm">
                        <strong>Formula:</strong><br />
                        {getConversionFormula(fromUnit, unitAbbr as TemperatureUnit)}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(result.formatted[unitKey])}
                  className="h-6 w-6 p-0 hover:bg-white/20 text-white"
                  title={`Copy ${result.formatted[unitKey]}`}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Settings Panel */}
      <Collapsible open={showSettings} onOpenChange={setShowSettings}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
            <ChevronDown className={`w-4 h-4 transition-transform ${showSettings ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="default-unit">Default Unit</Label>
                  <p className="text-sm text-muted-foreground">
                    Set your preferred starting unit
                  </p>
                </div>
                <select 
                  value={defaultUnit} 
                  onChange={(e) => {
                    const newUnit = e.target.value as TemperatureUnit;
                    setDefaultUnit(newUnit);
                    setFromUnit(newUnit);
                  }}
                  className="px-3 py-2 border rounded-md bg-background text-sm"
                >
                  {availableUnits.map(unit => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="advanced-units">Advanced Units</Label>
                  <p className="text-sm text-muted-foreground">
                    Show Réaumur, Delisle, Newton, and Rømer scales
                  </p>
                </div>
                <Switch
                  id="advanced-units"
                  checked={showAdvanced}
                  onCheckedChange={setShowAdvanced}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="show-history">Conversion History</Label>
                  <p className="text-sm text-muted-foreground">
                    Keep track of recent conversions
                  </p>
                </div>
                <Switch
                  id="show-history"
                  checked={showHistory}
                  onCheckedChange={setShowHistory}
                />
              </div>
              
              {/* Session Stats */}
              {conversionStats.count > 0 && (
                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground mb-2">Session Stats</div>
                  <div className="text-sm">
                    You've converted <strong>{conversionStats.count}</strong> temperature{conversionStats.count !== 1 ? 's' : ''} this session
                    {conversionStats.lastFrom && (
                      <span className="block text-xs text-muted-foreground mt-1">
                        Last: {conversionStats.lastFrom} → {conversionStats.lastTo}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Main Converter Card */}
      <Card className="bg-background/95 backdrop-blur-sm border shadow-lg">
        <CardContent className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Thermometer className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold">Temperature Converter</h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <HelpCircle className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-sm">
                      Enter temperature values with units (e.g., "25C", "77F", "298K") 
                      or use the dropdown to select units manually.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-sm text-muted-foreground">
              Convert between {showAdvanced ? '8 different' : '4 common'} temperature scales
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
                placeholder={showAdvanced ? "e.g., 25C, 77F, 298K, 80Re, 150De" : "e.g., 25C, 77F, 298K"}
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
            <div className="space-y-2">
              <select 
                value={fromUnit} 
                onChange={(e) => handleUnitChange(e.target.value as TemperatureUnit)}
                className="w-full px-4 py-3 border-2 rounded-lg bg-background text-base font-medium"
              >
                {availableUnits.map(unit => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label} ({getUnitSymbol(unit.value)})
                  </option>
                ))}
              </select>
              
              {/* Unit Description */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded cursor-help">
                      <Info className="w-3 h-3 inline mr-1" />
                      {getUnitDescription(fromUnit)}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-sm">Click to learn more about this temperature scale</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Instant Results */}
          {result && (
            <div className="mt-6">
              <Card className={`text-white shadow-xl border-0 ${(() => {
                const celsius = result.celsius;
                if (celsius < -20) return "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800";
                if (celsius < 0) return "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600";
                if (celsius < 10) return "bg-gradient-to-br from-cyan-400 via-blue-400 to-blue-500";
                if (celsius < 20) return "bg-gradient-to-br from-green-400 via-cyan-400 to-blue-400";
                if (celsius < 30) return "bg-gradient-to-br from-yellow-400 via-green-400 to-green-500";
                if (celsius < 60) return "bg-gradient-to-br from-orange-400 via-yellow-400 to-orange-500";
                if (celsius < 100) return "bg-gradient-to-br from-red-500 via-orange-500 to-red-600";
                if (celsius < 150) return "bg-gradient-to-br from-red-600 via-red-700 to-pink-600";
                return "bg-gradient-to-br from-purple-600 via-red-600 to-pink-700";
              })()}`}>
                <CardContent className="p-6">
                  {renderResultGrid()}
                  
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

      {/* History Panel */}
      {showHistory && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="w-5 h-5" />
                Recent Conversions
              </CardTitle>
              {history.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearHistory}>
                  Clear
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No conversions yet. Start converting to see your history!
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => loadFromHistory(item)}
                  >
                    <div className="flex-1">
                      <div className="font-medium">
                        {item.input} ({getUnitSymbol(item.fromUnit)})
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="text-sm font-mono bg-primary/10 px-2 py-1 rounded">
                      {item.result.formatted.celsius}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}