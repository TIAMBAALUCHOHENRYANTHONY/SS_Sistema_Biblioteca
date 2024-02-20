const express = require('express')
const app = express()
const port = 5000
const routes = require('./routes/routes')
const cors = require('cors');
require('dotenv').config();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use('/', routes);

app.listen(port, () => {
    console.log(`Autentication Api listening on port ${port}`)
})