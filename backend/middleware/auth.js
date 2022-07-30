const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
// const userModel = require("../models/userModel");
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncErrors(async(req,res,next)=>{
    let {token} = req.cookies; //token stored in cookie while login
    if(!token){
        return next(new ErrorHandler("Please login to access this resource",401))
    }

    let decodedData = jwt.verify(token,process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    next();
})


exports.authorizeRoles = (...roles)=>{
    
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(
                new ErrorHandler(
                    `Role : ${req.user.role} is not allowed to access this resource`
                    ,403))
        }

        next();
    }
}

// exports.authorizeSHGAdmin = (...roles)=>{
    
//     return(req,res,next)=>{
//         if(!roles.includes(req.user.role)){
//             return next(
//                 new ErrorHandler(
//                     `Role : ${req.user.role} is not allowed to access this resource`
//                     ,403))
//         }

//         next();
//     }
// }