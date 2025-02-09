/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'xforgeassets001.xboxlive.com',
      },
      {
        protocol: 'https',
        hostname: 'xforgeassets002.xboxlive.com',
      },
    ],
  },
}

module.exports = nextConfig 