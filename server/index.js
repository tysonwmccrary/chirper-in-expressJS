var path = require('path');
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');

var clientPath = path.join(__dirname, '../client');
var dataPath = path.join(__dirname, 'data.json');

var app = express();
app.use(express.static(clientPath));
app.use(bodyParser.json());

app.route('/api/chirps')
    .get(function (request, response) {
        response.sendFile(dataPath);
    }).post(function (request, response) {
        var newChirp = request.body;
        readFile(dataPath, 'utf8')
            .then(function (fileContents) {
                var chirps = JSON.parse(fileContents);
                chirps.push(newChirp);
                return writeFile(dataPath, JSON.stringify(chirps));
            }).then(function () {
                response.sendStatus(201);
            }).catch(function (error) {
                console.log(error);
                response.sendStatus(500);
            });
    });

app.listen(3000);

function readFile(filePath, encoding) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filePath, encoding, function (error, data) {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
}

function writeFile(filePath, data) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(filePath, data, function (error) {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}