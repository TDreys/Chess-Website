const express = require('express');
const path = require('path')
const http = require('http')
const gameSocket = require('./controllers/gameSocket.js')

const PORT = 5000 || process.env.PORT;

//init server
const app = express();
const server = http.createServer(app)
app.use(express.static(path.join(__dirname,'client/build')))
server.listen(PORT)
gameSocket.createSocket(server)

app.get('/' , function(req,res){
    res.sendFile(path.join(__dirname,'client/build/index.html'));
})

