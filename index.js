const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
const JWT_SECRET = "srinjoy_server";

app.use(bodyParser.json());
app.use(express.json());

app.use('/admin', adminRouter);
app.use('/user', userRouter);

const PORT= 3000;

app.listen(PORT,function(){
    console.log(`server is running on port ${PORT}`);
});

module.exports = JWT_SECRET;
