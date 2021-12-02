var express = require('express');
var app = express();
var fs = require("fs");
const signalR = require("@microsoft/signalr");

var vUri = "http://a112.thebetmarket.com/SignalR";


app.get('/', function (request, response) {

    var connection = new signalR.HubConnectionBuilder()
        .configureLogging(signalR.LogLevel.Trace)
        .withUrl(vUri)
        .withAutomaticReconnect()
        .build();


    connection.on('Rate', function (marketrate) {

        const data = JSON.stringify(marketrate,null, 4);
        response.write(data);

        try {
            fs.writeFileSync('output.json', data);
            console.log("JSON data is saved.");
        } catch (error) {
            console.error(err);
        }

    });


    connection.start()
        .then(() => connection.invoke('ConnectMarketRate', "273205"))
        .catch(error => {
            console.error(error.message);
        });
        

});

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})