const encoder = new TextEncoder();
const decoder = new TextDecoder();
function buf2b64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-") // Convert '+' to '-'
    .replace(/\//g, "_") // Convert '/' to '_'
    .replace(/=+$/, "");
}
function trim(t, min = 3, max = 8) {
  return t.substr(0, Math.max(min, Math.floor(Math.random() * max)));
}
export function getKey() {
  return trim(buf2b64(crypto.getRandomValues(new Uint8Array(15))));
}

export const html = (t) =>
  new Response(t || "No", { headers: { "content-type": "text/html" } });
export const json = (d) =>
  new Response(JSON.stringify(d), {
    headers: { "content-type": "application/json" },
  });

export async function ensureValidKey(key) {
  while (true) {
    if (key) {
      if (!(await REDIRECT_BUCKET.get(key))) return key;
    }
    key = getKey();
  }
}

const valid_re = /^([a-zA-Z0-9_-])+$/;
export const valid = (x) => x && valid_re.test(x);

export async function hash(string) {
  return buf2b64(await crypto.subtle.digest("SHA-256", encoder.encode(string)));
}
