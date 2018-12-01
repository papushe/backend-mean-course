const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect("mongodb+srv://pap:" + process.env.MONGO_ATLAS_PW + "@cluster0-hixgg.mongodb.net/node-angular")
    .then(() => {
        console.log('Connected to database!');
    })
    .catch((e) => {
        console.log('Connection failed! ' + e);
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-Width, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, PUT, OPTIONS");
    next();
});

app.use('', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});
app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);

module.exports = app;
