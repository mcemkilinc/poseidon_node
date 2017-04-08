/**
 * Created by Cem on 4/23/2016.
 */
/**
 * backups of previously written code
 */

var Notifications = new Array();
exports.getNotifications = function () {
    Notifications[0] = "Duyuru 1";
    Notifications[1] = "Duyuru 2";
    return Notifications;
    /* TODO write db code to get the Notifications*/
};

User.findById(req.user.id, function(err, user) {
    if (err) {
        return next(err);
    }
    user.profile.location_lat = req.body.location_lat || '';
    user.profile.location_long = req.body.location_long || '';
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