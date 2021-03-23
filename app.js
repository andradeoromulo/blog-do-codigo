const express = require('express');
const app = express();

const estrategiasAutenticacao = require("./src/autenticacao/estrategias-autenticacao");

app.use(express.json());

module.exports = app;
