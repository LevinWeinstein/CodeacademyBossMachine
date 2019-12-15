const checkMillionDollarIdea = (req, res, next) => {
    const output = req.body.numWeeks * req.body.weeklyRevenue;

    if (!output || output < 1000000)
        res.status(400).send();
    else
        next();
};

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
