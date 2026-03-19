import errorCodes from '../constants/errorCodes.js';

export const responseHandler = (data, res, message, status) => {
  const statusCode = status || 200;
  res.status(statusCode).json({
    status: statusCode || 200,
    message: message || "Success",
    data: data,
  });
};

export const errorHandler = (errorMsg, res, errorCode=500) => {
  const error = errorCodes[errorCode];
  res.status(errorCode).json({
    message: errorMsg,
  });
};
