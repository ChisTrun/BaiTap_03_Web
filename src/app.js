const express = require('express');
const path = require('path');
const configViewEngine = require('./configs/viewEngine');
const configStaticResource = require('./configs/staticResrouce');
const webRouter = require('./routes/web.r');
const apiRouter = require('./routes/api.r')
const { NotFound, errHandling } = require('./middlewares/errorsHandlingMW')
require('dotenv').config();

const app = express();
const port = process.env.MY_PORT;

configViewEngine(app);
configStaticResource(app);

app.use(express.urlencoded({extended: true}));
app.use(webRouter);
app.use('/api',apiRouter);
app.use(NotFound);
app.use(errHandling);


app.listen(port, () => { console.log(`Server is listening on port number ${port}`) })
