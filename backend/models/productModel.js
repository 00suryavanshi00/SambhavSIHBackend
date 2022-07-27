const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type : String,
        required:[true,"Please enter product name"],
        trim : true
    },
    description:{
        type:String,
        required:[true,"Please Enter product Description"]
    },
    price:{
        type:Number,
        required:[true,"Please Enter product price"],
        maxLength:[8,"Price cannot exceed 8 characters"]
    },
    rating:{
        type:Number,
        default:0
    },
    images:[
        {
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }
    ],
    category:{
        type:String,
        required:[true,"Enter product category"],
        
    },
    Stock:{
        type:Number,
        required:[true,"Please Enter product Stock"],
        maxLength:[3,"Stock cannot exceed 3 characters"],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            name:{
                type:String,
                required:true,
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    createdAt:{
        type : Date,
        default : Date.now
    }
})

module.exports = mongoose.model("Product",productSchema);