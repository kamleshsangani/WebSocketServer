const WebSocket = require('ws')
const express = require('express')
const moment = require('moment')
const app = express()
const port = process.env.PORT || 7878; //port for https

app.get('/myapp/chat/', (req, res) => {
    res.send("Hello World from WebSocket Server 2");
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
var  webSockets = {}

const wss = new WebSocket.Server({ port: 6060 }) //run websocket server with port 6060
wss.on('connection', function (ws, req)  {
    console.log('URL:' + req.url)
    var userID = req.url.substr(1) //get userid from URL ip:6060/userid
    webSockets[userID] = ws //add new user to the connection list

    console.log('User ' + userID + ' Connected ')

    ws.on('message', message => { //if there is any message
        console.log(message);
        var datastring = message.toString();
        if(datastring.charAt(0) == "{"){
            datastring = datastring.replace(/\'/g, '"');
            var data = JSON.parse(datastring)
            if(data.auth == "chatapphdfgjd34534hjdfk"){
                if(data.cmd == 'send'){
                    console.log(data.userid);
                    var boardws = webSockets[data.userid] //check if there is reciever connection
                    if (boardws){
                        var cdata = "{'cmd':'" + data.cmd + "','userid':'"+data.userid+"', 'msgtext':'"+data.msgtext+"'}";
                        boardws.send(cdata); //send message to reciever
                        console.log(data.cmd + ":success");
                        ws.send(data.cmd + ":success");
                    }else{
                        console.log("No reciever user found.");
                        ws.send(data.cmd + ":error");
                    }   
                }else{
                    console.log("No send command");
                    ws.send(data.cmd + ":error");
                }
            }else{
                console.log("App Authincatnmion error");
                ws.send(data.cmd + ":error");
            }
        }else{
            console.log("Non JSON type data");
            ws.send(data.cmd + ":error");
        }
    })

    ws.on('close', function () {
        var userID = req.url.substr(1)
        delete webSockets[userID] //on connection close, remove reciver from connection list
        console.log('User Disconnected: ' + userID)
    })
    
    ws.send('connected'); //innitial connection return message
})
