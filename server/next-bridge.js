const { PassThrough } = require("stream");
const http = require("http");
const expressApp = require("./app");

function createMockSocket(url, headers) {
  const socket = new PassThrough();
  const forwardedFor = headers["x-forwarded-for"];
  socket.remoteAddress = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";
  socket.encrypted = url.protocol === "https:" || headers["x-forwarded-proto"] === "https";
  socket.setTimeout = () => {};
  socket.cork = () => {};
  socket.uncork = () => {};
  return socket;
}

async function handleExpressRequest(request) {
  const url = new URL(request.url);
  const headers = {};
  for (const [key, value] of request.headers.entries()) {
    headers[key.toLowerCase()] = value;
  }

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const body = hasBody ? Buffer.from(await request.arrayBuffer()) : Buffer.alloc(0);
  if (body.length > 0) {
    headers["content-length"] = String(body.length);
    delete headers["content-encoding"];
    delete headers["transfer-encoding"];
  }

  const socket = createMockSocket(url, headers);
  const req = new http.IncomingMessage(socket);
  req.method = request.method;
  req.url = `${url.pathname}${url.search}`;
  req.originalUrl = req.url;
  req.headers = headers;
  req.httpVersion = "1.1";
  req.httpVersionMajor = 1;
  req.httpVersionMinor = 1;
  if (body.length > 0) req.push(body);
  req.push(null);

  return new Promise((resolve, reject) => {
    const res = new http.ServerResponse(req);
    const headerStore = new Map();
    const chunks = [];
    let settled = false;
    let headersWritten = false;

    res.locals = {};
    res.socket = socket;
    res.connection = socket;
    Object.defineProperty(res, "headersSent", {
      get: () => headersWritten,
      configurable: true,
    });

    res.setHeader = (name, value) => {
      headerStore.set(name.toLowerCase(), { name, value });
      return res;
    };

    res.getHeader = (name) => headerStore.get(name.toLowerCase())?.value;

    res.getHeaderNames = () => Array.from(headerStore.keys());

    res.getHeaders = () => {
      const out = {};
      for (const [key, entry] of headerStore.entries()) {
        out[key] = entry.value;
      }
      return out;
    };

    res.hasHeader = (name) => headerStore.has(name.toLowerCase());

    res.removeHeader = (name) => {
      headerStore.delete(name.toLowerCase());
    };

    res.appendHeader = (name, value) => {
      const key = name.toLowerCase();
      const prev = headerStore.get(key)?.value;
      if (prev === undefined) {
        headerStore.set(key, { name, value });
      } else {
        const next = [].concat(prev, value);
        headerStore.set(key, { name, value: next });
      }
      return res;
    };

    res.writeHead = (statusCode, reasonOrHeaders, maybeHeaders) => {
      res.statusCode = statusCode;
      let extra = null;
      if (typeof reasonOrHeaders === "string") {
        res.statusMessage = reasonOrHeaders;
        extra = maybeHeaders;
      } else {
        extra = reasonOrHeaders;
      }
      if (extra && typeof extra === "object") {
        for (const [key, value] of Object.entries(extra)) {
          res.setHeader(key, value);
        }
      }
      headersWritten = true;
      return res;
    };

    res.flushHeaders = () => {
      if (!headersWritten) res.writeHead(res.statusCode);
    };

    res.write = (chunk, encoding, callback) => {
      let enc = encoding;
      let cb = callback;
      if (typeof enc === "function") {
        cb = enc;
        enc = undefined;
      }
      if (!headersWritten) res.writeHead(res.statusCode);
      if (chunk != null) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, enc || "utf8"));
      }
      if (typeof cb === "function") cb();
      return true;
    };

    const finalize = () => {
      if (settled) return;
      settled = true;
      const outHeaders = new Headers();
      for (const { name, value } of headerStore.values()) {
        if (Array.isArray(value)) {
          for (const item of value) outHeaders.append(name, String(item));
        } else if (value !== undefined) {
          outHeaders.set(name, String(value));
        }
      }

      const noBody =
        request.method === "HEAD" ||
        res.statusCode === 204 ||
        res.statusCode === 205 ||
        res.statusCode === 304;
      const responseBody = noBody ? null : Buffer.concat(chunks);
      resolve(new Response(responseBody, { status: res.statusCode, headers: outHeaders }));
    };

    res.end = (chunk, encoding, callback) => {
      let enc = encoding;
      let cb = callback;
      if (typeof chunk === "function") {
        cb = chunk;
        chunk = undefined;
      } else if (typeof enc === "function") {
        cb = enc;
        enc = undefined;
      }
      if (chunk != null) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, enc || "utf8"));
      }
      if (!headersWritten) res.writeHead(res.statusCode);
      res.emit("finish");
      res.emit("close");
      if (typeof cb === "function") cb();
      finalize();
      return res;
    };

    try {
      expressApp(req, res);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { handleExpressRequest };
