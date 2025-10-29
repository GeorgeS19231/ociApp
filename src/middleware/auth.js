import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';


export const auth = async (req, res, next) => {
  try {
    if (!req.header('Authorization')) {throw new Error('Please authenticate.');}
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE
    });

    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    if (user) {
      if (user.verificationToken && !user.isVerified) {
        throw new Error('Please verify your email before logging in.');
      }
      req.user = user;
      req.token = token;
      req.sessionId = decoded.sessionId;  // Include sessionId in request for potential use
      next();
    } else {
      throw new Error('Invalid token');
    }
  } catch (error) {
    // If token is expired or invalid, try to clean it up from database
    if (error.name === 'TokenExpiredError') {
      try {
        const token = req.header('Authorization').replace('Bearer ', '');
        // Decode without verification to get user ID and sessionId
        const decoded = jwt.decode(token);
        if (decoded && decoded._id) {
          // Remove expired token and its corresponding refresh token by sessionId
          await User.updateOne(
            { _id: decoded._id },
            {
              $pull: {
                tokens: { token: token },
                refreshTokens: { sessionId: decoded.sessionId }
              }
            }
          );
        }
      } catch (cleanupError) {
        // Cleanup failed, but that's ok, continue with auth error
      }
    }

    res.status(401).send({ error: 'Please authenticate.' });
  }
};