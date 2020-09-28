
const express = require( 'express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const { body, validationResult } = require('express-validator');

const Users  = require('./models/user-schema');
const login = require('./controllers/userControllers/login');
const details = require('./controllers/userControllers/getDetails');
const loginHistoryDetails = require('./controllers/userControllers/loginHistory');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose
  .connect(
    'mongodb://localhost:27017/accubitsDB',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  .then(() => {
    console.log("MongoDB connection established.");
  })
  .catch(err => {
    console.log(
      "MongoDB connection error" + err,
    );
    process.exit();
  });

//   app.set('view engine', 'ejs');
//   app.use(express.static('public'));
  app.get('/', (req, res)=>{
    res.send({
        "message": "Helloworld"
    })
  });

  app.post('/register', 
  [
    body('email').isEmail(),
    body('name').isString().isLength({ mix: 5 }),
    body('password').isString().isLength({ min: 8 })
  ],
   async (req, res)=> {
    //    console.log(req.body);
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        return res.status(422).send({"message": "Invalid"})
    }
    const findUser = await Users.findOne({
      email: req.body.email,
    })
    if(findUser){
      return res.status(422).send(
        {
            "message":"Email id exists",
         }
     );
    }
    const userData = new Users({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });
    userData.save((e, userdata) => {
        console.log("error", e);
        if(userdata){
           return res.status(200).send(
               {
                   "message":"Regestered",
                   "Data": userdata
                }
            );
        }
        return res.status(500).send({"message":`ERROR ${e}`});
      });
  })
  
  app.post('/login',login);
  app.get('/details',details);
  app.get('/login-history', loginHistoryDetails);
  
console.log("Listening on port 3001");
app.listen(3001);