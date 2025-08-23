
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer, Calculator, Globe, BookOpen } from 'lucide-react';

export function TemperatureGuide() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 mt-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Complete Temperature Conversion Guide</h2>
        <p className="text-muted-foreground text-lg">
          Everything you need to know about temperature scales and conversions
        </p>
      </div>

      {/* Temperature Scales Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="w-5 h-5" />
            Understanding Temperature Scales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-primary">Celsius (°C)</h3>
              <p className="text-muted-foreground">
                The Celsius scale, also known as centigrade, is the most widely used temperature scale worldwide. 
                It was developed by Anders Celsius in 1742 and is based on the freezing and boiling points of water.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Water freezes at 0°C</li>
                <li>• Water boils at 100°C (at standard atmospheric pressure)</li>
                <li>• Used in science, weather reporting, and daily life globally</li>
                <li>• Part of the International System of Units (SI)</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-primary">Fahrenheit (°F)</h3>
              <p className="text-muted-foreground">
                The Fahrenheit scale was proposed by German physicist Daniel Gabriel Fahrenheit in 1724. 
                It's primarily used in the United States and a few other countries.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Water freezes at 32°F</li>
                <li>• Water boils at 212°F (at standard atmospheric pressure)</li>
                <li>• Commonly used in weather forecasts in the US</li>
                <li>• Provides more precise readings for everyday temperatures</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-primary">Kelvin (K)</h3>
              <p className="text-muted-foreground">
                The Kelvin scale is an absolute temperature scale used primarily in scientific contexts. 
                It was developed by Lord Kelvin and starts at absolute zero.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Absolute zero is 0 K (-273.15°C)</li>
                <li>• No negative temperatures exist</li>
                <li>• Standard unit for thermodynamic temperature</li>
                <li>• Essential in physics and chemistry calculations</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-primary">Rankine (°R)</h3>
              <p className="text-muted-foreground">
                The Rankine scale is an absolute temperature scale based on Fahrenheit degrees. 
                It's used primarily in engineering applications in the United States.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Absolute zero is 0°R (-459.67°F)</li>
                <li>• Uses Fahrenheit-sized degrees</li>
                <li>• Common in thermodynamics and engineering</li>
                <li>• Named after Scottish engineer William Rankine</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Formulas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Temperature Conversion Formulas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-3">From Celsius</h4>
                <div className="space-y-3 text-sm bg-muted p-4 rounded-lg">
                  <p><strong>°F = (°C × 9/5) + 32</strong></p>
                  <p><strong>K = °C + 273.15</strong></p>
                  <p><strong>°R = (°C × 9/5) + 491.67</strong></p>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-3">From Fahrenheit</h4>
                <div className="space-y-3 text-sm bg-muted p-4 rounded-lg">
                  <p><strong>°C = (°F - 32) × 5/9</strong></p>
                  <p><strong>K = (°F - 32) × 5/9 + 273.15</strong></p>
                  <p><strong>°R = °F + 459.67</strong></p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-3">From Kelvin</h4>
                <div className="space-y-3 text-sm bg-muted p-4 rounded-lg">
                  <p><strong>°C = K - 273.15</strong></p>
                  <p><strong>°F = (K - 273.15) × 9/5 + 32</strong></p>
                  <p><strong>°R = K × 9/5</strong></p>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-3">From Rankine</h4>
                <div className="space-y-3 text-sm bg-muted p-4 rounded-lg">
                  <p><strong>°C = (°R - 491.67) × 5/9</strong></p>
                  <p><strong>°F = °R - 459.67</strong></p>
                  <p><strong>K = °R × 5/9</strong></p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Practical Applications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Real-World Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="text-lg font-semibold">Weather & Climate</h4>
              <p className="text-sm text-muted-foreground">
                Weather forecasts use different scales globally. Understanding conversions helps when traveling 
                or reading international weather reports.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-lg font-semibold">Cooking & Baking</h4>
              <p className="text-sm text-muted-foreground">
                Recipe temperatures vary by region. Converting between Celsius and Fahrenheit ensures 
                perfect cooking results regardless of your oven's settings.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-lg font-semibold">Scientific Research</h4>
              <p className="text-sm text-muted-foreground">
                Laboratory work often requires precise temperature control and conversion between 
                different scales for accurate measurements and calculations.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-lg font-semibold">Engineering</h4>
              <p className="text-sm text-muted-foreground">
                Industrial processes, HVAC systems, and material testing require accurate temperature 
                conversions for safety and efficiency.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-lg font-semibold">Healthcare</h4>
              <p className="text-sm text-muted-foreground">
                Medical professionals need to convert body temperatures between scales for 
                accurate diagnosis and treatment in international settings.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-lg font-semibold">Education</h4>
              <p className="text-sm text-muted-foreground">
                Students learning physics, chemistry, and earth sciences need to master temperature 
                conversions for problem-solving and experiments.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Common Temperature References */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Temperature Reference Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Reference Point</th>
                    <th className="text-center py-2">Celsius</th>
                    <th className="text-center py-2">Fahrenheit</th>
                    <th className="text-center py-2">Kelvin</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  <tr className="border-b border-muted">
                    <td className="py-2">Absolute Zero</td>
                    <td className="text-center">-273.15°C</td>
                    <td className="text-center">-459.67°F</td>
                    <td className="text-center">0 K</td>
                  </tr>
                  <tr className="border-b border-muted">
                    <td className="py-2">Dry Ice Sublimation</td>
                    <td className="text-center">-78.5°C</td>
                    <td className="text-center">-109.3°F</td>
                    <td className="text-center">194.7 K</td>
                  </tr>
                  <tr className="border-b border-muted">
                    <td className="py-2">Water Freezes</td>
                    <td className="text-center">0°C</td>
                    <td className="text-center">32°F</td>
                    <td className="text-center">273.15 K</td>
                  </tr>
                  <tr className="border-b border-muted">
                    <td className="py-2">Room Temperature</td>
                    <td className="text-center">20°C</td>
                    <td className="text-center">68°F</td>
                    <td className="text-center">293.15 K</td>
                  </tr>
                  <tr className="border-b border-muted">
                    <td className="py-2">Human Body Temperature</td>
                    <td className="text-center">37°C</td>
                    <td className="text-center">98.6°F</td>
                    <td className="text-center">310.15 K</td>
                  </tr>
                  <tr className="border-b border-muted">
                    <td className="py-2">Water Boils</td>
                    <td className="text-center">100°C</td>
                    <td className="text-center">212°F</td>
                    <td className="text-center">373.15 K</td>
                  </tr>
                  <tr className="border-b border-muted">
                    <td className="py-2">Oven Temperature (Medium)</td>
                    <td className="text-center">180°C</td>
                    <td className="text-center">356°F</td>
                    <td className="text-center">453.15 K</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
