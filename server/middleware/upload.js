const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");

function resolveBundledUploadDir() {
  const candidates = [
    path.join(__dirname, "../uploads"),
    path.join(process.cwd(), "server/uploads"),
  ];
  return candidates.find((candidate) => fs.existsSync(candidate)) || candidates[1];
}

const bundledUploadDir = resolveBundledUploadDir();
const tmpUploadDir = path.join(os.tmpdir(), "royalcity", "uploads");
let activeUploadDir = process.env.VERCEL ? tmpUploadDir : bundledUploadDir;

function getUploadDir() {
  try {
    fs.mkdirSync(activeUploadDir, { recursive: true });
    return activeUploadDir;
  } catch (error) {
    if (activeUploadDir !== tmpUploadDir && ["EROFS", "EACCES", "EPERM"].includes(error?.code)) {
      activeUploadDir = tmpUploadDir;
      fs.mkdirSync(activeUploadDir, { recursive: true });
      return activeUploadDir;
    }
    throw error;
  }
}

const extensions = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const storage = multer.diskStorage({
  destination(req, file, callback) {
    try {
      callback(null, getUploadDir());
    } catch (error) {
      callback(error);
    }
  },
  filename(req, file, callback) {
    callback(null, `${crypto.randomBytes(16).toString("hex")}${extensions[file.mimetype]}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
  fileFilter(req, file, callback) {
    if (!extensions[file.mimetype]) {
      const error = new Error("Only JPEG, PNG, and WebP images are allowed.");
      error.status = 400;
      callback(error);
      return;
    }
    callback(null, true);
  },
});

function uploadImage(req, res, next) {
  upload.single("image")(req, res, (error) => {
    if (!error) return next();
    if (error.code === "LIMIT_FILE_SIZE") {
      error.status = 400;
      error.message = "Image must be 2 MB or smaller.";
    }
    if (!error.status) error.status = 400;
    return next(error);
  });
}

module.exports = { uploadImage, getUploadDir, bundledUploadDir, tmpUploadDir };
