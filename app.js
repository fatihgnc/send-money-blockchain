const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const { registerWsdl } = require('./services/user/user.service');
const soap = require('soap');
const fs = require('fs');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL, (err) => {
    if (err) return console.error(err);
    console.log('Connected to Mongo DB!');
});

const serviceObject = {
    registerService: {
        registerServiceSoapPort: {
            register: registerWsdl,
        },
        registerServiceSoap12Port: {
            register: registerWsdl,
        },
    },
};

var wsdlService = fs.readFileSync('service.wsdl', 'utf8');

// IMPORT ROUTERS
const userRouter = require('./services/user/user.router');
const bcRouter = require('./services/blockchain/blockchain.router');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ROUTES
app.use('/api/user', userRouter);
app.use('/api/blockchain', bcRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log('Express server is up on port: ' + PORT));

var serverWsdl = app.listen(8000);
var wsdl_path = '/wsdl';
soap.listen(serverWsdl, wsdl_path, serviceObject, wsdlService, (err, res) => {
    if (err) return console.log(err);
    console.log(
        'Soap server is up on PORT: 8000\n Check\n http://localhost:8000' +
            wsdl_path +
            '?wsdl\n to see if the service is working'
    );
});
