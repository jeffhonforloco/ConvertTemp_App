
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Users, Award, Shield } from 'lucide-react';

export function AboutSection() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 mt-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">About ConvertTemp.com</h2>
        <p className="text-muted-foreground text-lg">
          Your trusted source for accurate temperature conversions since 2024
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              ConvertTemp.com was created to provide the most accurate, fast, and user-friendly 
              temperature conversion tool on the internet. We understand that whether you're a student, 
              professional, or just someone who needs quick temperature conversions, accuracy and 
              ease of use are paramount.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Who We Serve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-muted-foreground">Our tool is designed for:</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Students studying physics, chemistry, and earth sciences</li>
                <li>• Engineers and scientists requiring precise calculations</li>
                <li>• Chefs and bakers working with international recipes</li>
                <li>• Healthcare professionals in international settings</li>
                <li>• Travelers navigating different temperature scales</li>
                <li>• Anyone needing quick, reliable temperature conversions</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              What Makes Us Different
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• <strong>Smart Input Detection:</strong> Type "25C" or "77F" and we'll automatically detect the unit</li>
                <li>• <strong>Real-time Conversion:</strong> See results as you type, no need to click convert</li>
                <li>• <strong>Multiple Scales:</strong> Support for Celsius, Fahrenheit, Kelvin, and Rankine</li>
                <li>• <strong>Mobile Optimized:</strong> Works perfectly on all devices</li>
                <li>• <strong>Offline Capable:</strong> Progressive web app that works without internet</li>
                <li>• <strong>No Registration:</strong> Use our tool completely free without signing up</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Accuracy & Reliability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Our conversion algorithms use the standard formulas recognized by international 
              scientific organizations. We regularly test our calculations against known reference 
              points to ensure accuracy. The tool validates inputs to prevent impossible temperatures 
              (like values below absolute zero) and provides appropriate error messages.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Why Choose ConvertTemp.com?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Free to Use</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">4</div>
              <div className="text-sm text-muted-foreground">Temperature Scales</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">0.1s</div>
              <div className="text-sm text-muted-foreground">Average Response Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          ConvertTemp.com is committed to providing accurate, reliable temperature conversions 
          for educational, professional, and personal use. Our tool is continuously updated 
          to ensure the best user experience and most precise calculations.
        </p>
      </div>
    </div>
  );
}
