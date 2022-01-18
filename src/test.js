const multer = require("multer");
const fs = require("fs");

var storage = multer.memoryStorage();
  var uploadDisk = multer({ storage: storage });


   app.post("/user/new", uploadDisk.single('myFile'), async (req,res) =>{
    
    fs.writeFileSync('./uploads/' + Date.now() + req.file.originalname, req.file.buffer)
    
  // console.log(req.body)
   // console.log(req.files.myFile);
//req.files.myFile
    res.json({message: "Complete"})
   })

   app.get("/user/pic/:filename", (req,res) => {
     try
     {
       var path = require("path")
    // console.log("Got Here",__dirname + '/uploads/' + req.params.filename)
    res.sendFile(path.resolve('./uploads/' + req.params.filename))
     }
     catch(err){
       console.log(err)
     }
    //res.end()

   })