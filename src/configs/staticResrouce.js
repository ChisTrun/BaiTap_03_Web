const express = require('express');
const path = require('path');

const configStaticResource = (app) => {
    app.use(express.static(path.join('./src','public')));
}

module.exports =  configStaticResource;