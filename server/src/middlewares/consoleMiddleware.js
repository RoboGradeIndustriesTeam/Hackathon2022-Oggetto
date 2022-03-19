const consoleMiddleware = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

export default consoleMiddleware;
