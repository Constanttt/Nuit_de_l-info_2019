var express = require('express');
var app = express();

//let http = require('http');
let fs = require('fs');
let path = require('path');

let headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Max-Age': 2592000 // 30 days
  };

var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use('/js',express.static(__dirname+'/www/js'));
app.use('/css',express.static(__dirname+'/www/css'));

app.get('/',function(req,res){
    res.sendFile(__dirname+ '/www' +'/index.html');
});

server.listen(3000,function(){ // Listens to port 3000
    console.log('Listening on '+server.address().port);
});

var usernames = {};

var rooms = ['chan1','chan2'];

io.on('connection', function(socket){

    socket.on('adduser', function(nick){
        socket.username = nick;
        socket.room = 'chan1';
        usernames[nick] = nick;
        socket.join('chan1');
        socket.emit('showText', 'SERVER', 'Tu est connecté sur '+ socket.room);
        socket.broadcast.to('chan1').emit('showText', 'SERVER', nick + ' c\'est connecté');
        //socket.emit('updaterooms', rooms, 'chan1');
    });

    socket.on('sendMsg', function(m){
        //socket.broadcast.to(socket.room).emit('showText', socket.username, m);
        console.log(socket.room);
        io.sockets.in(socket.room).emit('showText', socket.username, m);
    });

    socket.on('dmUser', function(n){
        socket.broadcast.emit("debug", io.sockets);
    });

    socket.on('changeRoom', function(newroom){
        if (socket.room != newroom) {
            socket.leave(socket.room);
            socket.join(newroom);
            socket.emit('showText', 'SERVER', 'Tu est connecté sur '+ newroom);
            socket.broadcast.to(newroom).emit('showText', 'SERVER', socket.username + ' c\'est connecté');
            socket.room = newroom;
        }
		//socket.emit('updaterooms', rooms, newroom);
	});

});
