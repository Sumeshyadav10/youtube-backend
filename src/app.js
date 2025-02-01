const cookieParser = require('cookie-parser')
const Cors = require('cors')
const express = require('express')

const app = express()

app.use(Cors(
    {
        origin: 'http://localhost:5000',
        credentials: true
    }
))

// Middleware to parse JSON
app.use(express.json()); // This is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.urlencoded({ extended: true })); // This is a built-in middleware function in Express. It parses incoming requests with urlencoded payloads and is based on body-parser.
app.use(express.static('public')); // This is a built-in middleware function in Express. It serves static files and is based on serve-static.

// Middleware to parse cookies
app.use(cookieParser()); // This is a third-party middleware function in Express. It parses cookies attached to the client request object.