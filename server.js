'use strict';

require('dotenv').config();

// Chat application dependencies
const express 	= require('express');
const app  		= express();
const path 		= require('path');
const bodyParser 	= require('body-parser');
const flash 		= require('connect-flash');

// Chat application components
const routes 		= require('./app/routes');
const session 	= require('./app/session');
const socketServer = require('./app/event');
const logger 		= require('./app/logger');
const cors = require('cors');

const { getErrorResponse } = require('./app/utils/responseGenerator');

// CORS package
app.use(cors());

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use(session);
app.use(flash());

app.use('/', routes);

// catch 404 and forward to error handler
app.use((request, response, next) => {
  next(new Error('NOT_FOUND'));
});

// other type of errors, it *might* also be a Runtime Error
app.use((err, request, response, next) => {
  const errorResponse = getErrorResponse(err, null, request);
  response.status(errorResponse.httpStatusCode || 500).send(errorResponse.body);
});

module.exports = app;

