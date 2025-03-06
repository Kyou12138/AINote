import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Can be safely removed in newer versions of Next.js
    future: {
        // by default, if you customize webpack config, they switch back to version 4.
        // Looks like backward compatibility approach.
        webpack5: true,
    },
    webpack(config) {
        config.resolve.fallback = {
            // if you miss it, all the other options in fallback, specified
            // by next.js will be dropped.
            ...config.resolve.fallback,
            stream: false,
            net: false,
            tls: false,
            querystring: false,
            crypto: false,
        };
        return config;
    },
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "siucwfcdlndoonaqfzwb.supabase.co",
                port: "",
                pathname: "/**",
                search: "",
            },
        ],
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
