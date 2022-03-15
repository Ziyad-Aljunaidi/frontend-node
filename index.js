'use strict'

// Import dependencie and set up http server
require('dotenv').config();
const request = require('request');

const
    express = require('express'),
    bodyparser = require('body-parser'),
    fs = require('fs'),
    path = require("path"),
    querystring = require('querystring'),
    app = express().use(bodyparser.json()); // Creates http server

const static_path = path.join(__dirname, "public");
// const cors=require("cors");
// const corsOptions ={
//    origin:'*', 
//    credentials:true,            //access-control-allow-credentials:true
//    optionSuccessStatus:200,
// }
// app.use(cors(corsOptions));
app.use(express.static(static_path));
app.use(express.urlencoded({ extended: true}));
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

app.use("/", express.static('./public/index.html'))

app.use("/result", express.static('./public/result.html'))