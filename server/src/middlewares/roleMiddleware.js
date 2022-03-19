const roleMiddleware = (role) => {
  return (req, res, next) => {
    const user = req.user;

    if (user.role === role) {
      next();
    } else {
      return res.status(403).json({ error: 2 });
    }
  };
};

export default roleMiddleware;
