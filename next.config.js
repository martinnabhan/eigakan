module.exports = {
  env: {
    NEXT_TELEMETRY_DISABLED: '1',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    swcPlugins: [['next-superjson-plugin', {}]],
  },
  images: {
    formats: ['image/webp'],
    remotePatterns: [
      {
        hostname: 'via.placeholder.com',
        port: '',
        protocol: 'https',
      },
    ],
  },
  pageExtensions: ['page.ts', 'page.tsx'],
  poweredByHeader: false,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};
