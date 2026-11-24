require("dotenv").config();

const http = require("http");
const next = require("next");
const expressApp = require("./app");

const dev = process.env.NODE_ENV !== "production";
const port = Number(process.env.PORT) || 3000;
const nextApp = next({ dev, dir: process.cwd() });

nextApp.prepare().then(() => {
  const handle = nextApp.getRequestHandler();
  const server = http.createServer((req, res) => {
    if (req.url.startsWith("/api/") || req.url.startsWith("/uploads/")) {
      expressApp(req, res);
      return;
    }
    handle(req, res);
  });
  server.listen(port, () => console.log(`RoyalCity running at http://localhost:${port}`));
}).catch((error) => {
  console.error("Unable to start RoyalCity:", error);
  process.exit(1);
});
