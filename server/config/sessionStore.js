const fs = require("fs");
const os = require("os");
const path = require("path");
const { Store } = require("express-session");

function resolveBundledSessionFile() {
  const candidates = [
    path.join(__dirname, "../data/sessions.json"),
    path.join(process.cwd(), "server/data/sessions.json"),
    path.join(process.cwd(), "simple-demo/server/data/sessions.json"),
  ];
  return candidates.find((candidate) => fs.existsSync(candidate)) || candidates[1];
}

const bundledFile = resolveBundledSessionFile();
const tmpFile = path.join(os.tmpdir(), "royalcity", "sessions.json");

class FileSessionStore extends Store {
  constructor() {
    super();
    this.activeFile = process.env.VERCEL ? tmpFile : bundledFile;
    this.sessions = this.read();
  }

  read() {
    for (const candidate of [this.activeFile, bundledFile]) {
      try {
        return JSON.parse(fs.readFileSync(candidate, "utf8"));
      } catch {
        // Try next candidate
      }
    }
    return {};
  }

  write() {
    const payload = JSON.stringify(this.sessions);
    try {
      fs.mkdirSync(path.dirname(this.activeFile), { recursive: true });
      fs.writeFileSync(this.activeFile, payload);
    } catch (error) {
      if (this.activeFile !== tmpFile && ["EROFS", "EACCES", "EPERM"].includes(error?.code)) {
        this.activeFile = tmpFile;
        try {
          fs.mkdirSync(path.dirname(this.activeFile), { recursive: true });
          fs.writeFileSync(this.activeFile, payload);
        } catch {
          // Keep in-memory sessions if filesystem is read-only.
        }
      }
    }
  }

  get(sid, callback) {
    const session = this.sessions[sid];
    if (!session) return callback(null, null);
    const expires = session.cookie?.expires;
    if (expires && new Date(expires).getTime() <= Date.now()) {
      delete this.sessions[sid];
      this.write();
      return callback(null, null);
    }
    return callback(null, session);
  }

  set(sid, session, callback) {
    this.sessions[sid] = session;
    this.write();
    callback(null);
  }

  destroy(sid, callback) {
    delete this.sessions[sid];
    this.write();
    callback(null);
  }
}

module.exports = FileSessionStore;
