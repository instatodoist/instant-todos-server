const createError = require('./create');

module.exports = (err, req, res, next, isExpressSpecificError = false) => {
  const {
    name, message, locations, path, extensions = {}
  } = err;
  const { code = 'ValidationError' } = extensions;
  let response = {
    status: 500,
    message: 'Something went wrong, Please try again.',
    code
  };
  // Error specific to Express only
  if (typeof (isExpressSpecificError) !== 'undefined' && isExpressSpecificError) {
    if (message === 'INVALID_GRANT') {
      // Error specific to custom Auth JWT Middleware
      const error = createError(err.message);
      res.statusCode = 401;
      response = { ...error };
    } else if (name === 'TokenExpiredError') {
      // Error specific to library JWT if token expired
      const error = createError(name);
      res.statusCode = 401;
      response = { ...error };
    } else if (name === 'JsonWebTokenError') {
      // Error specific to library JWT if token invalid
      const error = createError('INVALID_GRANT');
      res.statusCode = 401;
      response = { ...error };
    } else {
      response = { ...response };
    }
    // winston.error(`${response.status || 500} - ${response.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    return res.json(response);
  }
  // Error specific to Graphql
  if (name === 'GraphQLError') {
    const error = createError(message, code);
    response = {
      statusCode: error.status,
      ...error
    };
  }
  response = { ...response, locations, path };
  return response;
};
