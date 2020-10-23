const express = require('express');
const apiRouter = express.Router();

apiRouter.route('/').all((_req: any, res: any) => {
    res.statusCode = 200;
    res.end("Hello it's zoom simple rest api integeration, in order to list all endpoint make a GET request on '/api/list' ");
});

module.exports = apiRouter;