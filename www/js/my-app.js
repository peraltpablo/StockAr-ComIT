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
        {path: '/ingreso/',url: 'ingreso.html',},
        {path: '/registro/',url: 'registro.html',},
        {path: '/productos/',url: 'productos.html',},
        {path: '/altaProductos/',url: 'altaProductos.html',},
        {path: '/proveedores/',url: 'proveedores.html',},
        {path: '/altaProveedores/',url: 'altaProveedores.html',},
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

// INICIALIZACIÓN DE PÁGINA INICIO
$$(document).on('page:init', '.page[data-name="altaProductos"]', function (e) {
    $$("#agregarProducto").on('click', fnAgregarProd);
    $$("#codigoProducto").val("");
    $$("#nombreProducto").val("");
    $$("#marcaProducto").val("");
    $$("#detalleProducto").val("");
    $$("#alertaProducto").val("");
    $$("#mininoAlerta").val("");
});

// INICIALIZACIÓN DE PÁGINA PRODUCTOS
$$(document).on('page:init', '.page[data-name="productos"]', function (e) {
    mostrarProd();
});

// INICIALIZACIÓN DE PÁGINA PROVEEDORES
$$(document).on('page:init', '.page[data-name="proveedores"]', function (e) {
    mostrarProv();
});

// INICIALIZACIÓN DE PÁGINA ALTA PROVEEDORES
$$(document).on('page:init', '.page[data-name="altaProveedores"]', function (e) {
    $$("#agregarProducto").on('click', fnAgregarProv);
    /*$$("#codigoProducto").val("");
    $$("#nombreProducto").val("");
    $$("#marcaProducto").val("");
    $$("#detalleProducto").val("");
    $$("#alertaProducto").val("");
    $$("#mininoAlerta").val("");*/
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
        mainView.router.navigate('/altaProductos/');

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
var colProductos = db.collection("productos");
var colProveedores = db.collection("proveedores");

function fnAgregarProd() {
    var data = {
        codigo: $$("#codigoProducto").val(),
        nombre: $$("#nombreProducto").val(),
        marca: $$("#marcaProducto").val(),
        detalle: $$("#detalleProducto").val(),
        alerta: $$("#alertaProducto").val(),
        minimoStock: $$("#mininoAlerta").val(),
    };

    MiID = $$("#codigoProducto").val();

    colProductos.doc(MiID).set(data)
    .then(function(idProd) {
        console.log("OK! En base de Datos");
        $$("#codigoProducto").val("");
        $$("#nombreProducto").val("");
        $$("#marcaProducto").val("");
        $$("#detalleProducto").val("");
        $$("#alertaProducto").val("");
        $$("#mininoAlerta").val("");
        alert("Producto Añadido");
    })
    .catch(function(datosDelError) {
        console.error("Error: " + datosDelError);
    });
};

function mostrarProd() {
    colProductos.get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            codigo = doc.data().codigo;
            nombre = doc.data().nombre;
            marca = doc.data().marca;
            detalle = doc.data().detalle;
            minimoStock = doc.data().minimoStock;

            $$("#datosProductos").append("<tr><td class='label-cell'>"+codigo+"</td><td class='label-cell'>"+nombre+"</td><td class='label-cell'>"+marca+"</td></tr><br>");
        })
    })
    .catch(function(err) {
        console.log("Error" + err);
    })
}

function fnAgregarProv() {
    var data = {
        cuit: $$("#cuitProveedor").val(),
        nombre: $$("#nombreProveedor").val(),
        email: $$("#emailProveedor").val(),
        telefono: $$("#telefonoProveedor").val(),
        localidad: $$("#localidadProveedor").val(),
        provincia: $$("#provinciaProveedor").val(),
    };

    MiID = $$("#cuitProveedor").val();

    colProveedores.doc(MiID).set(data)
    .then(function(idProd) {
        console.log("OK! En base de Datos");
        $$("#cuitProveedor").val("");
        $$("#nombreProveedor").val("");
        $$("#emailProveedor").val("");
        $$("#telefonoProveedor").val("");
        $$("#localidadProveedor").val("");
        $$("#provinciaProveedor").val("");
        alert("Proveedor Añadido");
    })
    .catch(function(datosDelError) {
        console.error("Error: " + datosDelError);
    });
};

function mostrarProv() {
    colProveedores.get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            cuit = doc.data().cuit;
            nombre = doc.data().nombre;
            email = doc.data().email;
            localidad = doc.data().localidad;

            $$("#datosProveedores").append("<tr><td class='label-cell'>"+cuit+"</td><td class='label-cell'>"+nombre+"</td><td class='label-cell'>"+email+"</td><td class='label-cell'>"+localidad+"</td></tr><br>");
        })
    })
    .catch(function(err) {
        console.log("Error" + err);
    })
}