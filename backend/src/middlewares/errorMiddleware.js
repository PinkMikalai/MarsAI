// gestion globale des erreurs
const errorMiddleware = (err, req, res) => {
    // Si l'erreur n'a pas de status (ex: une erreur SQL imprévue), on met 500
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";

    // On répond au client au format JSON
    res.status(status).json({
        status: "error",
        message: message
    });
};

module.exports = errorMiddleware;