const Order = require("../models/orderModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Product = require("../models/productModel");
const accountSid = 'ACef8ea207139843e8e94bcfa5d3339790'; 
// const authToken = '65d24dba85e0f3fa150fb471d72cd734'; 
const authToken = '19e824ae39e6e05f6836c9ba202287bc'; 
const client = require('twilio')(accountSid, authToken); 


//create new order

exports.newOrder = catchAsyncErrors(async(req,res,next)=>{
    const {shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice} = req.body;

    const order = await Order.create({
        shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice,paidAt:Date.now(),
        user:req.user._id
    })
    // console.log(orderItems[0].name)
    //creating the message now
    // console.log(typeof(req.user.phoneNo));
    await sendMessage(orderItems,totalPrice,req.user.phoneNo);
    // ====================================old code================
    // client.messages 
    //   .create({   
    //      messagingServiceSid: 'MG35d485e159f95eb7b1b00b4e94d0894f',
    //      body:`Your order for ${orderItems} for the total price of ${totalPrice} is successful.`,    
    //      to: '+917488609830' 
    //    }) 
    //   .then(message => console.log(message.sid)) 
    //   .done();

    res.status(201).json({
        success:true,
        order
    })
})

//get single order details

exports.getSingleOrder = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id).populate("user","name email");


    if(!order){
        return next(new ErrorHandler("Order not found with this ID",404))
    }
    res.status(200).json({
        success:true,
        order
    })
})


//get all orders (log in required)

//get single order details
//this will be the route for the shgs
exports.myOrders = catchAsyncErrors(async(req,res,next)=>{
    const orders = await Order.find({user:req.user._id})
    res.status(200).json({
        success:true,
        orders
    })
})

//get all orders (admin) 

exports.getAllOrders = catchAsyncErrors(async(req,res,next)=>{
    const orders = await Order.find();
    // const {shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice} = req.body;
    let totalAmount = 0;
    orders.forEach(order=>{
        totalAmount+=order.totalPrice; //this shows shg admin the total amount of profit they're making from all the orders
    })

    // await messageSummary(orderItems,totalAmount,req.user.phoneNo);
    client.messages.create({
        // body:`Your order of ${orderItems[0].name} for the total price of ${totalPrice} is successful.`,
        // body:`आपका ${totalPrice} रुपये का लेन-देन हो गया है`,
        body:`नमस्ते,
        भारत सरकार स्वयं सहायता समूह के लिए क्या कई योजना निकली है | इसे जानने के लिए indiashg.gov पर जाये| धन्यवाद
        अगस्त माहे का सेल्स है
        कुल राशि: रु. ${totalAmount}
        कुल गणना: ${Object.keys(orders).length} इकाई
        
        सोना बैग: 65 यूनिट 900/यूनिट
        हल्दी मसाला: 154 यूनिट 656/किग्रा
        रागी बॉल पाउडर: 150 यूनिट 89/पैकेट
        बास्केट 15 यूनिट 80/पैकेट
        `,
        to:req.user.phoneNo,
        from:'+1 984 400 9543'
    }).then(message => console.log(message))
    .catch(error => console.log(error))
    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })
})

// async function messageSummary(orderItems,totalPrice,phoneNumber){
//     client.messages.create({
//         // body:`Your order of ${orderItems[0].name} for the total price of ${totalPrice} is successful.`,
//         // body:`आपका ${totalPrice} रुपये का लेन-देन हो गया है`,
//         body:`नमस्ते,
//         भारत सरकार स्वयं सहायता समूह के लिए काई साड़ी योजना निकली है | जाने के लिए indiashg.gov पर जाये| धन्यवाद|
//         अगस्त माहे का सेल्स है
//         कुल राशि: रु. ${totalPrice}
//         // कुल गणना: ${orderItems.length} इकाई
        
//         सोना बैग: 65 यूनिट 900/यूनिट
//         हल्दी मसाला: 154 यूनिट 656/किग्रा
//         रागी बॉल पाउडर: 150 यूनिट 89/पैकेट
//         बास्केट 15 यूनिट 80/पैकेट
//         `,
//         to:phoneNumber,
//         from:'+1 984 400 9543'
//     }).then(message => console.log(message))
//     .catch(error => console.log(error))

// }
//update order status(admin)

exports.updateOrder = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler("Order not found with this ID",404))
    }
    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("You have already delivered this order",400))
    }

   if(req.body.status === "Shipped"){
    order.orderItems.forEach(async(o)=>{
        await updateStock(o.product,o.quantity);
       })
   }

   order.orderStatus = req.body.status;

   if(req.body.status === "Delivered"){
    order.deliveredAt = Date.now()
   }

   await order.save({validateBeforeSave:false})
    res.status(200).json({
        success:true,
    })
})


async function updateStock(id,quantity){
    const product = await Product.findById(id);
    product.Stock -= quantity;

    await product.save({validateBeforeSave:false})

}

async function sendMessage(orderItems,totalPrice,phoneNumber){
    for(let i = 0;i<orderItems.length;i++){
        client.messages.create({
            // body:`Your order of ${orderItems[0].name} for the total price of ${totalPrice} is successful.`,
            // body:`आपका ${totalPrice} रुपये का लेन-देन हो गया है`,
            body:`नमस्ते
            अपने अगस्त के महिन में:
            कुल बिक्री: रु ${totalPrice}
            कुल उत्पाद बिक्री: ${orderItems[i].name} की ${orderItems[i].quantity} इकाइयाँ
            डोनेशन प्राप्त: रु 8000`,
            to:phoneNumber,
            from:'+1 984 400 9543'
        }).then(message => console.log(message))
        .catch(error => console.log(error))
    }
}





//delete orders (admin) 

exports.deleteOrder = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id)
    if(!order){
        return next(new ErrorHandler("Order not found with this ID",404))
    }
    await order.remove()
    res.status(200).json({
        success:true,
    })
})