import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Thermometer, Github, Heart, LogIn, Shield, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TemperatureConverter } from '@/components/TemperatureConverter';
import { SEOHead } from '@/components/SEOHead';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { trackPageView } from '@/lib/analytics';
import heroImage from '@/assets/hero-image.jpg';

const Index = () => {
  const { user, profile, isAdmin, signOut } = useAuth();

  useEffect(() => {
    trackPageView('homepage');
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <SEOHead />
      
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Thermometer className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-temp bg-clip-text text-transparent">
              ConvertTemp
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-background/10 backdrop-blur-sm rounded-full border border-white/20">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{profile?.full_name || profile?.email}</span>
                  {isAdmin && <Shield className="w-4 h-4 text-primary" />}
                </div>
                {isAdmin && (
                  <Button asChild variant="outline" size="sm">
                    <Link to="/admin">
                      <Shield className="w-4 h-4 mr-2" />
                      Admin
                    </Link>
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button asChild variant="outline" size="sm">
                <Link to="/auth">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 pb-8">
        <div className="text-center mb-8">
          <div className="max-w-4xl mx-auto mb-6">
            <img 
              src={heroImage} 
              alt="Temperature conversion illustration" 
              className="w-full h-48 md:h-64 object-cover rounded-2xl shadow-card"
            />
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Convert Temperatures
            <span className="block text-3xl md:text-4xl bg-gradient-temp bg-clip-text text-transparent">
              Instantly & Accurately
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-2 max-w-3xl mx-auto">
            Convert between <strong>Celsius, Fahrenheit, Kelvin, and Rankine</strong> with smart input detection
          </p>
          
          <p className="text-sm text-muted-foreground mb-8">
            Fast • Accurate • Mobile-Optimized • Free
          </p>
        </div>

        {/* Converter Component */}
        <TemperatureConverter />

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-gradient-cold rounded-full flex items-center justify-center mx-auto mb-4">
              <Thermometer className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Input</h3>
            <p className="text-muted-foreground text-sm">
              Type "100F" or "36C" and we'll auto-detect the unit
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-gradient-temp rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">All Units</h3>
            <p className="text-muted-foreground text-sm">
              Celsius, Fahrenheit, Kelvin, and Rankine conversions
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-gradient-hot rounded-full flex items-center justify-center mx-auto mb-4">
              <Github className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
            <p className="text-muted-foreground text-sm">
              Instant conversions with copy-to-clipboard functionality
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">
              Built for speed, accuracy & simplicity
            </p>
            <p>
              © {new Date().getFullYear()} ConvertTemp • Made with ❤️ for temperature conversions
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;