const jwt = require('jsonwebtoken')

const authMiddleware = (req,res,next)=>{
    const token = req.headers.authorization.split(" ")[1]
    if(!token){
        console.log("No token provided")
    }
    else{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user= decoded
        next()
    }
}
module.exports = authMiddleware