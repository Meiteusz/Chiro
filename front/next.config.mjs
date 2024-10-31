/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: '/:encryptedProjectBoardId',
        destination: '/[encryptedProjectBoardId]',
      },
    ];
  },
};

export default nextConfig;
