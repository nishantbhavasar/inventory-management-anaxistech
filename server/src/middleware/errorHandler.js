// Global Error Handler
export const errroHandler = (error, req, res, next) => {
  return res.status(error.status || 500).json({
    success: false,
    statusCode: error.status ?? 500,
    message: error.message ?? "Internal Server Error",
    data: null,
  });
};

// 404 Api Not Found Error Handler
export const handle404 = (req, res, next) => {
  return res.status(404).json({
    statusCode: 404,
    message: "Route Not Found",
    success: false,
    data: null,
  });
};
