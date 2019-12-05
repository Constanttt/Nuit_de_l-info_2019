var app = require('express')();
var http = require('http').Server(app);
app.get('/', function(req, res){
    res.sendfile('www/index.html')
});
http.listen(3000, function(){
    console.log('listening on *:3000');
});
var io = require('socket.io')(http);

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
