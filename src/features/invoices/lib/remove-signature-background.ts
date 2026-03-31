import type { Config } from "@imgly/background-removal";

/**
 * Runs @imgly/background-removal with settings that work reliably in Next.js
 * (CPU inference, explicit models). Retries with alternate models if a fetch or
 * session init fails (e.g. CDN hiccup or unsupported default model).
 */
export async function removeSignatureBackground(file: File): Promise<Blob> {
  const { removeBackground } = await import("@imgly/background-removal");

  const attempts: Partial<Config>[] = [
    { device: "cpu", model: "isnet_quint8", proxyToWorker: false },
    { device: "cpu", model: "isnet_fp16", proxyToWorker: false },
    { device: "cpu", model: "isnet", proxyToWorker: false },
  ];

  let lastError: unknown;
  for (const cfg of attempts) {
    try {
      return await removeBackground(file, cfg);
    } catch (e) {
      lastError = e;
    }
  }

  throw lastError;
}
