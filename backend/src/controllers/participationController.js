

async function addParticipation(req, res) {
    console.log("je teste ma route addParticipation");
    const test = req.body; 
    console.log(test);

    return res.status(200).json({
        success: true,
        data: test
    })
    
}

module.exports = {
    addParticipation
}