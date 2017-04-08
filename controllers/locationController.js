
var path = require ('path');
var User = require('../models/User');

exports.getSelectLocation = function(req, res) {
    req.session.HomeorBusiness = req.query.HomeorBusiness;
    res.render("utilities/locationPicker", {
    });
    //res.sendFile(path.resolve("views/locationpickertest.html"))
};

exports.postSelectLocation = function(req, res) {

    console.log("postSelectLocation:");
    console.log(req.session.HomeorBusiness);
    console.log(req.body.location_lat);
    console.log(req.body.location_long);
    User.findById(req.user.id, function(err, user) {
        if (err) {
            return next(err);
        }
        if (req.session.HomeorBusiness=1) {
            user.profile.location_lat = req.body.location_lat || '';
            user.profile.location_long = req.body.location_long || '';
        }
        if (req.session.HomeorBusiness=2) {
            user.profile.WorkLocation_lat = req.body.location_lat || '';
            user.profile.WorkLocation_long = req.body.location_long || '';
        }
        user.save(function (err) {
            if (err) {
                if (err.code === 11000) {
                    req.flash('errors', {msg: 'Girdiğiniz mail adresi zaten bir hesap ile ilintili.'});
                    return res.redirect('/account');
                } else {
                    return next(err);
                }
            }
            req.flash('success', {msg: 'Profil bilgileri güncellendi.'});
            res.redirect('/account');
            //res.sendFile(path.resolve("views/locationpickertest.html"))
        });
    });
};