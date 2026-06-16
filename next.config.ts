import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // Image optimization
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Experimental features for performance
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Allow scripts from firebase + google static assets and Groq
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.firebase.com *.firebaseapp.com firestore.googleapis.com api.groq.com www.gstatic.com apis.google.com accounts.google.com",
              // Allow connections to Firebase auth/token endpoints, Google OAuth, Firestore, Groq, and websockets
              "connect-src 'self' *.firebase.com *.firebaseapp.com firestore.googleapis.com api.groq.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com https://accounts.google.com https://oauth2.googleapis.com https://apis.google.com wss://*.firebaseio.com wss://firestore.googleapis.com https://firestore.googleapis.com",
              "img-src 'self' data: https:",
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
              "font-src 'self' data: fonts.gstatic.com",
              "frame-src 'self' accounts.google.com",
            ].join(";"),
          },
        ],
      },
    ];
  },

  // Bundle analyzer (uncomment to analyze bundle size)
  // webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
  //   if (!dev && !isServer) {
  //     config.plugins.push(
  //       new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)({
  //         analyzerMode: 'static',
  //         openAnalyzer: false,
  //       })
  //     );
  //   }
  //   return config;
  // },
};

export default nextConfig;
