var Client = {};
Client.socket = io.connect();

function incrementer(){
    Client.socket.emit('incrementer', v);
}