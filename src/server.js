// @ts-check
'use strict';

const app = require('./index');

const port = Number(process.env.PORT) ?? 3000;

app.listen(port);
