// PARA USAR LIBRERIA DOM7
var $$ = Dom7;
//INICIALIZO FRAMEWORK7
var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
      swipe: 'left',
    },
    // Add default routes
    routes: [
      {
        path: '/about/',
        url: 'about.html',
      },
    ]
    // ... other parameters
  });

//CREO LA VISTA DE LA APP
var mainView = app.views.create('.view-main');

var panel = app.panel.create({
  el: '.panel-left',
  on: {
    opened: function () {
      console.log('Panel opened')
    }
  }
});

//EVENTO CORDOVA
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});

// INICIALIZACIÓN DE PÁGINA INDEX
$$(document).on('page:init', '.page[data-name="index"]', function (e) {
    $$("#ingresar").on('click', fnIngreso);
});

// AUTENTICACIÓN
function fnIngreso() {
    var email = $$("#email").val();
    var contrasena = $$("#contrasena").val();
    console.log(email);
    console.log(contrasena);

    firebase.auth().createUserWithEmailAndPassword(email,contrasena)
    .then(function(){
        console.log("Registrado!");
    })
    .catch(function(error){
    console.error(error.code);
    console.error(error.message);
    });
};