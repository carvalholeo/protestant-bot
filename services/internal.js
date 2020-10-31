'use strict';
const axios = require("axios").default;

const base_url = process.env.BASE_URL;
const port = process.env.PORT;
const url = `${base_url}:${port}`

const options = {method: 'POST', url};

axios.request(options);

module.exports = axios;
