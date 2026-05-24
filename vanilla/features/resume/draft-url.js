/** Base64url encode/decode for ?draft= query (browser + Node). */

function toBase64Url(bytesOrString, isNode) {
  let b64;
  if (isNode) {
    b64 = Buffer.from(bytesOrString, typeof bytesOrString === "string" ? "utf8" : undefined).toString("base64");
  } else {
    const json = typeof bytesOrString === "string" ? bytesOrString : new TextDecoder().decode(bytesOrString);
    b64 = btoa(
      encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, h) =>
        String.fromCharCode(Number.parseInt(h, 16)),
      ),
    );
  }
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(str, isNode) {
  let b64 = String(str || "").replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  if (isNode) return Buffer.from(b64, "base64").toString("utf8");
  const bin = atob(b64);
  const pct = Array.from(bin, (c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`).join("");
  return decodeURIComponent(pct);
}

const isNode = typeof process !== "undefined" && process.versions?.node;

export function encodeResumeDraftBase64Url(draft) {
  const json = JSON.stringify(draft);
  return toBase64Url(json, isNode);
}

export function decodeResumeDraftBase64Url(encoded) {
  if (!encoded || typeof encoded !== "string") return null;
  try {
    const json = fromBase64Url(encoded.trim(), isNode);
    return JSON.parse(json);
  } catch {
    return null;
  }
}
