const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const errorhandler = require('errorhandler');

require('dotenv').config()

const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));
app.use(express.static(__dirname + '/public'));

// db
mongoose.set('useCreateIndex', true);

if(isProduction){
  mongoose.connect(process.env.MONGODB_URI);
} else {
  app.use(errorhandler());
  mongoose.connect(process.env.MONGODB_URI_DEV, { useNewUrlParser: true });
  mongoose.set('debug', true);
}

require('./models/User');
require('./models/Link');
require('./config/passport');

app.use(require('./routes'));

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use(function(err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({'errors': {
      message: err.message,
      error: err
    }});
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({'errors': {
    message: err.message,
    error: {}
  }});
});

app.listen(port, () => {
  console.log('Server running in http://localhost:3000');
})
