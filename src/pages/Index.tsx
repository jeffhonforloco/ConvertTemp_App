import { useEffect, useState } from 'react';
import { Thermometer, Github, Heart, Settings } from 'lucide-react';
import { EnhancedTemperatureConverter } from '@/components/EnhancedTemperatureConverter';
import { SEOHead } from '@/components/SEOHead';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AdSlot } from '@/components/AdSlot';
import { BannerAd, RemoveAdsButton } from '@/components/AdSenseAd';
import { AdminDashboard } from '@/components/AdminDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { trackPageView } from '@/lib/analytics';
import { ConvertTempLogo } from '@/components/ConvertTempLogo';

const Index = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    trackPageView('homepage');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      <SEOHead />
      
      {/* Header */}
      <header className="w-full px-4 py-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <ConvertTempLogo className="h-16 w-auto md:h-20 transition-all duration-300" />
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdmin(!showAdmin)}
                className="gap-2"
              >
                <Settings className="w-4 h-4" />
                Admin
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - Centered */}
      <main className="flex-1 flex flex-col items-center justify-center container mx-auto px-4 py-8">
        {!showAdmin ? (
          <div className="w-full max-w-md space-y-8">
            {/* Top Banner Ad */}
            <BannerAd className="mb-4" />
            
            {/* Remove Ads Button */}
            <RemoveAdsButton />

            {/* Converter Component */}
            <EnhancedTemperatureConverter />

            {/* In-content Ad */}
            <AdSlot slotType="in_content" className="mt-4" />
          </div>
        ) : (
          <div className="w-full max-w-6xl space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <Button variant="outline" onClick={() => setShowAdmin(false)}>
                Back to Converter
              </Button>
            </div>
            <AdminDashboard />
          </div>
        )}

        {!showAdmin && (
          <>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <div className="text-center p-6 animate-fade-in">
                <div className="w-12 h-12 bg-gradient-cold rounded-full flex items-center justify-center mx-auto mb-4 hover-scale animate-pulse">
                  <Thermometer className="w-6 h-6 text-white animate-[pulse_2s_ease-in-out_infinite]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Smart Input Detection</h3>
                <p className="text-muted-foreground text-sm">
                  Type "100F", "36C", "273K" and we'll auto-detect the unit
                </p>
              </div>
              
              <div className="text-center p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="w-12 h-12 bg-gradient-temp rounded-full flex items-center justify-center mx-auto mb-4 hover-scale">
                  <Heart className="w-6 h-6 text-white animate-[pulse_3s_ease-in-out_infinite]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">All Temperature Units</h3>
                <p className="text-muted-foreground text-sm">
                  Celsius, Fahrenheit, Kelvin, and Rankine - complete coverage
                </p>
              </div>
              
              <div className="text-center p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="w-12 h-12 bg-gradient-hot rounded-full flex items-center justify-center mx-auto mb-4 hover-scale animate-pulse">
                  <Github className="w-6 h-6 text-white animate-[pulse_2.5s_ease-in-out_infinite]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground text-sm">
                  Instant conversions with one-click copy-to-clipboard
                </p>
              </div>

              <div className="text-center p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="w-12 h-12 bg-gradient-temp rounded-full flex items-center justify-center mx-auto mb-4 hover-scale">
                  <Thermometer className="w-6 h-6 text-white animate-[pulse_1.8s_ease-in-out_infinite]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Mobile Optimized</h3>
                <p className="text-muted-foreground text-sm">
                  Perfect on phones, tablets, and desktops. Works offline too!
                </p>
              </div>
            </div>

            {/* SEO Content Section */}
            <div className="mt-16 max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">The Ultimate Temperature Conversion Tool</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Why Choose ConvertTemp?</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• 100% free temperature converter - no hidden costs</li>
                    <li>• No registration or sign-up required</li>
                    <li>• Supports Celsius (°C), Fahrenheit (°F), Kelvin (K), and Rankine (°R)</li>
                    <li>• Smart input parsing - just type and convert</li>
                    <li>• Works perfectly on mobile devices and tablets</li>
                    <li>• Instant results with copy-to-clipboard feature</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Common Temperature Conversions</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• 0°C = 32°F (Water freezing point)</li>
                    <li>• 100°C = 212°F (Water boiling point)</li>
                    <li>• 37°C = 98.6°F (Human body temperature)</li>
                    <li>• -40°C = -40°F (Same temperature!)</li>
                    <li>• 273.15K = 0°C (Absolute zero in Celsius)</li>
                    <li>• 0K = -273.15°C (Absolute zero)</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Bottom Banner Ad */}
      {!showAdmin && <BannerAd className="mt-16" />}

      {/* Footer */}
      {!showAdmin && (
        <footer className="border-t mt-8">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-sm text-muted-foreground">
              <p className="mb-4">
                <strong>ConvertTemp.com</strong> - The world's most accurate and fastest temperature converter
              </p>
              <p className="mb-2">
                Free online temperature conversion tool for Celsius, Fahrenheit, Kelvin, and Rankine
              </p>
              <p className="mb-4">
                Perfect for students, engineers, scientists, and anyone who needs quick temperature conversions
              </p>
              <p>
                © {new Date().getFullYear()} ConvertTemp.com • Free Temperature Converter • No Registration Required
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Index;