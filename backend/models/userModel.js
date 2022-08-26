let mongoose = require("mongoose");
let validator = require("validator");
let bcryptjs = require("bcryptjs");
let jwt = require("jsonwebtoken");
let crypto = require("crypto")

let userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name"],
        maxLength:[30,"Name cannot cannot 30 characters"],
        minLength:[4,"Name shoud have more than 5 characters"]
    },
    noOfMembers:{
        type:Number,
        default:1,
        required:false
    },
    email:{
        type:String,
        required:[true,"Please enter your name"],
        unique:true,
        validate:[validator.isEmail,"Please enter a valid Email"]
    },
    phoneNo:{ //phone no has been added
        type:String,
        unique:true,
        required:[true,"Please enter your phone number so we can reach you"]
    },
    password:{
        type:String,
        required:[true,"Please enter your password"],
        minLength:[8,"Name shoud have more than 8 characters"],
        select:false
    },
    shgId:{
        type:String,
        default:null,
        required:[false]
    },
    aadharNumber:{
        type:String,
        required:[false],
    },
    city:{
        type:String,
        required:[true,"Please enter your city"]
    },
    requested:{
        type:Boolean,
        required:[false],
        default:false
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

//comparing the password now for login

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcryptjs.compare(enteredPassword,this.password)
}

//reseting the password
userSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString("hex");
    //hashing and adding to userschema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 15*60*1000;

    return resetToken
}

module.exports = mongoose.model("User",userSchema);
