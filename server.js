'use strict';
var express = require('express');
var app = express();
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
app.use(express.static('public'));
var fs = require("fs");


var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});

var MongoClient = require("mongodb").MongoClient,
    assert = require("assert");
var mongoose = require('mongoose');
var url = "mongodb://eldart:abeceda@ds023442.mlab.com:23442/metadata-service";
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    db.close();
});
mongoose.connect(
    'mongodb://eldart:abeceda@ds023442.mlab.com:23442/metadata-service');




var upload = multer({ storage : storage}).single('File');
app.get('/',function(req,res){
      res.sendFile(__dirname + "/index.html");
});

app.post('/',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        var a = req.file["size"];
        res.status(200).send(a.toString());
        console.log(req.file["filename"]); 
        
         fs.unlink("./uploads/"+req.file["filename"], function(err){
               if (err) throw err;
               console.log(req.file["filename"] + " deleted");
          });

    });
});




app.listen(process.env.PORT || 3000, function() {
    console.log('Listening on port ' + process.env.PORT + '...');
});