'use strict'

const express = require('express');
const bodyParse = require('body-parser');

const app = express();

const port = process.env.PORT || 8081;


app.listen(port, () => console.log(`server running in the port ${port}`));