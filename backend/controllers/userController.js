const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken")
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
    sendToken(user,201,res);
    
})
//login user
exports.loginUser = catchAsyncErrors(async(req,res,next)=>{
    let {email,password} = req.body;
    //checking if user has given password and email both
    if(!email || !password){
        return next(new ErrorHandler("Please enter email and password",400))
    }
    // now that all this is done searching for users from the database
    const user = await User.findOne({email}).select("+password");//select because we've to match both the email and the password
    //directly can't call like the email because in user schema the password is select :false

    if(!user ){
        return next(new ErrorHandler("Invalid email or password",401));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched ){
        return next(new ErrorHandler("Invalid email or password",401));
    }
    sendToken(user,200,res);

})