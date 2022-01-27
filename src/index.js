/// importing the dependencies
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
//const { Router } = require('express');
const { path } = require('express/lib/application');
const multer = require("multer");
const fs = require("fs");

//app.use(express.static(__dirname+"./public/"));


mongoose.connect('mongodb+srv://hogteam:h0gteam@clusterhog.rg30t.mongodb.net/finalteamproject?retryWrites=true&w=majority',
{
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
const port = process.env.PORT || 3001
// defining the Express app
const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));


app.post('/auth', async (req,res) => {
  const user = await User.findOne({ username: req.body.username })
  if(!user) {
    return res.sendStatus(401);
  }
  if( req.body.password !== user.password ){
    return res.sendStatus(403)
  }
  user.token = uuidv4()
  await user.save()
  res.send({token: user.token,role:user.role,username:user.username,profileForm:user.profileForm[0]})

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

app.use( async (req,res,next) => {
  const authHeader = req.headers['authorization']
  const user = await User.findOne({token: authHeader})
  if(user) {
    next()
  }else {
    res.sendStatus(403);
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

// Employer dashboard functions

//Pulls only NEETs for Employers to hire
app.get('/employer', async (req, res) => {
  res.send(await ProfileForm.find().where('hired').equals(false))
})

// Participant dashboard functions

//Links post from profileform schema to user
app.post('/participant', async (req, res) => {
  const authHeader = req.headers['authorization']
  const user = await User.findOne({username: req.body.username})
  const newProfileForm = req.body;
  const profileForm = new ProfileForm(newProfileForm);
  await profileForm.save();
  user.profileForm = profileForm._id;
  await user.save()
  res.send({ message: 'New profile information added.' });
});

//Updates the post linked to the user
app.put('/participant/:id', async (req, res) => {
  await ProfileForm.findOneAndUpdate({ _id: ObjectId(req.params.id)}, req.body )
  res.send({ message: 'Profile information updated .' });
});

//Finds the post linked to the user
app.get('/profile/:id', async (req, res) => {
  console.log(req.params)
  const {id} = req.params
  const query = {}
  if (id){
    query._id = id
  }
  res.send(await ProfileForm.findById(query).lean())
})

//Find

//Find functionality in Frontend
app.post('/tda/search', async (req, res) => {
  const { sEmail, sFirstname, sLastname, sCourse, dateMin, dateMax } = req.body
  const query = {}
  if (sFirstname) {
    query.firstname = {$regex: sFirstname,$options:'i'}
  }
  if (sLastname) {
    query.lastname = {$regex: sLastname,$options:'i'}
  }
  if (sEmail){
    query.email = {$regex: sEmail,$options:'i'}
  }
  if(sCourse){
    query.course = {$regex: sCourse,$options:'i'}
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
