const fs = require("fs");
const os = require("os");
const path = require("path");

function resolveBundledFile() {
  const candidates = [
    path.join(__dirname, "../data/db.json"),
    path.join(process.cwd(), "server/data/db.json"),
    path.join(process.cwd(), "simple-demo/server/data/db.json"),
  ];
  return candidates.find((candidate) => fs.existsSync(candidate)) || candidates[1];
}

const bundledFile = resolveBundledFile();
const tmpFile = path.join(os.tmpdir(), "royalcity", "db.json");
let activeFile = process.env.VERCEL ? tmpFile : bundledFile;

const empty = () => ({
  users: [],
  inquiries: [],
  favorites: [],
});

function readFileSafe(target) {
  try {
    return { ...empty(), ...JSON.parse(fs.readFileSync(target, "utf8")) };
  } catch {
    return null;
  }
}

function read() {
  if (activeFile !== bundledFile) {
    const fromTmp = readFileSafe(activeFile);
    if (fromTmp) return fromTmp;
  }
  return readFileSafe(bundledFile) || empty();
}

let data = read();

function get(key) {
  return data[key];
}

function writeSafe(target, payload) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, payload);
}

function set(key, value) {
  data[key] = value;
  const payload = JSON.stringify(data, null, 2);
  try {
    writeSafe(activeFile, payload);
  } catch (error) {
    if (activeFile !== tmpFile && ["EROFS", "EACCES", "EPERM"].includes(error?.code)) {
      activeFile = tmpFile;
      try {
        writeSafe(activeFile, payload);
      } catch {
        // Keep in-memory state if tmp storage is also unavailable.
      }
    }
  }
}

module.exports = { get, set };
