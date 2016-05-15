'use strict';
var express = require('express');
var app = express();
var Search = require('bing.search');
var search = new Search('sJou43iB2LvfrEg0RzqyfE2GwG8dgUwDxTtxQxDauao');
var util = require('util');
app.use(express.static('public'));
var MongoClient = require("mongodb").MongoClient,
    assert = require("assert");
var mongoose = require('mongoose');
var ip = require("ipware")().get_ip;
var url = "mongodb://eldart:abeceda@ds023432.mlab.com:23432/image-search";
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    db.close();
});
mongoose.connect(
    'mongodb://eldart:abeceda@ds023432.mlab.com:23432/image-search');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var historySchema = mongoose.Schema({
    name: String,
    date: Date,
    ipadress: String
});
var History = mongoose.model("History", historySchema);
app.get("/search/:id", function(req, res) {
    var ipInfo = ip(req);
    var IP = ipInfo['clientIp'];
    var id = req.params.id;
    var off = req.query.offset || 1;
    search.images(id, {
        skip: off,
        top: 10
    }, function(err, results) {
        console.log(util.inspect(results, {
            colors: true,
            depth: null
        }));
        var datum = new Date()
        var day = datum.getDate()
        var month = datum.getMonth() + 1
        var year = datum.getFullYear()
        var searchResult = new History({
            name: id,
            date: datum,
            ipadress: IP
        });
        searchResult.save(function(err, searchResult) {
            if (err) return console.error(err);
            console.log(searchResult);
        });
        res.send(results);
    });
});
app.get("/history", function(req, res) {
     
    var ipInfo = ip(req);
    var IP = ipInfo['clientIp'];
    History.find({ ipadress: IP },
      {
        _id: 0,
        __v: 0
      }, function(err, data) {
        if (err) return console.error(err);
        res.send(data);
    });

});

app.listen(process.env.PORT || 3000, function() {
    console.log('Listening on port ' + process.env.PORT + '...');
});