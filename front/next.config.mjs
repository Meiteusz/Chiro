/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
          {
            source: '/',
            destination: '/auth',
            permanent: false,
          },
        ]
      },
};

export default nextConfig;
