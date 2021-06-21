// PARA USAR LIBRERIA DOM7
var $$ = Dom7;
//INICIALIZO FRAMEWORK7
var app = new Framework7({
    // App root element
    root: '#app',
    // NOMBRE DE LA APP
    name: 'My App',
    // ID DE LA APP
    id: 'com.myapp.test',
    // SWIPE PANELES
    panel: {
      swipe: 'left',
    },
    // RUTAS
    routes: [
        {path: '/index/', url: 'index.html',},
        {path: '/inicio/',url: 'inicio.html',},
        {path: '/ingreso/',url: 'ingreso.html',},
        {path: '/registro/',url: 'registro.html',},
    ]
  });

//CREO LA VISTA DE LA APP
var mainView = app.views.create('.view-main');

//EVENTO CORDOVA
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});

$$(document).on('page:init', '.page[data-name="index"]', function (e) {

});

// INICIALIZACIÓN DE PÁGINA USUARIO INGRESO
$$(document).on('page:init', '.page[data-name="ingreso"]', function (e) {
    $$("#ingresar").on('click', fnIngreso);
    $$("#registracion").on('click', fnRegistracion);
    $$("#cerrarSesion").on('click', fnCerrarSesion);
    observador();
});

// INICIALIZACIÓN DE PÁGINA USUARIO REGISTRO
$$(document).on('page:init', '.page[data-name="registro"]', function (e) {
    $$("#registrar").on('click', fnRegistro);
});

// AUTENTICACIÓN USUARIO EXISTENTE
function fnIngreso() {
    var email = $$("#email").val();
    var contrasena = $$("#contrasena").val();
    console.log(email);
    console.log(contrasena);

    firebase.auth().signInWithEmailAndPassword(email, contrasena)
    .then(function(){
        console.log("Ingreso!");
        mainView.router.navigate('/inicio/');

    })
    .catch(function(error){
        if (error.code == "auth/invalid-email") {
            alert("Usuario Incorrecto");
        }
    console.error(error.code);
    console.error(error.message);
    });
};

//VA A PÁGINA DE REGISTRO
function fnRegistracion() {
    mainView.router.navigate('/registro/')
}

// AUTENTICACIÓN NUEVO USUARIO
function fnRegistro() {
    var email_nuevo = $$("#email_nuevo").val();
    var contrasena_nuevo = $$("#contrasena_nuevo").val();
    console.log(email_nuevo);
    console.log(contrasena_nuevo);

    firebase.auth().createUserWithEmailAndPassword(email_nuevo,contrasena_nuevo)
    .then((userCredential) => {
        $$("#registro_ok").html("Registro exitoso! <a href='/ingreso/'>Iniciá sesión</a>")
        //mainView.router.navigate('/ingreso/')
    // Signed in
    //var user = userCredential.user;
    // ...
    })
    .catch((error) => {
        if (contrasena.length < 6) {
            alert("La contraseña debe tener al menos 6 caracteres")
        }
    console.error(error.code);
    console.error(error.message);
    });
};

//FUNCION OBSERVADOR PARA SABER SI EXISTE USUARIO ACTIVO

function observador() {
    firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log("existe");
        fnAparece();
    } else {
        console.log("no existe")
        fnDesaparece();
  }
});
};

observador();

function fnAparece() {
    $$("#aparece_cerrar").removeClass('oculto').addClass('visible');
};

function fnDesaparece() {
    $$("#aparece_cerrar").removeClass('visible').addClass('oculto');
};

function fnCerrarSesion() {
    firebase.auth().signOut()
    .then(function(){
        console.log("saliendo");

    })
    .catch(function(){
        console.error(error.code);
        console.error(error.message);
    })
}

//BASE DE DATOS
var db = firebase.firestore();
    colProductos = db.collection("productos");

    /*var data = {nombre: "Pepe", rol: "developer"};
    MiID = "pepe@hotmail.com"
    colPersonas.doc(MiID).set(data)
    .then(function(miVarDeDocRef) {
        console.log("OK! Con el ID: " + miVarDeDocRef.id)
    })
    .catch(function(datosDelError) {
        console.error("Error: " + datosDelError);
    });*/

    /*var data = {nombreProd: "", marca: "", detalle: "", alerta: "", alertaMin:""};
    
    MiID = "codigo del producto"
    colProductos.doc(MiID).set(data)
    .then(function(miVarDeDocRef) {
        console.log("OK! Con el ID: " + miVarDeDocRef.id)
    })
    .catch(function(datosDelError) {
        console.error("Error: " + datosDelError);
    });

    /*colPersonas.get()
    .then(function(q5) {
        q5.forEach(function(doc) {
            nombre = doc.data().nombre;
            rol = doc.data().rol;

            $$("#datosPersonas").append('<p>'+nombre+'</p><p>'+rol+'</p>');
        })
    })
    .catch(function(err) {
        console.log("Error" + err);
    })*/