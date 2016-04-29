var express = require("express"),
    app = express(),
    http = require("http"),
    server = http.Server(app),
    socketio = require("socket.io"),
    players = {},
    oneWins = [],
    twoWins = [],
    two,
    rock = [],
    paper = [],
    scissors = [],
    io = socketio(server);
app.use(express.static("pub"));


var assignSide = (socket) => {
    players[socket.id] = {opp: two, side: 'one', socket: socket};
    if(two){
        players[socket.id].side = 'two';
        two = null; 
    }else{
        two = socket.id;
    }
}

var getOpponent = (socket) => {
    if(!players[socket.id].opp){
        return;
    }
    return players[players[socket.id].opp].socket;    
}

var storeChoices = (x, y, z, r, l)=> {
    
     if(x === r || x === l){
         rock.push(x);
     }
     if(y === r || y === l){
         paper.push(y);
     }
     if(z === r || z === l){
         scissors.push(z);
     }    
}

var tie = (weapon, sideA, sideB)=>{
    if(weapon.indexOf(sideA)!= -1 && weapon.indexOf(sideB)!= -1){
           return true;
    }
    return false;
}

var isWinner = (weaponA, weaponB, sideA, sideB)=>{
    if(weaponA.indexOf(sideA) != -1 && weaponB.indexOf(sideB) !=-1){
        return true;
    }
    return false;
}

var resetWeapons = (anArray) => {
    while(anArray.length > 0) {
        anArray.pop();
      }
}

io.on('connection', (socket) => {
    console.log('Someone connected to server');
    assignSide(socket);
    
    if(getOpponent(socket)){
        socket.emit('gameStart', {side: players[socket.id].side});
        getOpponent(socket).emit('gameStart', {side: players[getOpponent(socket).id].side});
    }
    
    socket.on('throwDown', (data) => {
       var obj = {};
       storeChoices(data.x, data.y, data.z, 'two', 'one');
       
       if(tie(rock, "two", "one") || tie(paper, "two", "one")||
          tie(scissors, "two", "one")){
              io.emit('tie');
       }
       
       if(isWinner(rock, scissors, 'one', 'two')){
          oneWins.push(1);
          obj.l = oneWins;
          io.emit('one', obj);
       }
       
        else if(isWinner(rock, paper, 'one', 'two')){
          twoWins.push(1);
          obj.r = twoWins;
          io.emit('two', obj); 
       }
       
       else if(isWinner(paper, rock, 'one', 'two')){
          oneWins.push(1);
          obj.l = oneWins;
          io.emit('one', obj);
       }
       
       else if(isWinner(paper, scissors, 'one', 'two')){
          twoWins.push(1);
          obj.r = twoWins;
          io.emit('two', obj);   
       }
       
       else if(isWinner(scissors, rock, 'one', 'two')){
          twoWins.push(1);
          obj.r = twoWins;
          io.emit('two', obj);
       }
       
        else if(isWinner(scissors, paper, 'one', 'two')){
          one.push(1);
          obj.l = oneWins;
          io.emit('one', obj);    
       }  
      });
   
    socket.on('resetTie', ()=>{
       resetWeapons(rock);
       resetWeapons(paper);
       resetWeapons(scissors); 
    });
    
    socket.on('resetWin', ()=>{
       resetWeapons(rock);
       resetWeapons(paper);
       resetWeapons(scissors); 
    });
    
    socket.on('disconnect', (socket) => {
       console.log('someone left the server'); 
    });
    
});
server.listen(80, () => {
    console.log('listening on port 80');
});