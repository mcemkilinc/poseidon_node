/**
 * Created by Cem on 4/23/2016.
 */
/**
 *
 *Create Notifications
 */

var Notification = require('../models/Notification');
var RestClient = require('node-rest-client').Client;

exports.getcreateNotification = function(req, res) {
    res.render('notification/createNotification', {
    });
};

exports.postcreateNotification = function(req, res,next) {
console.log("postcratenotificationcalled");
    var errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/notification/createNotification');
    }

    var mNotification = new Notification();

    mNotification.notification_data.queueNumber = req.body.queueNumber || '';
    mNotification.notification_data.shortText = req.body.shortText || '';
    mNotification.notification_data.longText = req.body.longText || '';
    mNotification.notification_data.siteLink = req.body.siteLink || '';
    mNotification.notification_data.mobilPush = req.body.mobilPush || '';
    if (mNotification.notification_data.mobilPush.toString() == "Yes")
    {
        var mRestClient = new RestClient();
        var pushNotificationArgs = {
        headers : {
            "Authorization": "Basic MTEzZDc4YWQtM2E5Yy00OTRiLThiYjQtY2U4ODIxODMwOTBj",
            "Content-Type": "application/json"
        },
            data :
            {"app_id":"afa04ea0-459b-4f94-a794-c7a73cc56f70",
                "contents":{"en":mNotification.notification_data.shortText},
                "included_segments": ["All"]}
        };
        mRestClient.post("https://onesignal.com/api/v1/notifications",pushNotificationArgs, function (data, response) {
            // parsed response body as js object
            console.log(data);
            // raw response
            console.log(response);
        });
        console.log()
        console.log("mobile pushed");
    };
    mNotification.save(function(err) {

        if (err) {
                return next(err);
            }

        req.flash('success', { msg: 'Yeni Duyuru Eklendi.' });
        res.redirect('/administration');
    });

    console.log(req.body.longText);
    console.log("reqbodycalled");
};

exports.getManageNotifications = function(req, res) {
    var sNotifications;
    Notification.find({}, function(err, sNotifications){
        if(err) res.send(err);
        //res.json(sNotifications);
        res.render('notification/manageNotifications', { sNotifications : sNotifications})
    });
};

exports.getUpdateNotification = function(req, res) {

    console.log(req.query.id);
    Notification.findById(req.query.id,function(err,sNotification){
        console.log(sNotification.toString());
        res.render('notification/updateNotification', { sNotification : sNotification
        })
    });

};

exports.postUpdateNotification = function(req, res) {

    
    console.log("post" + req.body.docid);
    Notification.findById(req.body.docid,function(err,sNotification){
        sNotification.notification_data.queueNumber = req.body.queueNumber || '';
        sNotification.notification_data.shortText = req.body.shortText || '';
        sNotification.notification_data.longText = req.body.longText || '';
        sNotification.notification_data.siteLink = req.body.siteLink || '';
        sNotification.save();
        req.flash('success', { msg: 'Duyuru Güncellendi.' });
        res.redirect('/notification/manageNotifications');
        })
    };

exports.getDeleteNotification = function(req, res) {

    console.log("post" + req.query.id);
    Notification.findById(req.query.id,function(err,sNotification){
            sNotification.remove();
        req.flash('success', { msg: 'Duyuru Silindi.' });
        res.redirect('/notification/manageNotifications');
    })



};