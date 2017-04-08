/**
 * Module dependencies.
 */
var express = require('express');
var compress = require('compression');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var lusca = require('lusca');
var dotenv = require('dotenv');
var MongoStore = require('connect-mongo/es5')(session);
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var sass = require('node-sass-middleware');
var restclient = require('node-rest-client');
var multer = require('multer');
var upload = multer({ dest: path.join(__dirname, 'uploads') });
var formidable = require('formidable');
var fs = require('fs');
var fileUpload = require('express-fileupload');


/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 *
 * Default path: .env (You can remove the path argument entirely, after renaming `.env.example` to `.env`)
 */
dotenv.load({ path: '.env.example' });

/**
 * Controllers (route handlers).
 */
var homeController = require('./controllers/home');
var userController = require('./controllers/user');
var apiController = require('./controllers/api');
var contactController = require('./controllers/contact');
var adminController = require('./controllers/administrationController');
var notificationsController = require('./controllers/notificationsController');
var locationController = require('./controllers/locationController');
var fileUploadController = require('./controllers/fileUploadController');


/**
 * API keys and Passport configuration.
 */
var passportConfig = require('./config/passport');

/**
 * Create Express server.
 */
var app = express();

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
  var env = JSON.parse(process.env.VCAP_SERVICES);
  var dbLabel = 'compose-for-mongodb';
  var mongoDbCredentials = env[dbLabel][0]['credentials'];
  var ca = [new Buffer(mongoDbCredentials.ca_certificate_base64, 'base64')];
  mongoOpt = {
    poolSize: 4,
    sslCA: ca
          };
console.log(mongoOpt);
mongoose.connect("mongodb://admin:VWILXXWTTBKFABHJ@bluemix-sandbox-dal-9-portal.4.dblayer.com:22422/?ssl=true",mongoOpt);
mongoose.connection.on('error', () => {
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.');
  process.exit();
});



