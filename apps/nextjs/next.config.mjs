import * as dotenv from 'dotenv'
dotenv.config({ path: "../../.env" });

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@probable/api", "@probable/db", "@probable/common"],
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
};

export default nextConfig;
 
