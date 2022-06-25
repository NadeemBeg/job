require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose"); // connection for mongodb


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true
  })
  .then(() => {
    console.log("DB CONNECTED");
  });
  app.use(basicAuth)
  function basicAuth (req, res, next) {
    console.log('ff',req.path);
    var a=(req.path).toString();
    if(a.indexOf('/api/createAjob')> -1){
      console.log('true')
      return next();
    }else{
      console.log('false')
    }
    if(a.indexOf('/api/getOneJob')> -1){
      console.log('true')
      return next();
    }else{
      console.log('false')
    }
    var authHearder = req.headers.authorization;
    console.log("authHearder11111", authHearder);
    if (!authHearder) {
        var err = new Error("You are not authenticated!");
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
          return next(err);
    }
    var auth = new Buffer(authHearder.split(' ')[1], 'base64').toString().split(':');
    var userName = auth[0];
    var password = auth[1];
    if (userName === "job" && password === "job") {
        console.log("YES");
        next();
    }
    else {
        var err = new Error("You are not authenticated!");
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        err.message = "You are not authenticated!"
        return next(err);
    }
}
const job = require("./router/job");

app.use("/api",job);

// manage docs
// app.use('/upload/profilePic', express.static('./upload/profilePic'));
// app.use('/upload/resume', express.static('./upload/resume'));

const port = process.env.PORT || 3001;

app.listen(port, ()=>{
    console.log(`app is running on`, port);
})