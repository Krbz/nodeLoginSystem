var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://karbz:shinev234@ds031842.mongolab.com:31842/nodedb';
app.use(express.static('client'));



app.get('/', function (req, res) {
  res.sendFile(__dirname+'/index.html');
  io.on('connection', function(socket){
    console.log('#info - User connected');
  
    MongoClient.connect(url, function (error, db) {
    	if (error) {
    		console.log('#error - Unable to connect to the mongoDB server. Error:', error);
    	} else {
    		console.log('#info - Connection established to', url);
    		var userCollection = db.collection('users');
  		
  		  socket.on('signUp', function(data) {
      		userCollection.findOne({'details.Username': data.Username }, function(error, cursor){
      	      var errorNotify;
      	      if (cursor) { 
      	        console.log('#error - taki username istnieje', cursor);
      	        errorNotify = true;
      	        socket.emit('signUpError', errorNotify);
      	      } else { 
          		  userCollection.insert({"details":data}, function(error, cursor){
          		    cursor ? console.log('#success - data send to db') : console.log('#error -');
          		  });
          		  errorNotify = false;
          		  socket.emit('signUpError', errorNotify);
      	      }
      		});
  		  });
  		
  		
  		  socket.on('login', function(data){
        		userCollection.findOne({'details.Username': data.Username , 'details.Password': data.Password}, function(error, cursor){
        	     var errorNotify;
        	     if (cursor) {
        	       console.log('#info - mam', cursor);
        	       errorNotify = false;
        	       socket.emit('signInError', errorNotify);
          	     //login data  
                 userCollection.update(
                  {'details.Username': data.Username , 'details.Password': data.Password},
                  {$push : {logged: data.Time}}
                 );
                 
                 res.redirect('/home');
                 
                // socket.emit('join', data.Username);
                // socket.broadcast.emit('join', data.Username);
                // res.redirect('/zx');
                 
                 
        	      } else { 
        	       console.log('#error -', error);
        	       errorNotify = true;
        	       socket.emit('signInError', errorNotify);
        	     }
        		});
  		    });
        }
    });
  
    socket.on('disconnect', function(){
      console.log('#info - User dissconnected');
    });
  });
});






http.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
	var addr = http.address();
	console.log("#info - Chat server listening at", addr.address + ":" + addr.port);
});





//wchodzi server, na '/' - głowna strona z przejsciem na /login lub /reg~
//po zalogowaniu/rejestracji wysyła name/haslo/email whateva do mongodb - jezeli
//pass - '/' z zalogowaniem.
//
//opcja czatu - osobny db.collection - chat.
//opcja wysylania prv msg - socket.emit.room(1) - ?
//
//na głownej stronie - tablica jak facebook.
//udostepnianie foto/postów. komentarze i lajki FICZER JAK SKURWYSYN!!!


//




//TODO - logowanie mailem
// db.bios.findOne(
//   {
//     $or: [
//             { 'name.first' : /^G/ },
//             { birth: { $lt: new Date('01/01/1945') } }
//           ]
//   }
// )

//to Add - maila auth.
//details.username or details.email


// 404
// app.get('*', function(req, res) {
//     res.sendFile(__dirname+'/404.html');
// });