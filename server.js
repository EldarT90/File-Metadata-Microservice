'use strict';
var express = require('express');
var app = express();
var http = require("http");
var shortURLPromise, short = require('short');
var regex = /^https?:\/\/(www)?\.[a-z]+\.[a-z]{1,3}.*$/

short.connect('mongodb://eldart:abeceda@ds011369.mlab.com:11369/url-shortener');   
short.connection.on('error', function(error) {
    console.log({ error: "Unexpected error" });;
});

app.use(express.static('public'));



app.get("/:id", function(req, res) {
  var id = req.params.id; 
  console.log(id);
  var hitPromise = short.retrieve(id);
  hitPromise.then(function(doc) {
    console.log("TARGETING " + doc);

    res.statusCode = 302;
    res.setHeader("Location", doc.URL);
    res.end();
    
  
  }, function(error) {
    if (error) {
       res.send({ error: "No url with key " + id + " found." });
    }
  });
  

});




app.get('/new/*', function(req, res) {
  var a = req.path.split('/').slice(2).join('/') 
    var url = req.params.url;
console.log(a);

 if (!a.match(regex)) {
   res.send({ error: "URL request is not valid" });
   return;
 }  
  
    var shortURLPromise = short.generate({
        URL: a
    });
    // gets back the short url document, and then retrieves it 
    shortURLPromise.then(function(mongodbDoc) {
        console.log('>> CREATED NEW SHORT URL:');
        console.log(mongodbDoc);
        console.log('>> retrieving short URL: %s', mongodbDoc.hash);
        short.retrieve(mongodbDoc.hash).then(function(result) {
            console.log('>> retrieve result:');
            console.log(result)
            res.send({
                "website": mongodbDoc.URL,
                "short version": mongodbDoc.hash
            });
            //res.send(mongodbDoc.URL);
            //var shortLink = mongodbDoc.URL;
        }, function(error) {
            if (error) {
               res.send({ error: "Unexpected error" });
            }
        });
    }, function(error) {
        if (error) {
             res.send({ error: "Unexpected error" });
        }
    });
});
app.listen(process.env.PORT || 3000, function() {
    console.log('Listening on port ' + process.env.PORT + '...');
});