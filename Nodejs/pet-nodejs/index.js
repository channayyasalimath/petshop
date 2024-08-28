require('dotenv').config()
const path = require("path")
const express = require("express");
const app = express();


const bodyParser = require("body-parser");
const morganApiLogger = require('morgan');
const cors = require('cors');
app.use(require("express").static(path.join(__dirname, 'public')))
app.use(cors())

app.use(morganApiLogger('dev'));

app.use(bodyParser.urlencoded({
    extended : true
}))

app.use(bodyParser.json());

// app.post('/login',(req, res)=>{
//     const username = req.body.username
//     const user = { name : username}

//     const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)

//     res.send({ accessToken : accessToken })

// });

// function authenticateToken(req, res, next){
//      const authHeader = req.headers['authorization']
//      const token = authHeader && authHeader.split(' ')[1]

//      if (token == null)
//      return res.sendStatus(401)

//      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
//         if(err)
//         return res.sendStatus(403)

//         req.user = user
//         next()
//      })
// }

const routers = require("./routes")(express.Router(), app);

app.use("/", routers);

app.listen(4000, ()=>{
    console.log("Hello world")
});