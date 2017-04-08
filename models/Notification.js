/**
 * Created by Cem on 4/23/2016.
 */
var mongoose = require('mongoose');

var notificationSchema = new mongoose.Schema(
    {notification_data:
    {
        queueNumber: { type: String, default: '' },
        shortText: { type: String, default: '' },
        longText: { type: String, default: '' },
        siteLink: { type: String, default: '' },
        mobilPush: { type: String, default: '' },
    }
    },
    { timestamps: true });

var Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
