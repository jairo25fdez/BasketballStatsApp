const jwt = require('jsonwebtoken');

// Token verification
let checkToken = (request, response, next) => {

    let token = request.get('token'); //Name of the token header name

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if(err){
            response.sendStatus(401);
        }
        else{
            request.user = decoded.user;

            next();
        }

    });

    

};

module.exports = {
    checkToken
}