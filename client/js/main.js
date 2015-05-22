var window;

window.onload = function() {
	var socket = io.connect();
    var signInUsername = document.getElementById('signInUsername'),
        signInPassword = document.getElementById('signInPassword'),
        signInBtn = document.getElementById('signInBtn'),
        inputFirst = document.getElementById('inputFirst'),
        inputLast = document.getElementById('inputLast'),
        inputEmail = document.getElementById('inputEmail'),
        inputUser = document.getElementById('inputUser'),
        inputPassword = document.getElementById('inputPassword'),
        signUpBtn = document.getElementById('signUpBtn'),
        errorSignUp = document.getElementById('errorSignUp'),
        successSignUp = document.getElementById('successSignUp'),
        errorSignIn = document.getElementById('errorSignIn'),
        successSignIn = document.getElementById('successSignIn'),
        //
        classClose = document.querySelectorAll('.close');
		function getTime() {
			var now     = new Date(); 
		    var year    = now.getFullYear();
		    var month   = now.getMonth()+1; 
		    var day     = now.getDate();
		    var hour    = now.getHours();
		    var minute  = now.getMinutes();
		    var second  = now.getSeconds(); 
		    if(month.toString().length == 1) {
		        var month = '0'+month;
		    }
		    if(day.toString().length == 1) {
		        var day = '0'+day;
		    }   
		    if(hour.toString().length == 1) {
		        var hour = '0'+hour;
		    }
		    if(minute.toString().length == 1) {
		        var minute = '0'+minute;
		    }
		    if(second.toString().length == 1) {
		        var second = '0'+second;
		    }   
		    var dateTime = year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;   
	    	return dateTime;
		}
        var clearInputs = {
            singUp: function() {
                inputFirst.value = ''; 
                inputLast.value =''; 
                inputEmail.value = ''; 
                inputUser.value = ''; 
                inputPassword.value = '';
            },
            signIn:  function(){
                signInPassword.value = '';
                signInUsername.value = '';
            }
        }

        
    signInBtn.addEventListener('click', function(){
        if (signInUsername.value !== '' && signInPassword.value !== '') {
            var data = {
                Username: signInUsername.value,
                Password: signInPassword.value,
                Time: getTime()
            };
            socket.emit('login', data);
        
            socket.on('signInError', function(err){
                if (err) {
                    errorSignIn.classList.remove('displayNone');
                    successSignIn.classList.add('displayNone');                    
                } else {
                    clearInputs.signIn();
                    errorSignIn.classList.add('displayNone');
                    successSignIn.classList.remove('displayNone');
                }
            })
        }
    });
    signUpBtn.addEventListener('click', function() {
        //TODO - req form
        if (inputFirst.value !== '' && inputLast.value !== '' && inputEmail.value !== '' && inputUser.value !== '' && inputPassword.value !== '') {
            var data = {
                //data logowania w obiekcie 'logged'
                //dodawanie nowego, nie nadpisanie.
                'FirstName': inputFirst.value,
                'LastName': inputLast.value,
                'Email': inputEmail.value,
                'Username': inputUser.value,
                'Password': inputPassword.value,
                'SingUpTime': getTime()
            };
            socket.emit('signUp', data);
            socket.on('signUpError', function(err){
                if (err) {
                    errorSignUp.classList.remove('displayNone');
                } else {
                    clearInputs.singUp();
                    errorSignUp.classList.add('displayNone');
                    successSignUp.classList.remove('displayNone');
                }
            });
        }
    });
    //for each .parentNode  add class to close notify.  
    for (var i=0; i < classClose.length; i++){
        classClose[i].addEventListener('click', function(){
            this.parentNode.classList.add('displayNone');
        });
    }
};