const validate = require('express-validation');
const ErrorCodes = require('./errorCodes');

const getFullURL = (req => `${req.protocol}://${req.get('host')}${req.originalUrl}`);

module.exports = {
  getErrorResponse: (err, payload, req) => {
    if (err instanceof validate.ValidationError) {
      return module.exports.validationError(err);
    }
    if (req) {
      err.url = getFullURL(req);
      err.data = req.body;
    }
    return module.exports.generateErrorResponse(err.message, payload);
  },

  generateErrorResponse: (code, payload) => {
    if (payload) return ErrorCodes[code](payload) || ErrorCodes.INTERNAL_SERVER_ERROR;
    return ErrorCodes[code] || ErrorCodes.INTERNAL_SERVER_ERROR;
  },

  validationError: (err) => {
    const error = err.errors.map(e => ({
      location: e.location,
      messages: e.messages,
      field: e.field[0],
    }));
    return {
      httpStatusCode: err.status,
      body: {
        code: 'VALIDATION_ERROR',
        error,
      },
    };
  },
};
