/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: "/Adelai",
  assetPrefix: "/Adelai",
};

module.exports = nextConfig;
