/**
 * Created by Cem on 10/22/2016.
 */
var path = require ('path');
var User = require('../models/User');
var formidable = require('formidable');
var fs = require('fs');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var Grid = require('gridfs-stream');
var mongo = require('mongodb');
var mongoose = require('mongoose');



exports.getUploadFile = function(req, res) {

    res.render("utilities/fileLoader", {});
    //res.sendFile(path.resolve("views/locationpickertest.html"))

};

exports.getUploadFileTwo = function(req, res) {

    res.render("utilities/fileLoadertwo", {});
    //res.sendFile(path.resolve("views/locationpickertest.html"))

};


exports.postUploadFile = function(req, res) {

    Grid.mongo = mongoose.mongo;

    var conn = mongoose.connection;

    var filetobesaved;
    var pathtoberead;

    console.log(req.user.email);

    console.log("postUploadFile");

    // create an incoming form object
        var form = new formidable.IncomingForm();

        // specify that we want to allow the user to upload multiple files in a single request
        form.multiples = true;

        // store all uploads in the /uploads directory
        form.uploadDir = path.join(__dirname, '../uploads');

        // every time a file has been uploaded successfully,
        // rename it to it's orignal name
        form.on('file', function(field, file) {
            console.log("filenameis:")
            console.log(req.user.email);
            console.log(file.path);
            fs.rename(file.path, path.join(form.uploadDir, file.name));

            filetobesaved = file.name;
            pathtoberead = file.path;
            console.log("file name is"+filetobesaved);
            console.log("path name is"+form.uploadDir);
            // streaming to gridfs
            //filename to store in mongodb
            var gfs = Grid(conn.db);

            gfs.exist({filename: req.user.email+ "_locationimage1"}, function (err, found) {
                if (err) return handleError(err);
                if(found)
                    gfs.remove({filename: req.user.email+ "_locationimage1"}, function (err) {
                        if (err) return handleError(err);
                        console.log('deleted file with same name');
                    });
                else
                    console.log('file not found');
            });

            var writestream = gfs.createWriteStream({
                  filename: req.user.email + "_locationimage1"
            }, {flags: 'w'});

            var fullpath = form.uploadDir;
            fs.createReadStream(fullpath+"\\"+filetobesaved).pipe(writestream);

            writestream.on('close', function (file) {
            console.log("stream is closed");
            });

            // log any errors that occur
        form.on('error', function(err) {
            console.log('An error has occured: \n' + err);
        });
        });

    // once all the files have been uploaded, send a response to the client
        form.on('end', function() {
            res.end('success');
            console.log('success\n' );
        });

        // parse the incoming request containing the form data
        form.parse(req);
    };


exports.postUploadFileTwo = function(req, res) {
    Grid.mongo = mongoose.mongo;
    var conn = mongoose.connection;
    var filetobesaved;
    var pathtoberead;

    console.log(req.user.email);

    console.log("postUploadFile two");

    // create an incoming form object
    var form = new formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '../uploads');

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function(field, file) {
        console.log("filename 2 is:")
        console.log(req.user.email);
        console.log(file.path);
        fs.rename(file.path, path.join(form.uploadDir, file.name));

        filetobesaved = file.name;
        pathtoberead = file.path;
        console.log("file name 2 is"+filetobesaved);
        console.log("path name 2 is"+form.uploadDir);
        // streaming to gridfs
        //filename to store in mongodb
        var gfs = Grid(conn.db);
        var writestream = gfs.createWriteStream({
            filename: req.user.email + "_locationimage2"
        });

        var fullpath = form.uploadDir;
        fs.createReadStream(fullpath+"\\"+filetobesaved).pipe(writestream);

        writestream.on('close', function (file) {
            console.log("stream is closed");
        });

        // log any errors that occur
        form.on('error', function(err) {
            console.log('An error has occured: \n' + err);
        });
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function() {
        res.end('success');
        console.log('success\n' );
    });

    // parse the incoming request containing the form data
    form.parse(req);
};

exports.showpicture = function(req, res) {
    var conn = mongoose.connection;
    var gfs = Grid(conn.db,mongoose.mongo);
    var db = mongo.MongoClient;
    var url= "mongodb://localhost:27017/test";


    db.connect(url,function (err,db) {
        if(err){
            console.log("error at db connection");
        }else {

            var readstream = gfs.createReadStream({filename: req.user.email+ "_locationimage1"});
            readstream.on('open', function () {
                // This just pipes the read stream to the response object
                readstream.pipe(res);
            });
            gfs.exist({filename: req.user.email+ "_locationimage1"}, function (err, found) {
                if (err) return handleError(err);
                found ? console.log('File exists') : console.log('File does not exist');
            });
            console.log("pic showed");
        }
    });
//res.render("showpicture", {});
};

exports.showpicturetwo = function(req, res) {
    var conn = mongoose.connection;
    var gfs = Grid(conn.db,mongoose.mongo);
    var db = mongo.MongoClient;
    var url= "mongodb://localhost:27017/test";


    db.connect(url,function (err,db) {
        if(err){
            console.log("error at db connection");
        }else {

            var readstream = gfs.createReadStream({filename: req.user.email+ "_locationimage2"});
            readstream.on('open', function () {
                // This just pipes the read stream to the response object
                readstream.pipe(res);
            });
            gfs.exist({filename: req.user.email+ "_locationimage2"}, function (err, found) {
                if (err) return handleError(err);
                found ? console.log('File exists') : console.log('File does not exist');
            });
            console.log("pic showed 2");
        }
    });
//res.render("showpicture", {});
};