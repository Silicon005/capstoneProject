const sessionTimeoutMiddleware = (req, res, next) => {
    if (req.session) {
      const SESSION_TIMEOUT = 48 * 60 * 60 * 1000; 
  
      if (!req.session.lastActivity) {
        req.session.lastActivity = Date.now();
      } else {
        const timeElapsed = Date.now() - req.session.lastActivity;
        if (timeElapsed > SESSION_TIMEOUT) {
          req.session.destroy((err) => {
            if (err) {
              console.error("Error destroying session:", err);
            }
          });
          return res.status(401).json({ message: "Session expired. Please log in again." });
        }
        req.session.lastActivity = Date.now();
      }
    }
    next();
  };
  
  module.exports = sessionTimeoutMiddleware;