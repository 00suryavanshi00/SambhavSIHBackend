let mongoose = require("mongoose");
let validator = require("validator");
let bcryptjs = require("bcryptjs");
let jwt = require("jsonwebtoken");


let userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name"],
        maxLength:[30,"Name cannot cannot 30 characters"],
        minLength:[4,"Name shoud have more than 5 characters"]
    },
    email:{
        type:String,
        required:[true,"Please enter your name"],
        unique:true,
        validate:[validator.isEmail,"Please enter a valid Email"]
    },
    password:{
        type:String,
        required:[true,"Please enter your password"],
        minLength:[8,"Name shoud have more than 8 characters"],
        select:false
    },
    avatar:{
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        },
    role:{
        type:String,
        default:"user",
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,

})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcryptjs.hash(this.password,10); // 10 is the password strength
})
//jwt tokens
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })
}
module.exports = mongoose.model("User",userSchema);