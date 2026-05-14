import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  /** Needed so @imgly/background-removal + onnxruntime-web bundle for the client. */
  transpilePackages: ["@imgly/background-removal", "onnxruntime-web"],
};

export default nextConfig;
