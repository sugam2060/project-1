import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images:{
        remotePatterns:[
            {
                protocol:'https',
                hostname:'res.cloudinary.com',
            }
        ]
    },
    experimental:{
        serverActions:{
            bodySizeLimit:'100mb'
        },
        staleTimes:{
            dynamic: 60 * 60 * 24, // 1 day
            static: 60 * 60 * 24, // 1 day
        }
    }
};

export default nextConfig;
