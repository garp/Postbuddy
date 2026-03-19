/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/5.x/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/a/**',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        port: '',
        pathname: '/api/portraits/**',
      },
      {
        protocol: 'https',
        hostname: 'post-buddy.s3.ap-south-1.amazonaws.com',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'postbuddy.ai',
        port: '',
        pathname: '/**',
      }
    ],
    // Enable SVG support
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

    domains: [
      's3.amazonaws.com',
      'localhost',
      'r2.erweima.ai',
      'anotherdomain.com',
      'cms.postbuddy.ai',
    ],
  },
};

export default nextConfig;
