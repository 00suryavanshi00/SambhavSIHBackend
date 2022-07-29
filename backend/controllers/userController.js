const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken")
const sendEmail = require("../utils/sendEmail.js")
const crypto = require("crypto");
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


//logout user

exports.logout = catchAsyncErrors(async(req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly : true
    })
    res.status(200).json({
        success:true,
        message:"Logged out successfully"
    })
})

//forgot password

exports.forgotPassowrd = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("User not found",404));
    }
    //get reset password token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave:false});

    let resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    let message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email 
    then please ignore it`;

    try{
        await sendEmail({
            email:user.email,
            subject:`Sambhav password recovery`,
            message,
        })

        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`
        })

    }catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave:false})
        return next(new ErrorHandler(error.message,500));
    }

})

exports.resetPassowrd = catchAsyncErrors(async(req,res,next)=>{
    //creating token hash
    let resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    let user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()},
    })

    if(!user ){
        return next(new ErrorHandler("Reset password token is invalid or expired",400));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password doesn't match",400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;


    await user.save();
    sendToken(user,200,res);
})

//get user details
exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user,
    })
})

//update user password

exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password")
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if(!isPasswordMatched ){
        return next(new ErrorHandler("Old password is incorrect",400));
    }

    if(req.body.newPassword != req.body.confirmPassword){
        return next(new ErrorHandler("Password doesn't match",400));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user,200,res);
})

exports.updateUserProfile = catchAsyncErrors(async(req,res,next)=>{
    const newUserData = {
        name : req.body.name,
        email : req.body.email,
    }

    //add cloudenary later

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
   res.status(200).json({
    success:true,
   })
})

