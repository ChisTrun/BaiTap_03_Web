const path = require('path');
const fs = require("fs");
const renderEngine  = require('../../21159')

const configViewEngine = (app) => {
    app.engine('html', async (filePath, options, callBack) => {
        await renderEngine(filePath, options, callBack);
    } );
    app.set('views', path.join('./src', 'views'));
    app.set("view engine", 'html');
}

module.exports = configViewEngine;