
const isAuthenticatedV = (req, res, next) => {
    if (req.isAuthenticatedV()) {
      return next(); // User is authenticated, proceed to the next middleware/route handler
    }
    
    // If not authenticated, return a 401 Unauthorized response
    return res.status(401).json({ message: "Unauthorized access. Please log in." });
  };
  
  module.exports = isAuthenticatedV;
  