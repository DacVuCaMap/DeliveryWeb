/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    })


    return config
  },
  reactStrictMode: true, // Hoặc các cấu hình khác của bạn
  images: {
    domains: ['www.apple.com'], // Thêm tên miền vào đây
  },
};

export default nextConfig;