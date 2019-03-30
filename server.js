var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var usernames = [];

server.listen(8000);
console.log('server listening.....');

app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html');
})

io.sockets.on('connection',(socket)=>{
    console.log('socket connected......')

    socket.on('new user',(data,callback)=>{
        if(usernames.indexOf(data) != -1){
            callback(false);
        }else{
            callback(true);
            socket.username = data;
            usernames.push(socket.username);
            updateUsernames();
        }
    })
    //update usernames
    function updateUsernames(){
        io.sockets.emit('usernames',usernames);
    }


    //sending message
    socket.on('send message',(data)=>{
        io.sockets.emit('new message',{msg:data,user:socket.username});
    });

    //disconnect event
    socket.on('disconnect',(data)=>{
        if(!socket.username){
            return;
        }
        usernames.splice(usernames.indexOf(socket.username), 1);
        updateUsernames();
    })
})