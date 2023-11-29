 const multer = require("multer");
 const {v4:uuidv4} = require("uuid");
 const path = require("path");

//  console.log(path.extname("hello.pdf")); to get the extension of the file 

 const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null, './public/images/uploads')//destination folder for the uploads
    },
    filename : function(req,file,cb){
        const uniqueFilename = uuidv4();// generating unique filename using uuid
        cb(null, uniqueFilename+path.extname(file.originalname));//us ethe unique file name for the uploaded file
       
    },
 });

 const upload = multer({ storage : storage});
 module.exports = upload; 