var app = require('express')();
var http = require('http').Server(app);
app.get('/', function(req, res){
    res.sendfile('www/index.html')
});

app.get('/webtv', function(req, res){
    res.sendfile('www/webtv.html')
});

app.get('/webtv/control', function(req, res){
    res.sendfile('www/control.html')
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
var io = require('socket.io')(http);

var count = 0;
var text = "Ici";

io.on('connection', function(socket){
    socket.on('incrementer', function(){
        count++;
        socket.broadcast.emit('afficher', count);
        socket.emit('afficher', count);
    });

    socket.on('decrementer', function(){
        count--;
        socket.broadcast.emit('afficher', count);
        socket.emit('afficher', count);
    });

    socket.on('reset', function(){
        count = 0;
        socket.broadcast.emit('afficher', count);
        socket.emit('afficher', count);
    });

    socket.on('updatetext', function(s){
        text = s;
        socket.broadcast.emit('afficherTexte', text);
    });
});