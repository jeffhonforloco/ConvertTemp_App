import { useEffect } from 'react';
import { Thermometer, Github, Heart, Zap, Star, Clock, Globe } from 'lucide-react';
import { EnhancedTemperatureConverter } from '@/components/EnhancedTemperatureConverter';
import { SEOHead } from '@/components/SEOHead';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AdSlot } from '@/components/AdSlot';
import { BannerAd } from '@/components/AdSenseAd';
import { trackPageView } from '@/lib/analytics';
import { ConvertTempLogo } from '@/components/ConvertTempLogo';

const Index = () => {
  useEffect(() => {
    trackPageView('homepage');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <SEOHead />
      
      {/* Header */}
      <header className="w-full px-4 py-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <ConvertTempLogo className="h-16 w-auto md:h-20 transition-all duration-300" />
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content - Mobile Optimized */}
      <main className="container mx-auto px-4 pt-2 pb-4 md:pt-8 md:pb-8">
        <div className="w-full max-w-md mx-auto space-y-4 md:space-y-8">
          {/* Top Banner Ad */}
          <BannerAd className="mb-2 md:mb-4" />

          {/* Converter Component */}
          <EnhancedTemperatureConverter />

          {/* In-content Ad */}
          <AdSlot slotType="in_content" className="mt-2 md:mt-4" />
        </div>

        {/* AI-Optimized FAQ Section for AI Overviews - Hidden on Mobile */}
        <div className="hidden md:block mt-16 max-w-4xl mx-auto space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Temperature Conversion Questions & Answers</h2>
            <p className="text-muted-foreground">Everything you need to know about converting temperatures</p>
          </div>

          {/* FAQ Grid - Optimized for AI Overviews */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-background/50 backdrop-blur-sm rounded-lg p-6 border">
                <h3 className="text-lg font-semibold mb-3 text-primary">How do you convert Celsius to Fahrenheit?</h3>
                <p className="text-muted-foreground mb-3">
                  To convert Celsius to Fahrenheit: <strong>°F = (°C × 9/5) + 32</strong>
                </p>
                <div className="text-sm space-y-1">
                  <p>• Example: 25°C = (25 × 9/5) + 32 = 77°F</p>
                  <p>• Quick method: Multiply by 2, subtract 10%, add 32</p>
                </div>
              </div>

              <div className="bg-background/50 backdrop-blur-sm rounded-lg p-6 border">
                <h3 className="text-lg font-semibold mb-3 text-primary">How do you convert Fahrenheit to Celsius?</h3>
                <p className="text-muted-foreground mb-3">
                  To convert Fahrenheit to Celsius: <strong>°C = (°F - 32) × 5/9</strong>
                </p>
                <div className="text-sm space-y-1">
                  <p>• Example: 77°F = (77 - 32) × 5/9 = 25°C</p>
                  <p>• Quick method: Subtract 32, then multiply by 0.56</p>
                </div>
              </div>

              <div className="bg-background/50 backdrop-blur-sm rounded-lg p-6 border">
                <h3 className="text-lg font-semibold mb-3 text-primary">What is the formula for Kelvin conversion?</h3>
                <p className="text-muted-foreground mb-3">
                  Kelvin conversions are simple additions/subtractions:
                </p>
                <div className="text-sm space-y-1">
                  <p>• <strong>K = °C + 273.15</strong> (Celsius to Kelvin)</p>
                  <p>• <strong>°C = K - 273.15</strong> (Kelvin to Celsius)</p>
                  <p>• Absolute zero: 0K = -273.15°C = -459.67°F</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-background/50 backdrop-blur-sm rounded-lg p-6 border">
                <h3 className="text-lg font-semibold mb-3 text-primary">What are common temperature reference points?</h3>
                <div className="text-sm space-y-2">
                  <div className="grid grid-cols-3 gap-2 font-medium">
                    <span>Reference Point</span>
                    <span>Celsius</span>
                    <span>Fahrenheit</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-muted-foreground">
                    <span>Water freezes</span>
                    <span>0°C</span>
                    <span>32°F</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-muted-foreground">
                    <span>Room temperature</span>
                    <span>20°C</span>
                    <span>68°F</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-muted-foreground">
                    <span>Body temperature</span>
                    <span>37°C</span>
                    <span>98.6°F</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-muted-foreground">
                    <span>Water boils</span>
                    <span>100°C</span>
                    <span>212°F</span>
                  </div>
                </div>
              </div>

              <div className="bg-background/50 backdrop-blur-sm rounded-lg p-6 border">
                <h3 className="text-lg font-semibold mb-3 text-primary">What temperature scales exist?</h3>
                <div className="text-sm space-y-2">
                  <p><strong>Celsius (°C):</strong> Most common worldwide, water freezes at 0°, boils at 100°</p>
                  <p><strong>Fahrenheit (°F):</strong> Used in US, water freezes at 32°, boils at 212°</p>
                  <p><strong>Kelvin (K):</strong> Scientific absolute scale, starts at absolute zero</p>
                  <p><strong>Rankine (°R):</strong> Absolute Fahrenheit scale, used in engineering</p>
                </div>
              </div>

              <div className="bg-background/50 backdrop-blur-sm rounded-lg p-6 border">
                <h3 className="text-lg font-semibold mb-3 text-primary">Why is -40°C equal to -40°F?</h3>
                <p className="text-muted-foreground mb-2">
                  -40° is the only temperature where Celsius and Fahrenheit are equal.
                </p>
                <div className="text-sm">
                  <p>Mathematical proof: -40°F = (-40 - 32) × 5/9 = -40°C</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights - Hidden on Mobile */}
        <div className="hidden md:block mt-16 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="text-center p-6 animate-fade-in">
            <div className="w-12 h-12 bg-gradient-cold rounded-full flex items-center justify-center mx-auto mb-4 hover-scale animate-pulse">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Instant Results</h3>
            <p className="text-muted-foreground text-sm">
              Real-time conversion as you type. No waiting, no loading.
            </p>
          </div>
          
          <div className="text-center p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="w-12 h-12 bg-gradient-temp rounded-full flex items-center justify-center mx-auto mb-4 hover-scale">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">100% Free</h3>
            <p className="text-muted-foreground text-sm">
              No sign-up required. Completely free temperature converter.
            </p>
          </div>
          
          <div className="text-center p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="w-12 h-12 bg-gradient-hot rounded-full flex items-center justify-center mx-auto mb-4 hover-scale animate-pulse">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Works Offline</h3>
            <p className="text-muted-foreground text-sm">
              Progressive web app that works even without internet.
            </p>
          </div>

          <div className="text-center p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="w-12 h-12 bg-gradient-temp rounded-full flex items-center justify-center mx-auto mb-4 hover-scale">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Input</h3>
            <p className="text-muted-foreground text-sm">
              Type "100F" or "36C" and we'll auto-detect the units.
            </p>
          </div>
        </div>

        {/* AI-Optimized How-To Section - Hidden on Mobile */}
        <div className="hidden md:block mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">How to Use the Temperature Converter</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-background/30 rounded-lg border">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">1</div>
              <h3 className="font-semibold mb-2">Enter Temperature</h3>
              <p className="text-sm text-muted-foreground">Type any temperature value with or without units (e.g., "25" or "25C")</p>
            </div>
            <div className="text-center p-6 bg-background/30 rounded-lg border">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">2</div>
              <h3 className="font-semibold mb-2">Select Unit</h3>
              <p className="text-sm text-muted-foreground">Choose input unit from dropdown or let smart detection handle it</p>
            </div>
            <div className="text-center p-6 bg-background/30 rounded-lg border">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">3</div>
              <h3 className="font-semibold mb-2">View Results</h3>
              <p className="text-sm text-muted-foreground">Instantly see conversions to all temperature scales</p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Banner Ad */}
      <BannerAd className="mt-16" />

      {/* AI-Optimized Footer with Schema */}
      <footer className="border-t mt-8">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">ConvertTemp.com - Free Temperature Converter</h3>
              <p className="mb-2">
                The most accurate online temperature conversion tool supporting Celsius, Fahrenheit, Kelvin, Rankine, Réaumur, Delisle, Newton, and Rømer scales.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div>
                <h4 className="font-medium text-foreground">For Students</h4>
                <p className="text-xs">Perfect for homework, lab work, and science projects</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground">For Engineers</h4>
                <p className="text-xs">Precise conversions for technical calculations</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground">For Everyone</h4>
                <p className="text-xs">Cooking, weather, travel, and daily use</p>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p>© {new Date().getFullYear()} ConvertTemp.com • Free Temperature Converter • No Registration Required</p>
              <p className="text-xs mt-1">Temperature conversion formulas, calculator, and reference guide</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;