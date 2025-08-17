/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')('./src/i18n.ts');

const nextConfig = {
  // App Directory is stable in Next.js 15, no need for experimental flag
  // Enable static exports for Netlify
  output: 'export',
  trailingSlash: true,
  
  // Image optimization
  images: {
    unoptimized: true, // Set to false if you want Next.js image optimization
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: 'my-value',
  },
  
  // Redirects
  async redirects() {
    return [
      // Add any redirects you need
    ];
  },
  
  // Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);