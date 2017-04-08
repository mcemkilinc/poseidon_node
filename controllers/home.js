/**
 * GET /
 * Home page.
 */
var poseidonUtils = require('./poseidonUtils');
var Notification = require('../models/Notification');
var s_emergencyStatus = require('../models/emergencyStatus');

exports.index = function(req, res) {
  Notification.find({}, function (err, pNotifications) {
    console.log("buda" + poseidonUtils.getEmergencyStatus());
    if (err) res.send(err);
      s_emergencyStatus.find({}, function(err, sEmergencyStatus){
          console.log("sttusinindex "+sEmergencyStatus);
          if(err) res.send(err);
          res.render('home',
              {
                  title: 'Home', altstatus_text: 'Home',
                  altstatus_active: 'Home',
                  sNotifications: pNotifications
              });
      });

  })
};
