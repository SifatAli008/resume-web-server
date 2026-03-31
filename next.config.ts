import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  /** Needed so @imgly/background-removal + onnxruntime-web bundle for the client. */
  transpilePackages: ["@imgly/background-removal", "onnxruntime-web"],
  /**
   * Cross-origin isolation improves ONNX WASM (SharedArrayBuffer). Scoped to
   * invoice routes so the rest of the app is unchanged.
   */
  async headers() {
    return [
      {
        source: "/invoice/:path*",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
        ],
      },
    ];
  },
};

export default nextConfig;
