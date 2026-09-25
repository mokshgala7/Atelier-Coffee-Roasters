export function errorMiddleware(error, _request, response, _next) {
  // Mongoose CastError (e.g. invalid ObjectId)
  if (error.name === 'CastError') {
    return response.status(400).json({
      success: false,
      message: `Invalid format for field '${error.path}'`
    });
  }

  // Mongoose Duplicate Key Error (code 11000)
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue || {})[0] || 'field';
    return response.status(409).json({
      success: false,
      message: `Duplicate entry for ${field}. That value is already taken.`
    });
  }

  // Mongoose ValidationError
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors || {}).map((e) => e.message);
    return response.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: messages
    });
  }

  // JWT Errors
  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    return response.status(401).json({
      success: false,
      message: 'Authentication token is invalid or expired'
    });
  }

  const statusCode = error.statusCode || error.status || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  return response.status(statusCode).json({
    success: false,
    message: isProduction && statusCode === 500 ? 'An unexpected server error occurred' : error.message
  });
}

