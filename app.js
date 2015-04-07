var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('./model/db');
var routes = require('./routes/index');
var user = require('./routes/user');
var project = require('./routes/project');
var app = express();
var session = require('express-session');
// We set static content
app.use(express.static('public'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true
}));
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
//app.use('/user', user);
//app.get('/',routes.index);

app.get('/user',user.index);
app.get('/user/new',user.create);
app.post('/user/new',user.doCreate);
app.get('/login', user.login); // Login form
app.post('/login', user.doLogin); // Login action

app.get('/project/new', project.create); // Create new project form
app.post('/project/new', project.doCreate); // Create new project action
app.get('/project/byuser/:userid',project.byUser);
app.get('/project/:id', project.displayInfo); // Display project info

/*
app.get('/user/edit',user.edit);
app.post('/user/edit',user.doEdit);
app.get('/user/delete',user.confirmDelete);
app.get('/user/delete',user.doDelete);
app.get('/logout', user.doLogout); // Logout current user

// PROJECT ROUTES
app.get('/project/edit/:id', project.edit); // Edit selected project form
app.post('/project/edit/:id', project.doEdit);// Edit selected project action
app.get('/project/delete/:id', project.confirmDelete);// Delete selected product form
app.post('/project/delete/:id', project.doDelete); // Delete selected project action
*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('No Route Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

module.exports = app;
