const {admin} = require("../db/index");
const jwt = require("jsonwebtoken");
const secret = require("../index");

//we use jwt as authentication because it saves you a database call.the auth we did before it made a database call to see whether the username and password exists in the db or not whereas here it just whenever the user signs in the server return it with a jwt token the jwt token is stored in the local storage in the browser and whenever the user makes a request to the backend the jwt is sent as an authentication header and verifies it whethter the jwt token was signed by that user or not using that secret jwt.verify(jwtToken,secret);

function adminMiddleware(req,res,next){ //you signin to the server with username and password and  the server returns you a jwt and then when ever you are sending any requests you send the authentication as jwt header along with other headers
    const token = req.headers.authorization; //requesting token as authorization in headers.
    const words = token.split(" "); //it makes the token split into two parts that is bearer , and then this part consists the token
    const jwtToken = words[1]; //index 1 is the token index o is the bearer
    const decodedValue = jwt.verify(jwtToken,secret);  //verifying the token with the secret see if the jwt token was signed by the user at the past that is what the secret is used for it is like the jwt password 
    if(decodedValue.username){//this means that whenver the token was created the username was encoded inside it
        req.username = decodeValue.username;
        next();
    } else {
        res.status(403).json({
            msg:"you are not authenticated!!"
        });
    }
}
