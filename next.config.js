/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
    },
    output: 'standalone',
    redirects() {
        return [
            {
                source: '/',
                destination: '/sign-up',
                permanent: false,
            },
        ];
    },
    transpilePackages: ['lodash-es', 'lucia', 'mongoose', '@lucia-auth'],
};

module.exports = nextConfig;
