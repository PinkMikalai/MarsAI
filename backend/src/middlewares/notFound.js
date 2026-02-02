
//si aucune route trouvé on tombe dedans!

module.exports = (req, res)=>{
    console.log("ressource not found");
    res.status(404).json({
        success: false,
        message:'ressource not found',
        data: null
    });
};