var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/User');

/**
 * GET /login
 * Login page.
 */
exports.getLogin = function(req, res) {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/login', {
    title: 'Login'
  });
};

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/login');
  }

  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('errors', info);
      return res.redirect('/login');
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: 'Hoşgeldiniz!'  });
      res.redirect(req.session.returnTo || '/');
    });
  })(req, res, next);
};

/**
 * GET /logout
 * Log out.
 */
exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = function(req, res) {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/signup', {
    title: 'Create Account'
  });
};

/**
 * POST /signup
 * Create a new local account.
 */

exports.postSignup = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
  req.sanitize('email').normalizeEmail();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/signup');
  }

   var user = new User({
    email: req.body.email,
    password: req.body.password
  });

  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      req.flash('errors', { msg: 'Account with that email address already exists.' });
      return res.redirect('/signup');
    }
    user.save(function(err) {
      if (err) {
        return next(err);
      }
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    });
  });
};

/**
 * GET /account
 * Profile page.
 */
exports.getAccount = function(req, res) {
  res.render('account/profile', {
    title: 'Account Management'
  });
};

exports.getAccount2 = function(req, res) {
    res.render('account/profile2', {
        title: 'Kişisel Bilgiler'
    });
};

exports.getAccount3 = function(req, res) {
    res.render('account/profile3', {
        title: 'Ev Adresi'
    });
};

exports.getAccount4 = function(req, res) {
    res.render('account/profile4', {
        title: 'İş Adresi'
    });
};
exports.getAccount5 = function(req, res) {
    res.render('account/profile5', {
        title: 'Aynı Evde Kaldığınız Kişiler'
    });
};
exports.getAccount6 = function(req, res) {
    res.render('account/profile6', {
        title: 'İletişim Zinciri'
    });
};
/**
 * POST /account/profile
 * Update profile information.
 */
exports.postUpdateProfile = function(req, res, next) {
  if(!(req.body.profile_form_id = 2)) {
      req.assert('email', 'Please enter a valid email address.').isEmail();
      req.sanitize('email').normalizeEmail();
  }
  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, function(err, user) {
    if (err) {
      return next(err);
    }
    user.email = req.body.email || '';
    user.profile.name = req.body.name || '';
    user.profile.surname = req.body.surname || '';
    user.profile.gender = req.body.gender || '';
    user.profile.location_lat = req.body.location_lat || '';
    user.profile.location_long = req.body.location_long || '';
    user.profile.website = req.body.website || '';
    user.profile.birthdate = req.body.birthdate || '';
    user.profile.BloodType = req.body.BloodType || '';
    user.profile.TCKN = req.body.TCKN || '';
    user.profile.Bolge = req.body.Bolge || '';
    user.profile.Sube = req.body.Sube || '';
    user.profile.Organisation = req.body.Organisation || '';
    user.profile.Email = req.body.Email || '';
    user.profile.Bolge = req.body.Bolge || '';
    user.profile.LevelStayed = req.body.LevelStayed || '';
    user.profile.InternalDefOfHome = req.body.InternalDefOfHome || '';
    user.profile.Password = req.body.Password || '';
    user.profile.HomePhone = req.body.HomePhone || '';
    user.profile.MobilePhone = req.body.MobilePhone || '';
    user.profile.HomeAddress = req.body.HomeAddress || '';
    user.profile.DeviceType = req.body.DeviceType || '';
    user.profile.SpecialAlert = req.body.SpecialAlert || '';
    user.profile.WorkName = req.body.WorkName || '';
    user.profile.WorkLevel = req.body.WorkLevel || '';
    user.profile.WorkLevelNumber = req.body.WorkLevelNumber || '';
    user.profile.WorkLocation_lat = req.body.WorkLocation_lat || '';
    user.profile.WorkLocation_long = req.body.WorkLocation_long || '';
    user.profile.SecurityCamLocation = req.body.SecurityCamLocation || '';



    user.save(function(err) {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'Girdiğiniz mail adresi zaten bir hesap ile ilintili.' });
          return res.redirect('/account');
        } else {
          return next(err);
        }
      }
      req.flash('success', { msg: 'Profil bilgileri güncellendi.' });
      res.redirect('/account');
    });
  });
};


