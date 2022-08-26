const express = require("express");
const errorMiddleware = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
// const corsOptions = {
//   origin: "http://localhost:4000",
//   credentials: true, //access-control-allow-credentials:true
//   optionSuccessStatus: 200,
// };
app.use(cors());

app.use(express.json());
app.use(cookieParser());
// app.use()
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
app.use("/api/v1", product);
app.use("/api/v1/", user);
app.use("/api/v1", order);

//middleware for error
app.use(errorMiddleware);

module.exports = app;
