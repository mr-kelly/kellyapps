/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	typedRoutes: true,
	output: "standalone",
	transpilePackages: ["@fincy/domains"],
};

export default nextConfig;
