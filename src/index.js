/// importing the dependencies
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');
const { ProfileForm } = require('../models/profileForm');
const { User } = require('../models/user');
const { path } = require('express/lib/application');
const multer = require("multer");
const fs = require("fs");
const { S3Client, PutObjectCommand, CreateBucketCommand } = require("@aws-sdk/client-s3")
const fileUpload = require('express-fileupload');
const { env } = require('process');
mongoose.connect('mongodb+srv://hogteam:h0gteam@clusterhog.rg30t.mongodb.net/finalteamproject?retryWrites=true&w=majority');
const port = process.env.PORT || 3001
// defining the Express app
const app = express();
const s3Client = new S3Client({ region: 'eu-west-2', 
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY
  }
 })

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

app.use(fileUpload());


app.post('/auth', async (req,res) => {
  const user = await User.findOne({ username: req.body.username })
  console.log(req.body.username)
  console.log(req.body.password)
  if(!user) {
    return res.sendStatus(401);
  }
  if( req.body.password !== user.password ){
    return res.sendStatus(403)
  }

  user.token = uuidv4()
  await user.save()
  res.send({token: user.token,role:user.role})

})


app.get("/user/pic/:filename", (req,res) => {
  try
  {
    var path = require("path")
  res.sendFile(path.resolve('./uploads/' + req.params.filename))
  }
  catch(err){
    console.log(err)
  }
})


app.use( async (req,res,next) => {
  const authHeader = req.headers['authorization']
  const user = await User.findOne({token: authHeader})
  if(user) {
    next()
  }else {
    res.sendStatus(403);
  }
})

app.post('/imageUpload', async (req, res) => {
  const { data, name ,size } = Object.values(req.files)[0]
  const fileContent = Buffer.from(data, 'binary');
  const params = {
    Bucket: 'hoggrouppictures',
    Key: Date.now() + "_" + name,
    Body: fileContent,
    ACL: 'public-read'
  }
  // Maybe create the bucket?
  // try {
  //   const bucketmaker = await s3Client.send(
  //       new CreateBucketCommand({ Bucket: params.Bucket })
  //   );
  //   console.log('Created Bucket', bucketMaker)
  // } catch (err) {
  //   console.error('Failed to make bucket', err)
  // }

  try {
    const result = await s3Client.send(new PutObjectCommand(params))
    const link = `https://${params.Bucket}.s3.eu-west-2.amazonaws.com/${params.Key}`
    res.send({ link })
  } catch (err) {
    console.error('Failed to store it', err)
    res.send('FAILED, do something here')
  }
})

// defining CRUD operations

var storage = multer.memoryStorage();
var uploadDisk = multer({ storage: storage });


app.post("/user/new", uploadDisk.single('myFile'), async (req,res) =>{
  var savedFilename = './uploads/' + Date.now() + req.file.originalname;
  fs.writeFileSync(savedFilename, req.file.buffer)
  res.json({filename: savedFilename})
})


app.post('/', async (req, res) => {
  const authHeader = req.headers['authorization']
  const user = await User.findOne({token: authHeader})
  
  const newProfileForm = req.body;
  const profileForm = new ProfileForm(newProfileForm);
  
  await profileForm.save();
  res.send({ message: 'New profile information added.' });
});
app.get('/', async (req, res) => {
  res.send(await ProfileForm.find());
});


app.delete('/:id', async (req, res) => {
  await ProfileForm.deleteOne({ _id: ObjectId(req.params.id) })
  res.send({ message: 'Profile removed.' });
});

app.put('/:id', async (req, res) => {
  await ProfileForm.findOneAndUpdate({ _id: ObjectId(req.params.id)}, req.body )
  res.send({ message: 'Profile information updated .' });
});

app.post('/tda/search', async (req, res) => {
  const { sEmail, sFullname, sCourse, dateMin, dateMax } = req.body
  const query = {}
  if (sFullname) {
    query.fullname = sFullname
  }
  if (sEmail){
    query.email = sEmail
  }
  if(sCourse){
    query.course = sCourse
  }
  if (dateMin){
    query.date = { $gte: dateMin }
  }
  if (dateMax) {
  query.date.$lte = dateMax
  }
  if (!dateMax && dateMin){
    query.date={$eq:dateMin}
  }
  res.send(await ProfileForm.find(query).lean())
})

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  console.log("Database connected!")
});
