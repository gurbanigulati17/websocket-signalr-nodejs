var express = require('express');
var app = express();
var fs = require("fs");
const colors = require('colors');
const signalR = require("@microsoft/signalr");
const { type } = require('os');


var vUri = "http://a112.thebetmarket.com/SignalR";


function renameKey ( obj, oldKey, newKey ) {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
}

app.get('/', function (request, response) {

    var connection = new signalR.HubConnectionBuilder()
        .configureLogging(signalR.LogLevel.Trace)
        .withUrl(vUri)
        .withAutomaticReconnect()
        .build();


    connection.on('Rate', function (marketrate) {
        
       const data = JSON.stringify(marketrate,null, 4);
       response.write(data);

       const marketData = marketrate;
    
        try {
            
            fs.writeFileSync(marketrate["mi"]+'.json', JSON.stringify(marketData,null, 4));
            console.log(`${marketrate["mi"]} JSON data is saved.`.green);

        } catch (error) {
            console.error(error);
        }

    });


    connection.start()
        .then(function (vobj){

            fs.readFile('input.json', (err, data) => {
                
                if (err) throw err;
                
                let marketIds = JSON.parse(data);
                
                for(var id in marketIds){
                    connection.invoke('ConnectMarketRate', marketIds[id]['pmid']);
                }               

            });
        })
        .catch(error => {
            console.error(error.message);
        });
        

});

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})