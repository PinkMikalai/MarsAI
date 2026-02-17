const errorMiddleware = (err, req, res) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({
        status: "error",
        message: message
    });
};

export default errorMiddleware;
