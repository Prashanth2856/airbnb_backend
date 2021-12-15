const jwt = require("jsonwebtoken")
require("dotenv").config()

function verifyToken(token){
    return new Promise(function(resolve,reject){
        jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, same){
            if(err) {return reject(err)}
            else {return resolve(same)}
        })
    })
}

async function authenticate(req,res,next){
    //If we have recieved the bearer token in the header
    const bearerToken = req.headers.authorization;

    // If not recieved then throw an error
    if(!bearerToken || !bearerToken.startsWith("Bearer"))
    return res.status(400).send({message: "Please provide a bearer Token"})

    // else if found, We will extract the user from the token
    const token = bearerToken.split(" ")[1];
    try{
        const {user} = await verifyToken(token)
        // console.log("user:", user)

        // else we will attach the user to req
        req.user = user;
        
        // return next
        return next()
    
        //If user not found then throw an error
    } catch(err){
        return res.status(400).send({message: "Please provide a valid bearer token"})
    }

}

module.exports = authenticate;