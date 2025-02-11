import multer from "multer";

const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
      cb(null, "./public")
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
  
export const upload = multer({ 
    storage, 
})