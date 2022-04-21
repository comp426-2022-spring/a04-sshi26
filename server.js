// Require Express.js
const express = require('express')
const fs = require("fs");
const morgan = require("morgan");
const app = express()

// Require minimist module
const args = require('minimist')(process.argv.slice(2))
// See what is stored in the object produced by minimist
console.log(args)
// Store help text 
const help = (`
server.js [options]

--port	Set the port number for the server to listen on. Must be an integer
            between 1 and 65535.

--debug	If set to true, creates endlpoints /app/log/access/ which returns
            a JSON access log from the database and /app/error which throws 
            an error with the message "Error test successful." Defaults to 
            false.

--log		If set to false, no log files are written. Defaults to true.
            Logs are always written to database.

--help	Return this message and exit.
`)
// If --help or -h, echo help text to STDOUT and exit
if (args.help || args.h) {
    console.log(help)
    process.exit(0)
}

const {db} = require('./database.js');


let portNumber = args.port
let isDebug = args.debug
let isLog = args.log 



app.use( (req, res, next) => {
    
    let logdata = {
        remoteaddr: req.ip,
        remoteuser: req.user,
        time: Date.now(),
        method: req.method,
        url: req.url,
        protocol: req.protocol,
        httpversion: req.httpVersion,
        status: res.statusCode,
        referer: req.headers['referer'],
        useragent: req.headers['user-agent']
    }
    const sqlStatement = `INSERT INTO accesslog (remoteaddr)
        values (1234)`; 
    db.prepare(sqlStatement).run(); 

    const data = db.prepare("SELECT * FROM accesslog").all(); 
    res.locals.data = data; 
    console.log(data); 

    next();
})

// Import coin functions 
const {flipAgainstSide, flipOneCoin, manyflips} = require('./coin.js');

// Start an app server
const server = app.listen(portNumber, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%', portNumber))
});

app.get('/app/', (req, res) => {
    // Respond with status 200
        res.statusCode = 200;
    // Respond with status message "OK"
        res.statusMessage = 'OK';
        res.writeHead( res.statusCode, { 'Content-Type' : 'text/plain' });
        res.end(res.statusCode+ ' ' +res.statusMessage)
    });


// app.get('/app/error', (req, res) => {
//     res.send("Error test successful.");
// });

app.get('/app/error', (req, res) => {
    throw new Error('Error test successful.') // Express will catch this on its own.
    })

app.get('/app/log/access', (req, res) => {
    res.send(res.locals.data);
});

// /app/flip/ endpoint 
app.get('/app/flip/', (req, res) => {
  res.send(flipOneCoin()); 
}) 

app.get('/app/flips/:number', (req, res) => {
    const flips = manyflips(req.params.number)
    res.send(flips); 
});

app.get('/app/flip/call/heads', (req, res) => {
    let heads = "heads"; 
    const answer = flipAgainstSide(heads);
    res.send(answer); 
});

app.get('/app/flip/call/tails', (req, res) => {
    let tails = "tails"; 
    const answer = flipAgainstSide(tails)
    res.send(answer); 
});

// Default response for any other request
app.all('*', function(req, res){
  res.status(404).send('404 NOT FOUND')
});


if (isLog) {
    // Use morgan for logging to files
    // Create a write stream to append (flags: 'a') to a file
    const WRITESTREAM = fs.createWriteStream('FILE', { flags: 'a' })
    // Set up the access logging middleware
    app.use(morgan('FORMAT', { stream: WRITESTREAM }))
}


