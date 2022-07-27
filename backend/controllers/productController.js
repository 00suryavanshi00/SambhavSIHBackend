const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");


//create product == admin route
exports.createProduct = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.create(req.body);

    res.status(201).json({
        success:true,
        product
    });
});

//get all products
exports.getAllProducts = catchAsyncErrors(async (req,res)=>{

    let resultPerPage = 5;
    let productCount = await Product.countDocuments();
    console.log(productCount)
    const apifeature = new ApiFeatures(Product.find(),req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
    const products = await apifeature.query;
    res.status(200).json({
        success:true,
        products
    })
})
// get product details individually

exports.getProductDetails = catchAsyncErrors(async(req,res,next)=>{

    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    res.status(200).json({
        success:true,
        product
        
    })
})

// update products == admin route

exports.updateProduct = catchAsyncErrors(async(req,res,next)=>{
    let product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        sucess:true,
        product
    })
})

exports.deleteProduct = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    await product.remove();

    res.status(200).json({
        success:true,
        message:"product deleted successfully"
    })
})


