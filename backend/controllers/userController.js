const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");

///registering a user;

exports.registerUser = catchAsyncErrors(async(req,res,next)=>{
    let {name,email,password} = req.body;
    let user = await User.create({
        name,email,password,
        avatar:{
            public_id : "This is a sample id",
            url : "sample_url"
        }


        
    })

    let token = user.getJWTToken();
    res.status(201).json({
        success:true,
        token
    })
    
})