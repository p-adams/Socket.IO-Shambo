
var socket = io();

var ready = function() {
      
  var r = {},
      p = {},
      s = {},
      tie = 0,
      timeOut;
   
   
        document.getElementById('oneWin').value = "";
        document.getElementById('tie').value = "";
        document.getElementById('twoWin').value = "";
        
        
   var rock = (aSide)=>{
    document.getElementById("rock").addEventListener("click", function(){
        r = {x: aSide};
        socket.emit('throwDown', r);
    });
   }
   
   var paper = (aSide)=>{
    document.getElementById("paper").addEventListener("click", function(){
        p = {y: aSide};
        socket.emit('throwDown',p);
    });
   }
   var scissors = (aSide)=>{
    document.getElementById("scissors").addEventListener("click", function(){
        s = {z: aSide};
        socket.emit('throwDown', s);
    });
   }
      
   var countDown = ()=>{
       var seconds = 5;
       var count = setInterval(function(){
           document.getElementById('display').innerHTML = seconds;
           seconds--;
           if(seconds<0){
               clearInterval(count);
           }
       }, 2000);       
   }
          
  var startTime = ()=>{
      timeOut = window.setTimeout(countDown,4000);
   }
    
    socket.on('gameStart', (data) => {
       side = data.side;
       document.getElementById('showSide').innerHTML = "You are player: " + side;
       //startTime();
       rock(side);
       paper(side);
       scissors(side);
    });
    
   socket.on('one', (data)=>{  
        var oneWins = Object.keys(data.l).map(function(k) { return data.l[k]});
        document.getElementById('oneWin').value = oneWins.length;
        socket.emit('resetWin');
    });
    socket.on('two', (data)=>{
        var twoWins = Object.keys(data.r).map(function(k) { return data.r[k]});
        document.getElementById('twoWin').value = twoWins.length;
        socket.emit('resetWin');
    }); 
    socket.on('tie', ()=>{
        tie+=1; 
        document.getElementById('tie').value = tie;
        socket.emit('resetTie');
    });
    

}

if (document.readyState !== 'loading') {
    ready()
} else {
  document.addEventListener('DOMContentLoaded', ready)
}