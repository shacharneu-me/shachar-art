import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // All images come from Sanity's image CDN, which does its own resizing and
    // format negotiation. Using a custom loader keeps transformation on their CDN
    // instead of paying for a second optimization pass at the hosting layer.
    loader: 'custom',
    loaderFile: './sanity/lib/image-loader.ts',
  },
  experimental: {
    optimizePackageImports: ['@portabletext/react'],
  },
}

export default nextConfig
