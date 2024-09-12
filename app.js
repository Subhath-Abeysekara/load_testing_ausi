"use strict";
exports.__esModule = true;
var express_1 = require("express");
const { init_chain_connection } = require('./chain_operations/chain');
var app = (0, express_1["default"])();
var port = 3000;
try{
    init_chain_connection()
}
finally{
    app.get('/', function (req, res) {
        res.send('Hello World!');
    });
    app.listen(port, function () {
        return console.log("Express is listening at http://localhost:".concat(port));
    });
}
