(async () => {
    const express = require('express');
    const app = express();

    const apiRouter = require('./routes/api');

    app.use('/api', apiRouter);

    app.all('/', (_req: any, res: any) => {
        res.writeHead(301,{Location: '/api'});
        res.end();
    })

    app.listen(3000, () => console.log('Server has started.'));
})();