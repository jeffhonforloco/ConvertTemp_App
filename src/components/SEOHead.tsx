
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
      <meta property="og:image" content="/og-image.png" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Temperature Converter" />
      <meta name="twitter:description" content="Free online temperature converter. Convert between Celsius, Fahrenheit, Kelvin, and Rankine instantly." />
      <meta name="twitter:image" content="/og-image.png" />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://converttemp.com" />
      <meta name="author" content="ConvertTemp.com" />
      <meta name="language" content="en" />
      <meta name="revisit-after" content="1 days" />
      
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
