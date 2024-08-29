// Using lib Multer to handle the file upload 
const multer = require('multer');

// Define the storge for uploaded files 
const storage = multer.diskStorage({
    destination: (req, _file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  })

// Initialize multer with the storage configuration
const upload = multer({ storage })

module.exports = upload;