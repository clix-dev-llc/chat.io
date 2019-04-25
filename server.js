'use strict';

// Chat application dependencies
const express 	= require('express');
const app  		= express();
const path 		= require('path');
const bodyParser 	= require('body-parser');
const flash 		= require('connect-flash');

// Chat application components
const routes 		= require('./app/routes');
const session 	= require('./app/session');
const passport    = require('./app/auth');
const ioServer 	= require('./app/socket')(app);
const logger 		= require('./app/logger');

// Set the port number
const port = process.env.PORT || 3000;
const { getErrorResponse } = require('./app/utils/responseGenerator');

// View engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use(session);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', routes);

// Middleware to catch 404 errors
app.use(function(req, res, next) {
  res.status(404).sendFile(process.cwd() + '/app/views/404.htm');
});

// catch 404 and forward to error handler
app.use((request, response, next) => {
  response.status(404).send(getErrorResponse(new Error('NOT_FOUND')).body);
});

// other type of errors, it *might* also be a Runtime Error
app.use((err, request, response, next) => {
  const errorResponse = getErrorResponse(err, null, request);
  response.status(errorResponse.httpStatusCode || 500).send(errorResponse.body);
});

ioServer.listen(port);