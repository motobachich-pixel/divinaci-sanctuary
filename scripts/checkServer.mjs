// Robust local server check (no external deps)
// Usage: npm run check:server

const HOST_CANDIDATES = (
  process.env.CHECK_HOST ? [process.env.CHECK_HOST] : [
    'http://127.0.0.1:3000',
    'http://localhost:3000',
    'http://[::1]:3000',
    'http://0.0.0.0:3000',
  ]
);
const TIMEOUT_MS = Number(process.env.CHECK_TIMEOUT_MS || 8000);

async function fetchWithTimeout(url, options = {}, label = 'request') {
  const started = Date.now();
  // Prefer global fetch if available
  if (typeof fetch === 'function') {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      const ok = !!res.status;
      if (!ok) console.log(`[check:server] ${label} via fetch: no status`);
      return ok;
    } catch (err) {
      console.log(`[check:server] ${label} via fetch error: ${err?.name || 'Error'}${err?.message ? ` - ${err.message}` : ''}`);
      // Fall through to http/https fallback on fetch errors
    } finally {
      clearTimeout(id);
      const dur = Date.now() - started;
      if (dur > TIMEOUT_MS) console.log(`[check:server] ${label} timed out after ${dur}ms`);
    }
  }
  // Fallback to Node http/https
  try {
    const { URL } = await import('node:url');
    const u = new URL(url);
    const isHttps = u.protocol === 'https:';
    const mod = await import(isHttps ? 'node:https' : 'node:http');
    const payload = options.body ? String(options.body) : null;
    const headers = options.headers || {};
    const method = options.method || (payload ? 'POST' : 'GET');
    return await new Promise((resolve) => {
      const req = mod.request({ hostname: u.hostname, port: u.port || (isHttps ? 443 : 80), path: u.pathname, method, headers }, (res) => {
        const ok = !!res.statusCode;
        if (!ok) console.log(`[check:server] ${label} via ${isHttps ? 'https' : 'http'}: no statusCode`);
        resolve(ok);
      });
      req.on('error', (e) => { console.log(`[check:server] ${label} ${isHttps ? 'https' : 'http'} error: ${e.message}`); resolve(false); });
      const to = setTimeout(() => { try { req.destroy(); } catch {} resolve(false); }, TIMEOUT_MS);
      req.on('close', () => clearTimeout(to));
      if (payload) req.write(payload);
      req.end();
    });
  } catch (e) {
    console.log(`[check:server] ${label} fallback error: ${e?.message || e}`);
    return false;
  }
}

async function tryRoot(host) {
  // Prefer HEAD for quick check, fallback to GET
  const headOk = await fetchWithTimeout(host, { method: 'HEAD' }, `HEAD ${host}/`);
  if (headOk) return true;
  return await fetchWithTimeout(host, { method: 'GET' }, `GET ${host}/`);
}

async function tryApi(host) {
  const url = `${host}/api/chat`;
  // Try OPTIONS first, fallback to POST with minimal body
  const optOk = await fetchWithTimeout(url, { method: 'OPTIONS' }, `OPTIONS ${url}`);
  if (optOk) return true;
  return await fetchWithTimeout(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: 'ping' }] }),
  }, `POST ${url}`);
}

async function run() {
  let chosenHost = HOST_CANDIDATES[0];
  let rootOk = false;
  let apiOk = false;
  for (const host of HOST_CANDIDATES) {
    chosenHost = host;
    rootOk = await tryRoot(host);
    apiOk = await tryApi(host);
    if (rootOk || apiOk) break;
  }
  const status = { host: chosenHost, root: rootOk ? 'ok' : 'fail', apiChat: apiOk ? 'ok' : 'fail' };
  console.log(`[check:server] ${JSON.stringify(status)}`);
  const allOk = rootOk && apiOk;
  // Use exitCode for graceful termination on Windows to avoid libuv assertion
  process.exitCode = allOk ? 0 : 1;
}

run();
