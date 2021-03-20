const express = require('express');
const app = express();

const estrategiasAutenticacao = require("./src/estrategias-autenticacao");

app.use(express.json());

module.exports = app;
