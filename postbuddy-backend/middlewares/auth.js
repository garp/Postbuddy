

import jwt from 'jsonwebtoken';
import { responseHandler } from '../utils/responseHandler.js'; 

export const verifyToken = function (req, res, next) {
  let token = req.headers.authorization;

  if (!token) {
    return responseHandler(null, res, 'Unauthorized!', 401);
  }

  try {
    if (token.startsWith('Bearer ')) {
      token = token.slice(7);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return responseHandler(null, res, 'Invalid Token!', 401);
    }

    req.user = decoded;

    next();
  } catch (ex) {
    responseHandler(null, res, ex.message || 'Internal Server Error', 401);
    next()
    throw new Error(ex.message || 'Internal Server Error');
  }
};
