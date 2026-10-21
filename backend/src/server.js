Object.fromEntries = l => l.reduce((a, [k,v]) => ({...a, [k]: v}), {})

console.log('Starting server...');

try {
    // connect database
    console.log('Connect database...');
    const dbConnection = require('./config/database');

    // create server
    const HTTP_PORT = 8000;
    const express = require('express');
    const fileUpload = require('express-fileupload');
    const cors = require('cors');
    const morgan = require('morgan');

    console.log('Creating and configuring Web Server...');
    const app = express();

    // provide service router with database connection / store the database connection in global server environment
    app.locals.dbConnection = dbConnection;

    console.log('Binding middleware...');
    // setting folder for static files like images, pdfs aso
    app.use(express.static(__dirname + '/public'));
    // defining file upload limit
    app.use(fileUpload({
        createParentPath: true,
        limits: {
            fileSize: 2 * 1024 * 1024 * 1024        // limit to 2MB
        }
    }));
    app.use(cors());
    app.use(express.urlencoded({ extended: true}));
    app.use(express.json());
    // setting additional headers
    app.use(function(request, response, next) {
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
    app.use(morgan('dev'));

    // binding endpoints
    const TOPLEVELPATH = '/api';
    console.log('Binding enpoints, top level Path at ' + TOPLEVELPATH);
    app.use(TOPLEVELPATH + '/books', require('./routes/books.routes'));
    // send default error message if no matching endpoint found
    app.use(function (request, response) {
        console.log('Error occured, 404, resource not found');
        response.status(404).json({'fehler': true, 'nachricht': 'Resource nicht gefunden'});
    });

    app.use(function (error, request, response, next) {
        console.error(error);
        response.status(500).json({'fehler': true, 'nachricht': 'Internal server error'});
    });


    // starting the Web Server
    console.log('\nBinding Port and starting Webserver...');

    var webServer = app.listen(HTTP_PORT, () => {
        console.log('Listening at localhost, port ' + HTTP_PORT);
        console.log('\nUsage: http://localhost:' + HTTP_PORT + TOPLEVELPATH + '/books');
        console.log('\n\n-----------------------------------------');
        console.log('exit / stop Server by pressing 2 x CTRL-C');
        console.log('-----------------------------------------\n\n');
    });

} catch (ex) {
    console.error(ex);
}
