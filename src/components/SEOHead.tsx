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
        "name": "How does ConvertTemp calculate temperature conversions?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ConvertTemp uses standard mathematical formulas: Celsius to Fahrenheit (°F = °C × 9/5 + 32), Fahrenheit to Celsius (°C = (°F - 32) × 5/9), and Kelvin conversions (K = °C + 273.15). All calculations are performed instantly with high precision."
        }
      },
      {
        "@type": "Question",
        "name": "Is ConvertTemp accurate for scientific use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, ConvertTemp provides scientifically accurate temperature conversions using standard formulas. The tool maintains precision to multiple decimal places, making it suitable for educational and professional scientific applications."
        }
      },
      {
        "@type": "Question",
        "name": "Can I convert temperatures on mobile with ConvertTemp?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ConvertTemp is fully mobile-responsive and works seamlessly on smartphones and tablets. The interface adapts to touch screens for easy temperature input and instant conversion results on any device."
        }
      },
      {
        "@type": "Question",
        "name": "Does ConvertTemp support Kelvin to Fahrenheit conversion?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, ConvertTemp supports direct Kelvin to Fahrenheit conversions using the formula °F = (K - 273.15) × 9/5 + 32. Simply select Kelvin as your input unit and view the Fahrenheit result instantly."
        }
      },
      {
        "@type": "Question",
        "name": "How do I quickly convert between Celsius, Fahrenheit, and Kelvin online?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Use ConvertTemp to instantly convert temperatures between Celsius, Fahrenheit, and Kelvin with a simple, accurate interface. Just enter your temperature value, select the input unit, and see all conversions immediately."
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
      {/* Primary Meta Tags - AI Overview Optimized */}
      <title>Online Temperature Converter for Celsius, Fahrenheit, and Kelvin</title>
      <meta name="title" content="Online Temperature Converter for Celsius, Fahrenheit, and Kelvin" />
      <meta name="description" content="Instantly convert temperatures between Celsius, Fahrenheit, and Kelvin with ConvertTemp. Accurate, fast, and free online temperature conversion tool." />
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