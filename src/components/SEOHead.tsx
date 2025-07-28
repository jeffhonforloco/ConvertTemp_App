
import { Helmet } from 'react-helmet-async';

export const SEOHead = () => {
  return (
    <Helmet>
      <title>Temperature Converter</title>
      <meta name="description" content="Free online temperature converter. Convert between Celsius, Fahrenheit, Kelvin, and Rankine instantly. Fast, accurate, and mobile-friendly temperature conversion tool." />
      <meta name="keywords" content="temperature converter, celsius to fahrenheit, fahrenheit to celsius, kelvin converter, rankine converter, temperature conversion, free converter" />
      
      {/* Open Graph */}
      <meta property="og:title" content="Temperature Converter" />
      <meta property="og:description" content="Free online temperature converter. Convert between Celsius, Fahrenheit, Kelvin, and Rankine instantly." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://converttemp.com" />
      <meta property="og:image" content="/lovable-uploads/b352bfa9-5aa1-453b-bc12-a3cc7f0f9403.png" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Temperature Converter" />
      <meta name="twitter:description" content="Free online temperature converter. Convert between Celsius, Fahrenheit, Kelvin, and Rankine instantly." />
      <meta name="twitter:image" content="/lovable-uploads/b352bfa9-5aa1-453b-bc12-a3cc7f0f9403.png" />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://converttemp.com" />
      <meta name="author" content="ConvertTemp.com" />
      <meta name="language" content="en" />
      <meta name="revisit-after" content="1 days" />
      
      {/* Mobile app icons */}
      <link rel="icon" href="/lovable-uploads/b352bfa9-5aa1-453b-bc12-a3cc7f0f9403.png" type="image/png" />
      <link rel="apple-touch-icon" href="/lovable-uploads/b352bfa9-5aa1-453b-bc12-a3cc7f0f9403.png" />
      <link rel="shortcut icon" href="/lovable-uploads/b352bfa9-5aa1-453b-bc12-a3cc7f0f9403.png" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Temperature Converter",
          "url": "https://converttemp.com",
          "description": "Free online temperature converter for Celsius, Fahrenheit, Kelvin, and Rankine",
          "applicationCategory": "UtilityApplication",
          "operatingSystem": "Any",
          "image": "/lovable-uploads/b352bfa9-5aa1-453b-bc12-a3cc7f0f9403.png",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        })}
      </script>
    </Helmet>
  );
};
