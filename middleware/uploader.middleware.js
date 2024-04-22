const multer = require("multer");
const fs = require("fs");
const { generateRandomString } = require("../utilities/helpers");

const setPath = (path) => {
  return (req, res, next) => {
    req.uploadDir = path;

    next();
  };
};

const myStorage = multer.diskStorage({
  //configuration
  destination: (req, file, cb) => {
    const path = "./public/uploads" + req.uploadDir;
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
    cb(null, path);
  },
  //to make the filename unique
  filename: (req, file, cb) => {
    //for file extension
    const ext = file.filename.split(".").pop();

    const filename = Date.now() + "-" + generateRandomString(20) + "." + ext;
    cb(null, filename);
  },
});

const imageFilter = (req, file, cb) => {
  const ext = file.filename.split(".").pop();
  const allowed = ["jpg", "jpeg", "png", "svg", "webp", "gif", "bmp"];
  if (allowed.includes(ext.toLowerCase())) {
    cb(null, true);
  } else {
    cb({ code: 400, message: "Image format not supported" });
  }
};

const uploader = multer({
  storage: myStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 3000000, //up to 3MB
  },
});

module.exports = { uploader, setPath };
