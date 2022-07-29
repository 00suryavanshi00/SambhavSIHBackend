const express = require("express");
const errorMiddleware = require("./middleware/error")
const app = express();
const cookieParser = require("cookie-parser")

app.use(express.json());
app.use(cookieParser());
// app.use()
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute")
app.use("/api/v1",product);
app.use("/api/v1/",user);
app.use("/api/v1",order);

//middleware for error
app.use(errorMiddleware);


module.exports = app