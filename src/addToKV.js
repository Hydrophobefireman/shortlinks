import { ensureValidKey, hash, html, json, valid } from "./util";

const decoder = new TextDecoder();

/**
 *
 * @param {{request:Request}} event
 */
export async function addToKV(event, url) {
  if (event.request.method === "POST") {
    const form = new URLSearchParams(
      decoder.decode(await event.request.arrayBuffer())
    );

    const u = form.get("url");
    if (!u) return html();

    let longURL = new URL(u);
    if (!longURL.host.includes(".")) {
      throw new Error();
    }
    if (url.hostname === longURL.hostname) {
      return json({ success: true, data: longURL.pathname.substr(1) });
    }
    longURL = longURL.toString();
    const req = form.get("request");
    const o = await ALREADY_ADDED_BUCKET.get(await hash(longURL));
    if (o) {
      return json({ success: true, data: o });
    }
    const key = await ensureValidKey(valid(req) ? req : null);
    await ALREADY_ADDED_BUCKET.put(await hash(longURL), key);
    await REDIRECT_BUCKET.put(key, longURL);

    return json({ success: true, data: key });
  }
  return html();
}
