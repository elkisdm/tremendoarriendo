/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@heroicons/react", "@headlessui/react"],
  },
  async redirects() {
    return [
      {
        source: "/propiedad/:id",
        destination: "/property/:id",
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
