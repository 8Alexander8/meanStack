const express = require("express");
const app = express();
const mongoose = require("mongoose");
const http = require("http").Server(app);
const user = require("./routes/users");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const port = process.env.PORT || 3000;

//--------------------------------------------------------------------------------

//Mongoose Configuration
mongoose
  .connect("mongodb://localhost:27017/angular_app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((res) => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));
// Remvoe MongoDB warning error
mongoose.set("useCreateIndex", true);
//--------------------------------------------------------------------------------

//App Configuration

app.use(express.json());
app.use(cors());
// app.all("/*", function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT");
//   res.header("Access-Control-Allow-Headers", "content-type");
//   next();
// });

app.use("/api", user); //localhost:3000/api/users
// Serve static resources
var publicDir = require("path").join(__dirname, "/public");
app.use(express.static(publicDir));

//---------------------------------------------------------------------------------

//Server Listening
http.listen(port, () => {
  console.log(`server is running on port ${port} ` + new Date());
});
