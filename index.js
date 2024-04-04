const express = require('express');
const port = 8002;

const app = express();
const mongoose = require('mongoose')
const db = require('./config/mongoose');

// mongoose.connect(("mongodb+srv://kanabarakshar08:AKSHAR@akshar.7qjb0c5.mongodb.net/rollbaseapi"), {
//     useUnifiedTopology: true,
//     useNewUrlParser: true
// })
//     .then(() => console.log('Database Connected'))
//     .catch((err) => console.log(err));
const Joi = require('joi');
const register = require('./model/admin');
app.use(express.urlencoded());





app.use("/admin", require('./router/admin'));

app.listen(port, (err) => {
    if (err) console.log("Something is Worng");
    console.log("Server is running :", port);
});