exports.postUpdateProfile2 = function(req, res, next) {
    if(!(req.body.profile_form_id = 2)) {
        req.assert('email', 'Please enter a valid email address.').isEmail();
        req.sanitize('email').normalizeEmail();
    }
    var errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/account');
    }

    User.findById(req.user.id, function(err, user) {
        if (err) {
            return next(err);
        }
        user.profile.HomePhone = req.body.HomePhone || '';
        user.profile.SpecialAlert = req.body.SpecialAlert || '';
        user.profile.DeviceType = req.body.DeviceType || '';
        user.profile.BloodType = req.body.BloodType || '';

        user.save(function(err) {
            if (err) {
                if (err.code === 11000) {
                    req.flash('errors', { msg: 'Girdiğiniz mail adresi zaten bir hesap ile ilintili.' });
                    return res.redirect('/account');
                } else {
                    return next(err);
                }
            }
            req.flash('success', { msg: 'Profil bilgileri güncellendi.' });
            res.redirect('/account');
        });
    });
};


exports.postUpdateProfile3 = function(req, res, next) {
    if(!(req.body.profile_form_id = 3)) {
        req.assert('email', 'Please enter a valid email address.').isEmail();
        req.sanitize('email').normalizeEmail();
    }
    var errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/account');
    }

    User.findById(req.user.id, function(err, user) {
        if (err) {
            return next(err);
        }

        user.profile.LevelStayed = req.body.LevelStayed || '';
        user.profile.InternalDefOfHome = req.body.InternalDefOfHome || '';
        user.profile.HomeAddress = req.body.HomeAddress || '';
        user.profile.location_lat = req.body.location_lat || '';
        user.profile.location_long = req.body.location_long || '';
        user.profile.SpecialAlert = req.body.SpecialAlert || '';

        user.save(function(err) {
            if (err) {
                if (err.code === 11000) {
                    req.flash('errors', { msg: 'Girdiğiniz mail adresi zaten bir hesap ile ilintili.' });
                    return res.redirect('/account');
                } else {
                    return next(err);
                }
            }
            req.flash('success', { msg: 'Profil bilgileri güncellendi.' });
            res.redirect('/account');
        });
    });
};


exports.postUpdateProfile4 = function(req, res, next) {
    if(!(req.body.profile_form_id = 4)) {
        req.assert('email', 'Please enter a valid email address.').isEmail();
        req.sanitize('email').normalizeEmail();
    }
    var errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/account');
    }

    User.findById(req.user.id, function(err, user) {
        if (err) {
            return next(err);
        }

        user.profile.WorkName = req.body.WorkName || '';
        user.profile.WorkLevel = req.body.WorkLevel || '';
        user.profile.WorkLevelNumber = req.body.WorkLevelNumber || '';
        user.profile.WorkLocation_lat = req.body.WorkLocation_lat || '';
        user.profile.WorkLocation_long = req.body.WorkLocation_long || '';
        user.profile.SecurityCamLocation = req.body.SecurityCamLocation || '';

        user.save(function(err) {
            if (err) {
                if (err.code === 11000) {
                    req.flash('errors', { msg: 'Girdiğiniz mail adresi zaten bir hesap ile ilintili.' });
                    return res.redirect('/account');
                } else {
                    return next(err);
                }
            }
            req.flash('success', { msg: 'Profil bilgileri güncellendi.' });
            res.redirect('/account');
        });
    });
};

exports.postUpdateProfile5 = function(req, res, next) {
    if(!(req.body.profile_form_id = 5)) {
        req.assert('email', 'Please enter a valid email address.').isEmail();
        req.sanitize('email').normalizeEmail();
    }
    var errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/account');
    }

    User.findById(req.user.id, function(err, user) {
        if (err) {
            return next(err);
        }
        user.profile.HomeLifeExplanation = req.body.HomeLifeExplanation || '';
        user.profile.PeopleLiveinSameHome = req.body.PeopleLiveinSameHome || '';
        user.profile.SpecialEmergencyInformation = req.body.SpecialEmergencyInformation || '';

        user.save(function(err) {
            if (err) {
                if (err.code === 11000) {
                    req.flash('errors', { msg: 'Girdiğiniz mail adresi zaten bir hesap ile ilintili.' });
                    return res.redirect('/account');
                } else {
                    return next(err);
                }
            }
            req.flash('success', { msg: 'Profil bilgileri güncellendi.' });
            res.redirect('/account');
        });
    });
};
exports.postUpdateProfile6 = function(req, res, next) {
    if(!(req.body.profile_form_id = 6)) {
        req.assert('email', 'Please enter a valid email address.').isEmail();
        req.sanitize('email').normalizeEmail();
    }
    var errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/account');
    }

    User.findById(req.user.id, function(err, user) {
        if (err) {
            return next(err);
        }
        user.profile.CommunicationChain = req.body.CommunicationChain || '';


        user.save(function(err) {
            if (err) {
                if (err.code === 11000) {
                    req.flash('errors', { msg: 'Girdiğiniz mail adresi zaten bir hesap ile ilintili.' });
                    return res.redirect('/account');
                } else {
                    return next(err);
                }
            }
            req.flash('success', { msg: 'Profil bilgileri güncellendi.' });
            res.redirect('/account');
        });
    });
};

