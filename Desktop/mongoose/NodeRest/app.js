const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRouter = require('./api/routes/user');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
  
    // authorized headers for preflight requests
    // https://developer.mozilla.org/en-US/docs/Glossary/preflight_request
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept ,X-Requested-With,token',
    );
    next();
    app.options('*', (req, res) => {
      // allowed XHR methods
      res.header(
        'Access-Control-Allow-Methods',
        'GET, PATCH, PUT, POST, DELETE, OPTIONS',
      );
      res.send();
    });
  });

app.use('/user', userRouter);
mongoose.connect('http://mongodb-test.192.168.99.100.nip.io/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error)
})
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})
module.exports = app;