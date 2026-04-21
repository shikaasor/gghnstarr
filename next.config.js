const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,  // Required: default loader requires a server
  },
  turbopack: {
    root: __dirname,
  },
  webpack: (config) => {
    // Prevent the resolver from walking up past this project's node_modules.
    // Without this, a stray package.json in a parent directory (e.g. from n8n)
    // causes webpack to look for packages like tailwindcss in the wrong location.
    config.resolve.modules = [path.resolve(__dirname, 'node_modules'), 'node_modules'];
    return config;
  },
};

module.exports = nextConfig;
