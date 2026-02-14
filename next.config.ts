import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Content Security Policy for kids' app safety
// Restricts where resources can load from and blocks dangerous APIs
// Note: 'unsafe-inline' is required for Next.js hydration scripts
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: blob:;
  media-src 'self' blob:;
  connect-src 'self' https://*.cognitiveservices.azure.com https://*.tts.speech.microsoft.com;
  frame-ancestors 'self';
  base-uri 'self';
  form-action 'self';
  object-src 'none';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Headers for WebView optimization (applied during development)
  // For static export, configure these on your hosting platform
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Content Security Policy - critical for kids' app safety
          { key: "Content-Security-Policy", value: ContentSecurityPolicy },
          // Allow embedding in WebViews (remove X-Frame-Options restriction)
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Security headers
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Prevent browsers from caching sensitive data
          { key: "Cache-Control", value: "no-store, max-age=0" },
          // Permissions policy for mobile features - disable unnecessary APIs
          {
            key: "Permissions-Policy",
            value: "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
