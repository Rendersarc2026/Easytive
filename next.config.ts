import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Sent with every response.
const securityHeaders = [
  // Browsers must not guess content types (stops a text upload running as script).
  { key: "X-Content-Type-Options", value: "nosniff" },
  // No other site may put these pages in a frame (clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  // HTTPS only for two years once a browser has seen the site over HTTPS.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

// Content Security Policy for the admin panel: everything must come from this
// site. Inline scripts stay allowed because the prerendered page shell that
// Next.js emits depends on them (a per-request nonce can't be put into a shell
// built ahead of time); the rest of the policy still blocks plugin content,
// foreign frames, <base> hijacking, forms posting elsewhere, and any request
// to another origin, which is where injected markup would send stolen data.
const adminCsp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Hide the floating "N" dev-tools badge (the black circle in the corner during dev).
  devIndicators: false,
  // Don't advertise the framework in a response header.
  poweredByHeader: false,
  experimental: {
    // Admin forms can carry one image upload (capped at 4 MB in src/lib/media.ts).
    serverActions: { bodySizeLimit: "5mb" },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/admin/:path*", headers: [{ key: "Content-Security-Policy", value: adminCsp }] },
      { source: "/admin", headers: [{ key: "Content-Security-Policy", value: adminCsp }] },
    ];
  },
};

export default nextConfig;
