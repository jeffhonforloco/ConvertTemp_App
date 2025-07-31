import { Helmet } from 'react-helmet-async';

export const SEOHead = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "ConvertTemp - Free Temperature Converter",
    "description": "Free online temperature converter supporting Celsius, Fahrenheit, Kelvin, Rankine, and more. Instant conversions with formulas and explanations.",
    "url": "https://converttemp.com",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Convert Celsius to Fahrenheit",
      "Convert Fahrenheit to Celsius", 
      "Kelvin temperature conversion",
      "Rankine temperature conversion",
      "Smart unit detection",
      "Instant results",
      "Mobile friendly",
      "Works offline"
    ],
    "creator": {
      "@type": "Organization",
      "name": "ConvertTemp"
    }
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do you convert Celsius to Fahrenheit?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To convert Celsius to Fahrenheit, use the formula: °F = (°C × 9/5) + 32. For example, 25°C = (25 × 9/5) + 32 = 77°F"
        }
      },
      {
        "@type": "Question", 
        "name": "How do you convert Fahrenheit to Celsius?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To convert Fahrenheit to Celsius, use the formula: °C = (°F - 32) × 5/9. For example, 77°F = (77 - 32) × 5/9 = 25°C"
        }
      },
      {
        "@type": "Question",
        "name": "What is the formula for Kelvin conversion?",
        "acceptedAnswer": {
          "@type": "Answer", 
          "text": "Kelvin conversions: K = °C + 273.15 (Celsius to Kelvin) and °C = K - 273.15 (Kelvin to Celsius). Absolute zero is 0K = -273.15°C"
        }
      },
      {
        "@type": "Question",
        "name": "What are common temperature reference points?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Key temperature references: Water freezes at 0°C/32°F, room temperature is 20°C/68°F, body temperature is 37°C/98.6°F, water boils at 100°C/212°F"
        }
      }
    ]
  };

  const howToStructuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Convert Temperature Units",
    "description": "Step-by-step guide to convert between temperature units",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Enter the temperature value",
        "text": "Type the temperature number in the input field, with or without units"
      },
      {
        "@type": "HowToStep", 
        "name": "Select the input unit",
        "text": "Choose the source temperature unit from the dropdown menu"
      },
      {
        "@type": "HowToStep",
        "name": "View instant results",
        "text": "See automatic conversions to all other temperature scales"
      }
    ]
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>Free Temperature Converter - Celsius Fahrenheit Kelvin | ConvertTemp</title>
      <meta name="title" content="Free Temperature Converter - Celsius Fahrenheit Kelvin | ConvertTemp" />
      <meta name="description" content="Free online temperature converter for Celsius, Fahrenheit, Kelvin, Rankine conversions. Instant results with formulas. Perfect for students, engineers, cooking." />
      <meta name="keywords" content="temperature converter, celsius to fahrenheit, fahrenheit to celsius, kelvin converter, temperature conversion formula, free converter" />
      
      {/* AI Overview Optimization */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://converttemp.com/" />
      <meta property="og:title" content="Free Temperature Converter - Celsius Fahrenheit Kelvin" />
      <meta property="og:description" content="Instant temperature conversions between Celsius, Fahrenheit, Kelvin, and more. Free online calculator with formulas and explanations." />
      <meta property="og:image" content="/lovable-uploads/b352bfa9-5aa1-453b-bc12-a3cc7f0f9403.png" />
      <meta property="og:site_name" content="ConvertTemp" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://converttemp.com/" />
      <meta property="twitter:title" content="Free Temperature Converter - Celsius Fahrenheit Kelvin" />
      <meta property="twitter:description" content="Instant temperature conversions between Celsius, Fahrenheit, Kelvin, and more. Free online calculator with formulas and explanations." />
      <meta property="twitter:image" content="/lovable-uploads/b352bfa9-5aa1-453b-bc12-a3cc7f0f9403.png" />
      
      {/* Technical Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="author" content="ConvertTemp" />
      
      {/* Canonical URL */}
      <link rel="canonical" href="https://converttemp.com/" />
      
      {/* Icons */}
      <link rel="icon" href="/lovable-uploads/b352bfa9-5aa1-453b-bc12-a3cc7f0f9403.png" type="image/png" />
      <link rel="apple-touch-icon" href="/lovable-uploads/b352bfa9-5aa1-453b-bc12-a3cc7f0f9403.png" />
      <link rel="shortcut icon" href="/lovable-uploads/b352bfa9-5aa1-453b-bc12-a3cc7f0f9403.png" />
      
      {/* Structured Data for AI Overviews */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(faqStructuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(howToStructuredData)}
      </script>
      
      {/* Additional meta for AI content understanding */}
      <meta name="subject" content="Temperature Conversion Calculator" />
      <meta name="topic" content="Temperature unit conversion between Celsius, Fahrenheit, Kelvin" />
      <meta name="summary" content="Free online tool to convert temperatures between different scales with instant results and conversion formulas" />
      <meta name="category" content="Education, Science, Calculator" />
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta name="rating" content="General" />
    </Helmet>
  );
};