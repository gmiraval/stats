'use strict';

var redis = require('redis');

var json2html = require('node-json2html');

const express = require('express');


// Constants
const PORT = 8080;
const HOST = '0.0.0.0';


//creo cliente DB
const client = redis.createClient(); // this creates a new client

// echo redis errors to the console
client.on('error', (err) => {
    console.log("Error " + err)
});


// server
const server = express();


//usd
server.get("/usd", function(req, res) {
    //proceso parametros y en caso que no vengan los pongo en +/- inf
    let inicio;
    let fin;
    if (typeof(req.query.inicio) == 'undefined') {
        inicio = '-inf'
    } else {
        inicio = req.query.inicio
    };
    if (typeof(req.query.fin) == 'undefined') {
        fin = '+inf'
    } else {
        fin = req.query.fin
    };
    //hago consulta a redis
    client.ZRANGEBYSCORE('usd', inicio, fin, 'withscores', function(error, result) {
        if (error) {
            console.log(error);
            throw error;
        };
        //armo tabla envio html
        res.send(resToTable(result));
    });
});

//uva
server.get("/uva", function(req, res) {
    //proceso parametros y en caso que no vengan los pongo en +/- inf
    let inicio;
    let fin;
    if (typeof(req.query.inicio) == 'undefined') {
        inicio = '-inf'
    } else {
        inicio = req.query.inicio
    };
    if (typeof(req.query.fin) == 'undefined') {
        fin = '+inf'
    } else {
        fin = req.query.fin
    };
    //hago consulta a redis
    client.ZRANGEBYSCORE('uva', inicio, fin, 'withscores', function(error, result) {
        if (error) {
            console.log(error);
            throw error;
        };
        //armo tabla envio html
        res.send(resToTable(result));
    });
});




//defino donde escucha aviso a consola que esta corriendo y donde
server.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

/////
//functions
/////////
function resToTable(result) {
    //declaro array vaciyo de respuesta donde guardar los json objects
    let response = [];

    while (result.length > 0) {
        response.push({
            fecha: result.pop(),
            valor: result.pop()
        });
    };
    //usamos http://www.json2html.com/ para convertir json a html table
    //template de body html table
    var row = {
        "<>": "tr",
        "html": [{
                "<>": "td",
                "html": "${fecha}"
            },
            {
                "<>": "td",
                "html": "${valor}"
            }
        ]
    };
    //creo el contenido delo body(rows)
    var rows = json2html.transform(response, row);
    //armo el html
    var html = "<table>" + rows + "</table>";
    return html;	

}
