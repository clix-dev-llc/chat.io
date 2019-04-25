module.exports = {
  'INTERNAL_SERVER_ERROR': {
    body: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong, please try again later.',
    },
  },
  'NOT_FOUND': {
    httpStatusCode: 404,
    body: {
      code: 'NOT_FOUND',
      message: 'You lost somewhere. Please check url again.',
    },
  },
  'RESOURCE_NOT_FOUND': {
    httpStatusCode: 404,
    body: {
      code: 'RESOURCE_NOT_FOUND',
      message: 'Requested resource not found.',
    },
  },
  // firebase error
  'PERMISSION_DENIED: Permission denied': {
    httpStatusCode: 403,
    body: {
      code: 'PERMISSION_DENIED',
      message: 'You are not authorized to perform this action.',
    },
  },
  'PERMISSION_DENIED': permission => ({
    httpStatusCode: 403,
    body: {
      code: 'PERMISSION_DENIED',
      message: `You are not authorized to perform this action. It requires '${permission}' permission.`,
    },
  }),
  'UNAUTHORIZED': {
    httpStatusCode: 401,
    body: {
      code: 'UNAUTHORIZED',
      message: 'You are not authorized.',
    },
  },
  'UNAUTHORIZED_IP': {
    httpStatusCode: 401,
    body: {
      code: 'UNAUTHORIZED_IP',
      message: 'You are not authorized(IP is not whitelisted to use this API).',
    },
  },

  'TOKEN_EXPIRED': {
    httpStatusCode: 401,
    body: {
      code: 'TOKEN_EXPIRED',
      message: 'Provided authorization token has been expired. Please renew token with provider entity.',
    },
  },

  'DELETE_CONFLICT': {
    httpStatusCode: 409,
    body: {
      code: 'DELETE_CONFLICT',
      message: 'This resource has references in system so it can not be deleted. Please remove or change references',
    },
  },

  'CONFLICT': {
    httpStatusCode: 409,
    body: {
      code: 'CONFLICT',
      message: 'Duplicate resource',
    },
  },

  'DEFAULT_DELETE': {
    httpStatusCode: 409,
    body: {
      code: 'DEFAULT_DELETE',
      message: 'Default resources can not be deleted.',
    },
  },

  'INVALID_CATEGORY': {
    httpStatusCode: 400,
    body: {
      code: 'INVALID_CATEGORY',
      message: 'Category does not exist',
    },

  },
  'INVALID_REQ_OBJECTS': {
    httpStatusCode: 400,
    body: {
      code: 'INVALID_REQ_OBJECTS',
      message: 'One or more required library objects do not exist',
    },

  },
  'INVALID_REQ_MATERIAL': {
    httpStatusCode: 400,
    body: {
      code: 'INVALID_REQ_MATERIAL',
      message: 'One or more required library material do not exist',
    },

  },

  'INVALID_DATA': {
    httpStatusCode: 400,
    body: {
      code: 'INVALID_DATA',
      message: 'Provided arguments are invalid or does not exists',
    },
  },
  'NOT_IMPLEMENTED': {
    httpStatusCode: 501,
    body: {
      code: 'NOT_IMPLEMENTED',
      message: 'Server does not support the functionality required to fulfill the request.',
    },
  },
};
