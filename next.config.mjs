/** @type {import('next').NextConfig} */

const securityHeaders = [

  { key: "X-Frame-Options", value: "DENY" },

  { key: "X-Content-Type-Options", value: "nosniff" },

  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

  { key: "X-DNS-Prefetch-Control", value: "off" },

  {

    key: "Permissions-Policy",

    value: "camera=(), microphone=(), geolocation=(), payment=()",

  },

  {

    key: "Content-Security-Policy",

    value: [

      "default-src 'self'",

      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",

      "style-src 'self' 'unsafe-inline'",

      "img-src 'self' data: blob:",

      "font-src 'self'",

      "connect-src 'self'",

      "frame-ancestors 'none'",

      "base-uri 'self'",

      "form-action 'self'",

    ].join("; "),

  },

];



if (process.env.NODE_ENV === "production") {

  securityHeaders.push({

    key: "Strict-Transport-Security",

    value: "max-age=63072000; includeSubDomains; preload",

  });

}



const nextConfig = {
  output: "standalone",
  experimental: {

    instrumentationHook: true,

    serverActions: {

      bodySizeLimit: "2mb",

    },

    serverComponentsExternalPackages: [

      "@electric-sql/pglite",

      "@electric-sql/pglite/nodefs",

    ],

    optimizePackageImports: ["lucide-react", "framer-motion"],

  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        "@electric-sql/pglite",
        "@electric-sql/pglite/nodefs",
      ];
    }
    return config;
  },

  async headers() {

    return [

      {

        source: "/:path*",

        headers: securityHeaders,

      },

    ];

  },

};



export default nextConfig;

