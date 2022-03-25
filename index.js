'use strict'

// Import dependencie and set up http server
require('dotenv').config();
const request = require('request');
//const fetch = require("node-fetch");
const fetch = require("node-fetch");

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

app.use("/appointment", express.static('./public/appointment.html'))
app.use("/confirmation", express.static('./public/confirmation.html'))

app.use("/signin", express.static('./public/signin.html'))
app.post("/appointment", (req,res) => {
    try {
        res.json([{
            data: req.body.data
         }]);
        
    } catch (error) {
        console.log(error);
    }

    console.log(req.query)
})

app.post("/confirmation_data", (req, res) => {
    try {
        res.json([{
            data: req.body.data
         }]);
        
    } catch (error) {
        console.log(error);
    }

    //console.log(req.query)
})

app.get("/form", (req, res) => {
    let queries = req.query
    let user_name = queries.user_name
    let user_phone = queries.user_phone
    let user_date = queries.user_date
    let doc_id = queries.doc_id
    fetch(`https://us-central1-medica72-5933c.cloudfunctions.net/api/verify?user_name=${user_name}&user_phone=${user_phone}&user_date=${user_date}&doc_id=${doc_id}`)
})
