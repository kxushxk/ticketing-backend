import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    
    // Checks if your frontend Axios instance attached the Bearer token header string
    if (token && token.startsWith('Bearer')) {
      token = token.split(' ')[1]; // Extracts the raw token characters out of the string
      
      // Decrypts the token using your unique personal JWT_SECRET key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attaches the user payload data (id and role) directly to the Express request object
      req.user = decoded; 
      next(); // Passes validation and lets the request continue to the controller logic
    } else {
      res.status(401).json({ message: 'Not authorized, access token missing' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, access token validation failed' });
  }
};

// Security wrapper to verify if the logged-in user matches specific role definitions
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Role (${req.user.role}) is unauthorized to access this path` });
    }
    next();
  };
};