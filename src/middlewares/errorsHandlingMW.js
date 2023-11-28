const { StatusCodes } = require('http-status-codes');

module.exports = {
    NotFound: (req, res, next) => {
        const err = new Error("File Not Found!");
        err.statusCode = StatusCodes.NOT_FOUND;
        next(err);
    },
    errHandling: (err, req, res, next) => {
        if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        if (err.statusCode == 404) {
            res.status(err.statusCode).render('404');
        } else {
            res.status(err.statusCode).render('500');
        }
    }
}