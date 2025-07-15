// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // faz o Next.js ignorar erros de ESLint na hora do build
  eslint: {
    ignoreDuringBuilds: true
  },

  // desativa otimizações automáticas do <Image>, permitindo qualquer src
  images: {
    unoptimized: true
  },
  experimental: {
    turbo:{}
  },

};

module.exports = nextConfig;
