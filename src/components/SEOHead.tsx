import { Helmet } from 'react-helmet-async';

export const SEOHead = () => {
  // Quick Answer for AI Overviews - Multiple variants for different queries
  const quickAnswer = "Use ConvertTemp to instantly convert temperatures between Celsius, Fahrenheit, and Kelvin with a simple, accurate interface. Enter any temperature value and get immediate conversions to all temperature scales with precise mathematical formulas.";
  
  // Extended quick answers for specific queries
  const temperatureFormulas = "Temperature conversion formulas: °F = (°C × 9/5) + 32, °C = (°F - 32) × 5/9, K = °C + 273.15. ConvertTemp applies these formulas automatically for instant accurate results.";
  const mobileAnswer = "ConvertTemp works perfectly on mobile devices, tablets, and desktops. No app download required - access the temperature converter directly in your browser for instant conversions anywhere.";

  // Main SoftwareApplication Schema
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ConvertTemp - Temperature Converter",
    "alternateName": ["Temperature Converter", "Celsius Fahrenheit Converter", "Kelvin Converter", "Temp Converter"],
    "description": "Free online temperature converter for Celsius, Fahrenheit, and Kelvin conversions with instant results and accurate formulas.",
    "url": "https://www.converttemp.com",
    "sameAs": [
      "https://www.converttemp.com",
      "https://converttemp.com"
    ],
    "applicationCategory": ["UtilityApplication", "EducationalApplication", "ScienceApplication"],
    "operatingSystem": "Any",
    "browserRequirements": "Any modern web browser",
    "softwareVersion": "2.0",
    "dateModified": "2024-01-01",
    "inLanguage": ["en", "es", "fr", "de", "it", "pt", "ru", "zh", "ja", "ko"],
    "isAccessibleForFree": true,
    "usageInfo": "Free temperature conversion tool for educational, scientific, and practical use",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "category": "Free Software"
    },
    "featureList": [
      "Celsius to Fahrenheit conversion",
      "Fahrenheit to Celsius conversion", 
      "Kelvin temperature conversions",
      "Rankine temperature support",
      "Réaumur temperature scale",
      "Instant calculation results",
      "Mobile responsive design",
      "No registration required",
      "Scientific accuracy",
      "Offline functionality",
      "Copy conversion results",
      "Temperature history",
      "Smart input detection",
      "Decimal precision control"
    ],
    "keywords": "temperature converter, celsius fahrenheit, kelvin converter, temperature conversion formulas, scientific calculator, unit converter",
    "audience": {
      "@type": "Audience",
      "audienceType": ["Students", "Scientists", "Engineers", "Chefs", "Weather enthusiasts", "General public"]
    },
    "creator": {
      "@type": "Organization",
      "name": "ConvertTemp",
      "url": "https://www.converttemp.com"
    },
    "publisher": {
      "@type": "Organization", 
      "name": "ConvertTemp",
      "url": "https://www.converttemp.com"
    }
  };

  // Enhanced FAQ Schema with more comprehensive questions
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
      },
      {
        "@type": "Question",
        "name": "What is the formula to convert Celsius to Fahrenheit?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The formula to convert Celsius to Fahrenheit is: °F = (°C × 9/5) + 32. For example, 0°C equals 32°F, and 100°C equals 212°F. ConvertTemp applies this formula automatically for instant results."
        }
      },
      {
        "@type": "Question",
        "name": "How do I convert Fahrenheit to Celsius?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To convert Fahrenheit to Celsius, use the formula: °C = (°F - 32) × 5/9. For example, 32°F equals 0°C, and 212°F equals 100°C. ConvertTemp performs this calculation instantly when you enter any Fahrenheit value."
        }
      },
      {
        "@type": "Question",
        "name": "What temperature scales does ConvertTemp support?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ConvertTemp supports all major temperature scales: Celsius (°C), Fahrenheit (°F), Kelvin (K), Rankine (°R), and Réaumur (°Ré). It provides instant conversions between any of these temperature units with scientific accuracy."
        }
      },
      {
        "@type": "Question",
        "name": "Is ConvertTemp free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, ConvertTemp is completely free to use. No registration, subscription, or payment required. Access unlimited temperature conversions from any device with an internet connection."
        }
      },
      {
        "@type": "Question",
        "name": "How accurate are ConvertTemp's temperature conversions?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ConvertTemp provides scientifically accurate temperature conversions using internationally recognized formulas. Results are calculated to multiple decimal places, ensuring precision suitable for academic, scientific, and professional applications."
        }
      }
    ]
  };

  // WebPage Schema for better AI understanding
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "ConvertTemp - Free Online Temperature Converter",
    "description": "Convert temperatures between Celsius, Fahrenheit, Kelvin, and other scales instantly with ConvertTemp's free online calculator.",
    "url": "https://www.converttemp.com",
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": "ConvertTemp Temperature Converter"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.converttemp.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Temperature Converter",
          "item": "https://www.converttemp.com"
        }
      ]
    },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [".temperature-converter", ".conversion-results"]
    }
  };

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ConvertTemp",
    "url": "https://www.converttemp.com",
    "logo": "https://www.converttemp.com/lovable-uploads/b352bfa9-5aa1-453b-bc12-a3cc7f0f9403.png",
    "sameAs": [
      "https://www.converttemp.com",
      "https://converttemp.com"
    ],
    "foundingDate": "2024",
    "description": "ConvertTemp provides free, accurate online temperature conversion tools for educational, scientific, and practical use worldwide.",
    "knowsAbout": [
      "Temperature conversion",
      "Celsius",
      "Fahrenheit", 
      "Kelvin",
      "Scientific calculations",
      "Unit conversion",
      "Educational tools"
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
      <title>ConvertTemp: Temperature Converter | Celsius Fahrenheit Kelvin</title>
      <meta name="title" content="ConvertTemp: Temperature Converter | Celsius Fahrenheit Kelvin" />
      <meta name="description" content="Instantly convert temperatures between Celsius, Fahrenheit, and Kelvin with ConvertTemp. Accurate, fast, and free online temperature conversion tool." />
      
      {/* Quick Answer for AI Overviews - Multiple variants */}
      <meta name="AI-overview-answer" content={quickAnswer} />
      <meta name="AI-overview-formulas" content={temperatureFormulas} />
      <meta name="AI-overview-mobile" content={mobileAnswer} />
      
      {/* Extended Keywords for Global Reach */}
      <meta name="keywords" content="temperature converter, celsius to fahrenheit, fahrenheit to celsius, kelvin converter, temperature conversion formula, free converter, unit conversion, scientific calculator, thermal conversion, degrees converter, temp calc, celsius fahrenheit kelvin rankine, online temperature tool, mobile temperature converter, accurate temperature conversion, instant conversion results" />
      
      {/* AI Overview Optimization */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      
      {/* International SEO */}
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />
      <meta name="geo.position" content="40.7589;-73.9851" />
      <meta name="ICBM" content="40.7589, -73.9851" />
      <link rel="alternate" hrefLang="en" href="https://www.converttemp.com" />
      <link rel="alternate" hrefLang="x-default" href="https://www.converttemp.com" />
      
      {/* Voice Search Optimization */}
      <meta name="voice-search" content="temperature conversion, how to convert celsius to fahrenheit, what is kelvin temperature" />
      <meta name="speak" content="ConvertTemp provides instant temperature conversions between Celsius, Fahrenheit, and Kelvin" />
      
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
      
      {/* Structured Data for AI Overviews - Multiple schemas for comprehensive coverage */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(faqStructuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(howToStructuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(webPageSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
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