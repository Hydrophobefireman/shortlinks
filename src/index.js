import { html, valid } from "./util";

import { addToKV } from "./addToKV";
import { indexPage } from "./index_page";

/**
 * @param {{request:Request}} event
 */
async function handleEvent(event) {
  const url = new URL(event.request.url);
  let options = {};

  /**
   * You can add custom logic to how we fetch your assets
   * by configuring the function `mapRequestToAsset`
   */
  // options.mapRequestToAsset = handlePrefix(/^\/docs/)

  try {
    if (url.pathname === "/" || url.pathname === "/create") return indexPage();
    if (DEBUG) {
      // customize caching
      options.cacheControl = {
        bypassCache: true,
      };
    }
    if (url.pathname === "/api" || url.pathname === "/api/") {
      return addToKV(event, url);
    }
    const path = url.pathname.substr(1);
    const k = valid(path);
    if (!k) return html("nothing here");

    const redir = await REDIRECT_BUCKET.get(path);
    if (redir)
      return new Response("", {
        headers: { "content-type": "text/plain", location: redir },
        status: 301,
      });
    return html("nothing here");
  } catch (e) {
    // if an error is thrown try to serve the asset at 404.html
    if (!DEBUG) {
      try {
        return html("error");
      } catch (e) {}
    }

    return new Response(e.message || e.toString(), { status: 500 });
  }
}

/**
 * The DEBUG flag will do two things that help during development:
 * 1. we will skip caching on the edge, which makes it easier to
 *    debug.
 * 2. we will return an error message on exception in your Response rather
 *    than the default 404.html page.
 */
const DEBUG = false;
export function init() {
  addEventListener("fetch", (event) => {
    try {
      event.respondWith(handleEvent(event));
    } catch (e) {
      if (DEBUG) {
        return event.respondWith(
          new Response(e.message || e.toString(), {
            status: 500,
          })
        );
      }
      event.respondWith(new Response("Internal Error", { status: 500 }));
    }
  });
}
