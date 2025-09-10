/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['ipfs.filebase.io'],
  },
  env: {
    NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    NEXT_PUBLIC_SEPOLIA_RPC_URL: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL,
    NEXT_PUBLIC_FILEBASE_GATEWAY: process.env.NEXT_PUBLIC_FILEBASE_GATEWAY,
  },
}

module.exports = nextConfig