/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(compress());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
app.use(sass({
  src: path.join(__dirname, 'public/images'),
  dest: path.join(__dirname, 'public/images'),
  sourceMap: true
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB || process.env.MONGOLAB_URI,
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next) {
  if (req.path === '/api/fileupload'||req.path === '/api/fileuploadtwo' || req.path === '/userControl/memberListLoad'){
    next();
  } else {
    lusca.csrf()(req, res, next);
  }
});
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});
app.use(function(req, res, next) {
  // After successful login, redirect back to /api, /contact or /
  if (/(api)|(contact)|(^\/$)/i.test(req.path)) {
    req.session.returnTo = req.path;
  }
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.use(fileUpload());


/**
 * Primary app routes.
 */
app.get('/', homeController.index);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/account', passportConfig.isAuthenticated, userController.getAccount);
app.get('/account2', passportConfig.isAuthenticated, userController.getAccount2);
app.get('/account3', passportConfig.isAuthenticated, userController.getAccount3);
app.get('/account4', passportConfig.isAuthenticated, userController.getAccount4);
app.get('/account5', passportConfig.isAuthenticated, userController.getAccount5);
app.get('/account6', passportConfig.isAuthenticated, userController.getAccount6);
app.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
app.post('/account/profile2', passportConfig.isAuthenticated, userController.postUpdateProfile2);
app.post('/account/profile3', passportConfig.isAuthenticated, userController.postUpdateProfile3);
app.post('/account/profile4', passportConfig.isAuthenticated, userController.postUpdateProfile4);
app.post('/account/profile5', passportConfig.isAuthenticated, userController.postUpdateProfile5);
app.post('/account/profile6', passportConfig.isAuthenticated, userController.postUpdateProfile6);
app.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);
app.get('/administration', adminController.getAdmin);
app.get('/administration/manageEmergency', adminController.getmanageEmergency);
app.post('/administration/manageEmergency', adminController.postmanageEmergency);
app.get('/administration/createEmergency', adminController.getcreateEmergency);
app.get('/notification/createNotification', notificationsController.getcreateNotification);
app.post('/notification/createNotification', notificationsController.postcreateNotification);
app.get('/notification/manageNotifications', notificationsController.getManageNotifications);
app.get('/notification/updateNotification', notificationsController.getUpdateNotification);
app.post('/notification/updateNotification', notificationsController.postUpdateNotification);
app.get('/notification/deleteNotification', notificationsController.getDeleteNotification);
app.get('/selectLocation', locationController.getSelectLocation);
app.post('/selectLocation', locationController.postSelectLocation);
app.get('/uploadFile', fileUploadController.getUploadFile);
app.get('/showpicture', fileUploadController.showpicture);
app.post('/uploadFile', fileUploadController.postUploadFile);
app.get('/data/:imgtag', fileUploadController.postUploadFile);
app.get('/uploadfile2', fileUploadController.getUploadFileTwo);
app.post('/uploadfile2', fileUploadController.postUploadFileTwo);
app.get('/showpicture2', fileUploadController.showpicturetwo);
app.get('/userAdministration', adminController.getUsers);
app.get('/userControl/userCreate', adminController.getCreateUsers);
app.get('/userControl/userDelete', adminController.getDeleteUsers);
app.get('/userControl/userUpdate', adminController.getUpdateUser);
app.post('/userControl/userUpdate', adminController.postUpdateUser);
app.get('/userControl/userChangeRole', adminController.getChangeRoleUsers);
app.post('/userControl/userChangeRole', adminController.postChangeRoleUsers);
app.get('/userControl/memberListLoad', adminController.getMemberListLoad);
app.post('/userControl/memberListLoad', adminController.postMemberListLoad);




/**
 * API examples routes.
 */
app.get('/api', apiController.getApi);
app.get('/api/lastfm', apiController.getLastfm);
app.get('/api/nyt', apiController.getNewYorkTimes);
app.get('/api/aviary', apiController.getAviary);
app.get('/api/steam', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getSteam);
app.get('/api/stripe', apiController.getStripe);
app.post('/api/stripe', apiController.postStripe);
app.get('/api/scraping', apiController.getScraping);
app.get('/api/twilio', apiController.getTwilio);
app.post('/api/twilio', apiController.postTwilio);
app.get('/api/clockwork', apiController.getClockwork);
app.post('/api/clockwork', apiController.postClockwork);
app.get('/api/foursquare', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFoursquare);
app.get('/api/tumblr', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getTumblr);
app.get('/api/facebook', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);
app.get('/api/github', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getGithub);
app.get('/api/twitter', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getTwitter);
app.post('/api/twitter', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.postTwitter);
app.get('/api/venmo', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getVenmo);
app.post('/api/venmo', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.postVenmo);
app.get('/api/linkedin', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getLinkedin);
app.get('/api/instagram', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getInstagram);
app.get('/api/yahoo', apiController.getYahoo);
app.get('/api/paypal', apiController.getPayPal);
app.get('/api/paypal/success', apiController.getPayPalSuccess);
app.get('/api/paypal/cancel', apiController.getPayPalCancel);
app.get('/api/lob', apiController.getLob);
app.get('/api/bitgo', apiController.getBitGo);
app.post('/api/bitgo', apiController.postBitGo);
app.get('/api/upload', apiController.getFileUpload);
app.post('/api/upload', upload.single('myFile'), apiController.postFileUpload);
app.get('/api/pinterest', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getPinterest);
app.post('/api/pinterest', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.postPinterest);
app.post('/api/fileupload', fileUploadController.postUploadFile);
app.post('/api/fileuploadtwo', fileUploadController.postUploadFileTwo);


/**
 * OAuth authentication routes. (Sign in)
 */
app.get('/auth/instagram', passport.authenticate('instagram'));
app.get('/auth/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }));
app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});

/**
 * OAuth authorization routes. (API examples)
 */
app.get('/auth/foursquare', passport.authorize('foursquare'));
app.get('/auth/foursquare/callback', passport.authorize('foursquare', { failureRedirect: '/api' }), function(req, res) {
  res.redirect('/api/foursquare');
});
app.get('/auth/tumblr', passport.authorize('tumblr'));
app.get('/auth/tumblr/callback', passport.authorize('tumblr', { failureRedirect: '/api' }), function(req, res) {
  res.redirect('/api/tumblr');
});
app.get('/auth/venmo', passport.authorize('venmo', { scope: 'make_payments access_profile access_balance access_email access_phone' }));
app.get('/auth/venmo/callback', passport.authorize('venmo', { failureRedirect: '/api' }), function(req, res) {
  res.redirect('/api/venmo');
});
app.get('/auth/steam', passport.authorize('openid', { state: 'SOME STATE' }));
app.get('/auth/steam/callback', passport.authorize('openid', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/pinterest', passport.authorize('pinterest', { scope: 'read_public write_public' }));
app.get('/auth/pinterest/callback', passport.authorize('pinterest', { failureRedirect: '/login' }), function(req, res) {
  res.redirect('/api/pinterest');
});

/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
