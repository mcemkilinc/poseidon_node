/**
 * Created by Cem on 4/23/2016.
 */
var emergencyStatus = require('../models/emergencyStatus');
var njs_xlsx = require('xlsx');
var User = require('../models/User');
var nodemailer = require('nodemailer');
var fs = require('fs');





exports.getAdmin = function(req, res) {


    //if user gırışi yoksa hata veriyo.Profile bulamıyo çünkü
    if((req.user.profile.membertype=="AlertManagerHelper")|| (req.user.profile.membertype="AlertManager" )){
        res.render('administration/administration', {
        });}

    else {
        req.flash('fail', { msg: 'Yönetici Değilsiniz.Anasayfaya yönlendiriyorum' });
        res.redirect('/');
    }

};


var User = require('../models/User.js');

exports.getDeleteUsers = function(req, res) {
    console.log("post" + req.query.id);
    User.remove({ _id: req.query.id }, function(err) {
        if (err) {
            return next(err);
        }
        res.redirect('/userAdministration');
    })
};

exports.getUpdateUser = function(req, res) {
    console.log(req.query.id);
    User.findById(req.query.id,function(err,sUser){
        console.log(sUser.toString());
        res.render('userControl/userUpdate', { sUser : sUser})
    });
};

exports.postUpdateUser = function(req, res) {

    User.findById(req.body.userid, function(err, user) {
        if (err) {
            return next(err);
        }
        user.email = req.body.email || '';
        user.profile.name = req.body.name || '';
        user.profile.surname = req.body.surname || '';
        user.profile.TCKN = req.body.TCKN || '';
        user.profile.Bolge = req.body.Bolge || '';
        user.profile.Sube = req.body.Sube || '';
        user.profile.Organisation = req.body.Organisation || '';
        user.profile.MobilePhone = req.body.MobilePhone || '';

        user.save(function(err) {
            if (err) {
                if (err.code === 11000) {
                    req.flash('errors', { msg: 'Girdiğiniz mail adresi zaten bir hesap ile ilintili.' });
                    return res.redirect('/userAdministration');
                } else {
                    return next(err);
                }
            }
            req.flash('success', { msg: 'Profil bilgileri güncellendi.' });
            res.redirect('/userAdministration');
        });
    });
};



exports.getChangeRoleUsers = function(req, res) {
    User.findById(req.query.id,function(err,sUser){
        res.render('userControl/userChangeRole', { sUser : sUser
        })
    });

};

exports.postChangeRoleUsers = function(req, res) {
    User.findById(req.body.roleid,function(err,sUser){
        sUser.profile.membertype = req.body.membertype || '';
        sUser.save();
        req.flash('success', { msg: 'Rol Güncellendi.' });
        res.redirect('/userAdministration');
    })
};

exports.getCreateUsers = function(req, res) {
    res.redirect('/userControl/userCreate');

};

exports.getUsers = function(req, res) {
    User.find({}, function(err, sUsers){
        if(err) res.send(err);
        res.render('userControl/userControl', { sUsers : sUsers})
    });
};

exports.getCreateUsers = function(req, res) {
    res.render('userControl/userCreate')
};


exports.getmanageEmergency = function(req, res) {
    var sEmergencyStatus;
    emergencyStatus.find({}, function(err, sEmergencyStatus){
        console.log(sEmergencyStatus);
        if(err) res.send(err);

        res.render('administration/manageEmergency', { sEmergencyStatus : sEmergencyStatus[0]
        })

    });
};

exports.postmanageEmergency = function(req, res) {
    console.log("posted " + req.query.id);
    emergencyStatus.findById(req.body.docid, function(err, mEmergencyStatus){
        if(err) res.send(err);
        mEmergencyStatus.emergencyStatusData.emergencyText = req.body.emergencyText;
        mEmergencyStatus.emergencyStatusData.emergencyLevel = req.body.emergencyLevel;
        mEmergencyStatus.emergencyStatusData.emergencyActive = req.body.emergencyActive;
        mEmergencyStatus.save(function(err) {
            if (err) {
                return next(err);
            }
            req.flash('success', { msg: 'Acil Durum Güncellendi.' });
            res.redirect('/administration');

        })

    });
};

exports.getcreateEmergency = function(req, res)
{
    var mEmergencyStatus = new emergencyStatus();

    mEmergencyStatus.emergencyStatusData.emergencyText = "Acil Durum Yok";
    mEmergencyStatus.emergencyStatusData.emergencyLevel = "Düşük";
    mEmergencyStatus.emergencyStatusData.emergencyActive = "No";

    mEmergencyStatus.save(function(err) {
        if (err) {
            return next(err);
        }
        req.flash('success', { msg: 'Yeni Acil Durum Eklendi.' });
        res.redirect('/administration');
    });
}

exports.getMemberListLoad = function(req, res) {
    res.render('utilities/memberListLoader')
};

exports.postMemberListLoad = function(req, res)
{

     var transporter = nodemailer.createTransport({
         service: 'Gmail',
         auth: {
             user: 'geaposeidontur@gmail.com', // Your email id
             pass: 'nosceteipsum' // Your password
        }
    });



     try {
     var data = fs.readFileSync('template.txt', 'utf8');
     console.log(data);
     } catch(e) {
     console.log('Error:', e.stack);
     }

    var sampleFile;
    if (!req.files)
    {
        res.send('No files were uploaded.');
        return;
    }
    sampleFile = req.files.memberListFile;
    sampleFile.mv('./uploads/memberlistfile.xls', function (err)
    {
        if (err)
        {
            res.status(500).send(err);
        }
        else
        {
            res.send('File uploaded!');
            var sampleFileBStr;
            sampleFileBStr = sampleFile.toString('base64');
            console.log(sampleFileBStr);
            var xlsWorkbook;
            xlsWorkbook = njs_xlsx.readFile('./uploads/memberlistfile.xls');
            var result = {};
            var roa = njs_xlsx.utils.sheet_to_json(xlsWorkbook.Sheets['Sheet1']);
            if (roa.length > 0)
            {
                result = roa;
            }

            result.forEach( function (arrayItem)
            {

                User.findOne({email: arrayItem.eposta}, function(err, result) {
                    if (err) { /* handle err */ }

                    if (result) {
                        console.log('buldu');
                    } else {
                        var mailOptions = {
                            from: 'berkkarabacak>', // sender address
                            to: arrayItem.eposta, // list of receivers
                            //to: arrayItem.eposta, // böyle olucak
                            subject: 'Email Poseidon', // Subject line
                            text: data //, // plaintext body
                            // html: '<b>Hello world ?</b>' // You can choose to send an HTML body instead
                        };

                         transporter.sendMail(mailOptions, function(error, info){
                         if(error){
                         console.log(error);
                         return error
                         }else{
                         console.log('Message sent: ' + info.response);
                         };
                         });

                        console.log('bulaaamadı');
                        var usertosave = new User();
                        usertosave.profile.name = arrayItem.isim;
                        usertosave.profile.surname = arrayItem.soyad;
                        usertosave.email = arrayItem.eposta;
                        usertosave.profile.TCKN = arrayItem.tckimlik;
                        usertosave.profile.MobilePhone = arrayItem.ceptel;
                        usertosave.profile.Organisation = arrayItem.kurumadi;
                        usertosave.profile.Bolge = arrayItem.bolge;
                        usertosave.profile.Sube = arrayItem.sube;
                        usertosave.password = "123456";
                        usertosave.profile.membertype = arrayItem.yetki;

                        usertosave.save(function(err) {
                            if (err) {
                                return err;
                            }
                            else {
                            }
                        });                     }
                });

            });
        }
    });
};
