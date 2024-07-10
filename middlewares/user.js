const {user} = require("../db/index");
const jwt = require("jsonwebtoken");
const secret = require("../index");

function userMiddleware(req,res,next){
    const token = req.headers.authorization;
    const words = token.split(" ");
    const jwtToken = words[1];
    const decodedValue = jwt.verify(jwtToken,secret);
    if(decodedValue.username){
        req.username = decodedValue.username; //if decodevalue.username that means if decodedvalue is there and username also there then the request req.username is the decodedvalue.username that is the username stored in the jwt and when the user will send any request to the backend it can send the jwt token and if the username sends another username then in the normal case it would bypass it and with another username and using that authorized jwt token it would have gained access to our webiste but using the line of code we worte it prevents the user to authenticate using the authenticated jwt and another username decodedvalue.username will be asked from the user on each request that is the username encoded in the jwt
        next();
    } else {
        res.status(403).json({
            msg:"you are not authenticated!!"
        });
    }
}
