const jwt = require('jsonwebtoken');

// ==============================
//       Token verification
// ==============================
let checkToken = (request, response, next) => {

    let token = request.get('token'); //Name of the token header name

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if(err){
            response.sendStatus(401);
        }
        else{
            request.user = decoded.user;
            request.rol = decoded.user.rol;

            next();
        }

    });

    

};

// ==============================
//      Admin role verification
// ==============================

let checkAdminRole = (request, response, next) => {
    let user_rol = request.rol;

    if(user_rol == "admin"){
        next();
    }
    else{
        response.sendStatus(401);
    }

};

module.exports = {
    checkToken,
    checkAdminRole
}