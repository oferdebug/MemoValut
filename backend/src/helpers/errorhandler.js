// Async handler to avoid try-catch blocks
export const handleAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// error handler middleware
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // check if response headers have already been sent to the client
  if (res.headersSent) {
    // if true, pass the error to the next error-handling middleware
    return next(err);
  }

  // set the status code of the response
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode); // set the status code of the response

  // log error stack trace to the console if not in production --> for debugging
  if (process.env.NODE_ENV !== "production") {
    console.log(err);
  }

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
