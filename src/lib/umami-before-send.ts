// Inlined into <head> as a classic script, so it must stay plain browser JS (the tracker calls
// window.umamiBeforeSend). It strips tokens and other query params before anything leaves the page.
export const UMAMI_BEFORE_SEND = `function umamiBeforeSend(type, payload) {
  function clean(value) {
    if (!value) return value;
    var u;
    try { u = new URL(value, location.origin); } catch (e) { return value; }
    // Non-http referrers (android-app://...) have an opaque "null" origin; keep the scheme+host part.
    if (u.protocol !== "http:" && u.protocol !== "https:") return value.split(/[?#]/)[0];
    var params = new URLSearchParams();
    u.searchParams.forEach(function (v, k) {
      if (k.indexOf("utm_") === 0 || k === "ref") params.append(k, v);
    });
    var qs = params.toString();
    var path = u.pathname.replace(/^\\/ai\\/[^/]+/, "/ai/[id]") + (qs ? "?" + qs : "");
    return /^[a-z][a-z\\d+.-]*:/i.test(value) ? u.origin + path : path;
  }
  try {
    if (new URL(payload.url, location.origin).pathname.split("/")[1] === "admin") return false;
  } catch (e) {}
  payload.url = clean(payload.url);
  payload.referrer = clean(payload.referrer);
  return payload;
}`
