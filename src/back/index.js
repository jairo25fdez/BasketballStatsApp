const club_methods = require('./database/API/club_methods.js');

module.exports = function(app){
    
    

    const mongoose_util = require('./database/mongoose_util.js');

    
    //Importamos los schemas de MongoDB
    //let User = require('./database/models/user.js');
    //let Team = require('./database/models/team.js');

    //Connection to DB.
    mongoose_util.connectDB();

    //Initialize API methods.
    club_methods(app);



}