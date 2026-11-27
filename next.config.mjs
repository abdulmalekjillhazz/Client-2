/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: process.cwd(),
  serverExternalPackages: [
    "express",
    "express-session",
    "express-rate-limit",
    "helmet",
    "multer",
    "cors",
    "dotenv",
    "express-validator",
  ],
  outputFileTracingIncludes: {
    "/api/[[...slug]]": ["./server/**/*"],
    "/uploads/[filename]": ["./server/uploads/**/*"],
  },
  images: {
    unoptimized: false,
  },
};

export default nextConfig;