/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = function(req, res, next) {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, function(err, user) {
    if (err) {
      return next(err);
    }
    user.password = req.body.password;
    user.save(function(err) {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: 'Password has been changed.' });
      res.redirect('/account');
    });
  });
};

/**
 * POST /account/delete
 * Delete user account.
 */
exports.postDeleteAccount = function(req, res, next) {
  User.remove({ _id: req.user.id }, function(err) {
    if (err) {
      return next(err);
    }
    req.logout();
    req.flash('info', { msg: 'Your account has been deleted.' });
    res.redirect('/');
  });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.getOauthUnlink = function(req, res, next) {
  var provider = req.params.provider;
  User.findById(req.user.id, function(err, user) {
    if (err) {
      return next(err);
    }
    user[provider] = undefined;
    user.tokens = _.reject(user.tokens, function(token) { return token.kind === provider; });
    user.save(function(err) {
      if (err) {
        return next(err);
      }
      req.flash('info', { msg: provider + ' account has been unlinked.' });
      res.redirect('/account');
    });
  });
};

/**
 * GET /reset/:token
 * Reset Password page.
 */
exports.getReset = function(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  User
    .findOne({ passwordResetToken: req.params.token })
    .where('passwordResetExpires').gt(Date.now())
    .exec(function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
        return res.redirect('/forgot');
      }
      res.render('account/reset', {
        title: 'Password Reset'
      });
    });
};

/**
 * POST /reset/:token
 * Process the reset password request.
 */
exports.postReset = function(req, res, next) {
  req.assert('password', 'Password must be at least 4 characters long.').len(4);
  req.assert('confirm', 'Passwords must match.').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('back');
  }

  async.waterfall([
    function(done) {
      User
        .findOne({ passwordResetToken: req.params.token })
        .where('passwordResetExpires').gt(Date.now())
        .exec(function(err, user) {
          if (err) {
            return next(err);
          }
          if (!user) {
            req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
            return res.redirect('back');
          }
          user.password = req.body.password;
          user.passwordResetToken = undefined;
          user.passwordResetExpires = undefined;
          user.save(function(err) {
            if (err) {
              return next(err);
            }
            req.logIn(user, function(err) {
              done(err, user);
            });
          });
        });
    },
    function(user, done) {
      var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.SENDGRID_USER,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'geaposeidontur@starter.com',
        subject: 'Poseidon Şifreniz Değiştirildi',
        text: 'Merhaba,\n\n' +
          'Bu e-posta ' + user.email + ' hesabınızın şifresini değiştiğini bildirmek için iletildi.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        req.flash('success', { msg: 'Başarılı.Şifreniz Değiştirildi' });
        done(err);
      });
    }
  ], function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};

/**
 * GET /forgot
 * Forgot Password page.
 */
exports.getForgot = function(req, res) {

  res.render('account/forgot', {
    title: 'Forgot Password'
  });
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = function(req, res, next) {
  req.assert('email', 'Please enter a valid email address.').isEmail();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/forgot');
  }

  async.waterfall([
    function(done) {
      crypto.randomBytes(16, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email.toLowerCase() }, function(err, user) {
        if (!user) {
          req.flash('errors', { msg: 'No account with that email address exists.' });
          return res.redirect('/forgot');
        }
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour
        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: "geaposeidontur@gmail.com",
          pass: "nosceteipsum"
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'geaposeidontur@gmail.com',
        subject: 'Poseidon Şifre Değişikliği',
        text: 'Bu e-postayı aldınız çünkü siz veya başka birisi şifrenizi sıfırlamak istedi.\n\n' +
          'Lütfen işlemi tamamlamak için aşağıdaki bağlantıya tıklayınız:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'Bu işlemi siz istemediyseniz bu maili gerekli bilgile ile cevaplayınız.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        req.flash('info', { msg: user.email + ' adresine şifre değişikliği bilgileri iletildi.' });
        done(err);
      });
    }
  ], function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/forgot');
  });
};
