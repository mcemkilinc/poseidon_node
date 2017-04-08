/**
 * Created by Cem on 5/10/2016.
 */

var s_emergencyStatus = require('../models/emergencyStatus');

exports.getEmergencyStatus = function () {

        s_emergencyStatus.find({}, function(err, sEmergencyStatus){
        console.log("sttus"+sEmergencyStatus);
        if(err) res.send(err);
        });

    return s_emergencyStatus;

    /* TODO write db code to get the status*/
};
