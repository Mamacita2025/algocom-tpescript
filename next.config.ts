import type { NextConfig } from "next";

const NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "i0.wp.com",
      "electrek.co",
      "cdn.newsapi.org",
      "media.cnn.com",
      "ichef.bbci.co.uk",
      "static01.nyt.com",
      "static.feber.se",
      "imageio.forbes.com", // ✅ adicionado
      "wordpress-assets.futurism.com",
      "cdn.wccftech.com",
      "smartcdn.gprod.postmedia.digital",
       "d3i6fh83elv35t.cloudfront.net",
       "www.livemint.com",
        "techcrunch.com",
      "i.kinja-img.com",    // ajuste conforme as URLs que aparecerem
      "example.com",
    ],
  },
};

export default NextConfig;


