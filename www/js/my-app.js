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
    // CALENDARIO
    calendar: {
    url: 'facturas/',
    dateFormat: 'yyyy-mm-dd',
    closeOnSelect: 'true',
    },
    //BUSCADOR
    autocomplete: {
    openIn: 'popup',
    animate: false,
    },
    // RUTAS
    routes: [
        {path: '/index/', url: 'index.html',},
        {path: '/stock/', url: 'stock.html',},
        {path: '/ingreso/',url: 'ingreso.html',},
        {path: '/registro/',url: 'registro.html',},
        {path: '/facturas/',url: 'facturas.html',},
        {path: '/productos/',url: 'productos.html',},
        {path: '/proveedores/',url: 'proveedores.html',},
        {path: '/alertaFacturas/',url: 'alertaFacturas.html',},
    ]
  });

//CREO LA VISTA DE LA APP
var mainView = app.views.create('.view-main');

//VARIABLES GLOBALES
var db = firebase.firestore();
var colProductos = db.collection("productos");
var colProveedores = db.collection("proveedores");
var colFacturas = db.collection("facturas");
var nombre = ""; var marca = ""; var detalle = ""; var stock = ""; var alerta = ""; var minimoStock = ""; var email= ""; var telefono = ""; var localida = ""; var provincia = ""; var codigo = ""; var cuit = ""; var fecha = ""; var vencimiento = ""; var proveedor = ""; var monto = ""; var estado = ""; var vtocae = ""; var tabla = ""; var numero = ""; var dias = ""; var alerta = "Si"; var diasAlerta = 5; var observador = ""; var conteoListado = 0; var conteoListado2 = 0;

//EVENTO CORDOVA
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});

// INICIALIZACIÓN DE PÁGINA INDEX
$$(document).on('page:init', '.page[data-name="index"]', function (e) {
fnAparece();
fnDesaparece();
fnGrafico();
});

// INICIALIZACIÓN DE PÁGINA USUARIO INGRESO
$$(document).on('page:init', '.page[data-name="ingreso"]', function (e) {
    $$("#ingresar").on('click', fnIngreso);
    $$("#registracion").on('click', fnRegistracion);
    $$("#cerrarSesion").on('click', fnCerrarSesion);
    observa();
});

// INICIALIZACIÓN DE PÁGINA USUARIO REGISTRO
$$(document).on('page:init', '.page[data-name="registro"]', function (e) {
    $$("#registrar").on('click', fnRegistro);
});

// INICIALIZACIÓN DE PÁGINA USUARIO REGISTRO
$$(document).on('page:init', '.page[data-name="stock"]', function (e) {
    var searchbar = app.searchbar.create({
        el: '.searchbar',
        searchContainer: '.list',
        searchIn: '.item-title',
        on: {
          search(sb, query, previousQuery) {
            console.log(query, previousQuery);
          }
        }
      });
    mostrarProdStock()
    $$("#eliminaLista").on('click', eliminaLista);
    $$("#eliminaLista2").on('click', eliminaLista2);
    $$("#irProductos").on('click', irProductos);
    $$("#actualizaStock").on('click', actualizaStock);
    $$("#actualizaStock2").on('click', actualizaStock2);

});

// INICIALIZACIÓN DE PÁGINA PRODUCTOS
$$(document).on('page:init', '.page[data-name="productos"]', function (e) {
    mostrarProd();
    $$("#botonProducto").on('click', fnAgregarProd);
    $$("#botonEditarProd").on('click', editarProdOk);
});

// INICIALIZACIÓN DE PÁGINA PROVEEDORES
$$(document).on('page:init', '.page[data-name="proveedores"]', function (e) {
    mostrarProv();
    $$("#botonProveedor").on('click', fnAgregarProv);
    $$("#botonEditarProv").on('click', editarProvOk);
});

// INICIALIZACIÓN DE PÁGINA FACTURAS
$$(document).on('page:init', '.page[data-name="facturas"]', function (e) {
    mostrarFac();
    var calendar1 = app.calendar.create({inputEl: '#fechaFactura',});
    var calendar2 = app.calendar.create({inputEl: '#vencimientoFactura',});
    var calendar3 = app.calendar.create({inputEl: '#vencimientocaeFactura',});
    var calendar4 = app.calendar.create({inputEl: '#fechaFacturaEd',});
    var calendar5 = app.calendar.create({inputEl: '#vencimientoFacturaEd',});
    var calendar6 = app.calendar.create({inputEl: '#vencimientocaeFacturaEd',});
    $$("#botonFactura").on('click', fnAgregarFac);
    $$("#botonEditarFac").on('click', editarFacOk);
});

// INICIALIZACIÓN DE PÁGINA ALERTA FACTURAS
$$(document).on('page:init', '.page[data-name="alertaFacturas"]', function (e) {
    $$("#agregarAlerta").on('click', fnAgregarAlerta);
    $$("#alerta").on('change', fnAlerta);
    $$("#diasAlerta").val(diasAlerta);
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
        mainView.router.navigate('/index/');
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
    mainView.router.navigate('/registro/');
}

// AUTENTICACIÓN NUEVO USUARIO
function fnRegistro() {
    var email_nuevo = $$("#email_nuevo").val();
    var contrasena_nuevo = $$("#contrasena_nuevo").val();
    console.log(email_nuevo);
    console.log(contrasena_nuevo);

    firebase.auth().createUserWithEmailAndPassword(email_nuevo,contrasena_nuevo)
    .then((userCredential) => {
        $$("#registro_ok").html("Registro exitoso! <a href='/index/'>Ingresar</a>")
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

//FUNCION OBSERVA PARA SABER SI EXISTE USUARIO ACTIVO
function observa() {
    firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        var observador = "existe";
        console.log(observador);
        fnAparece();
        $$("#imagenIndex").removeClass('visible').addClass('oculto');
        $$("#myChart").removeClass('oculto').addClass('visible');
        $$("#alertas").removeClass('oculto').addClass('visible');
    } else {
        observador = "no existe";
        console.log(observador);
        fnDesaparece();
        $$("#myChart").removeClass('visible').addClass('oculto');
        $$("#alertas").removeClass('visible').addClass('oculto');
        $$("#imagenIndex").removeClass('oculto').addClass('visible');
  }
});
};

observa();

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
function fnAgregarProd() {
    var data = {
        nombre: $$("#nombreProducto").val(),
        marca: $$("#marcaProducto").val(),
        detalle: $$("#detalleProducto").val(),
        stock: $$("#stockProducto").val(),
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
        $$("#stockProducto").val("");
        $$("#alertaProducto").val("si");
        $$("#mininoAlerta").val("");
        alert("Producto Añadido");
    })
    .catch(function(datosDelError) {
        console.error("Error: " + datosDelError);
    });
};

function mostrarProd() {
    var tabla = document.getElementById('datosProductos');
    colProductos.onSnapshot(function(querySnapshot) {
        tabla.innerHTML = '';
        querySnapshot.forEach(function(doc) {
            codigo = doc.id;
            nombre = "'" + doc.data().nombre + "'";
            marca = "'" + doc.data().marca + "'";
            detalle = "'" + doc.data().detalle + "'";
            stock = doc.data().stock;
            alerta = "'" + doc.data().alerta + "'";
            minimoStock = doc.data().minimoStock;
            tabla.innerHTML += '<tr><td>'+doc.id+'</td><td>'+doc.data().stock+'</td><td>'+doc.data().nombre+'</td><td>'+doc.data().marca+'</td><td>'+doc.data().detalle+'</td><td><button class="col button button-fill color-red" onclick="eliminarProd('+codigo+')">Eliminar</button></td><td><button class="col button button-fill color-green popup-open" href="#"" data-popup=".popup-editarProd" onclick="editarProd('+codigo+','+nombre+','+marca+','+detalle+','+stock+','+alerta+','+minimoStock+')">Editar</button></td></tr>';
        });
    });
}

function eliminarProd(codigo) {
    colProductos.doc(codigo.toString()).delete()
    .then(() => {
    console.log("Borrado!");
    })
    .catch((error) => {
    console.error("Error removing document: ", error);
    });

    };

function editarProd(codigo,nombre,marca,detalle,stock,alerta,minimoStock){
    $$("#codigoProductoEd").val(codigo);
    $$("#nombreProductoEd").val(nombre);
    $$("#marcaProductoEd").val(marca);
    $$("#detalleProductoEd").val(detalle);
    $$("#stockProductoEd").val(stock);
    $$("#alertaProductoEd").val(alerta);
    $$("#mininoAlertaEd").val(minimoStock);
}

function editarProdOk() {
    codigo = $$("#codigoProductoEd").val();
        return colProductos.doc(codigo).update({
            nombre: $$("#nombreProductoEd").val(),
            marca: $$("#marcaProductoEd").val(),
            detalle: $$("#detalleProductoEd").val(),
            stock: $$("#stockProductoEd").val(),
            alerta: $$("#alertaProductoEd").val(),
            minimoStock: $$("#mininoAlertaEd").val(),
        })
        .then(() => {
            console.log("Prod Editado!");
            $$("#codigoProductoEd").val("");
            $$("#nombreProductoEd").val("");
            $$("#marcaProductoEd").val("");
            $$("#detalleProductoEd").val("");
            $$("#stockProductoEd").val("");
            $$("#alertaProductoEd").val("");
            $$("#mininoAlertaEd").val("");
        })

        .catch((error) => {
            console.error("Error updating document: ", error);
        });

};

function fnAgregarProv() {
    var data = {
        nombre: $$("#nombreProveedor").val(),
        email: $$("#emailProveedor").val(),
        telefono: $$("#telefonoProveedor").val(),
        localidad: $$("#localidadProveedor").val(),
        provincia: $$("#provinciaProveedor").val(),
    };
    MiID = $$("#cuitProveedor").val();
    colProveedores.doc(MiID).set(data)
    .then(function(idProv) {
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
    var tabla = document.getElementById('datosProveedores');
    colProveedores.onSnapshot(function(querySnapshot) {
        tabla.innerHTML = '';
        querySnapshot.forEach(function(doc) {
            cuit = doc.id;
            nombre = "'" + doc.data().nombre + "'";
            email = "'" + doc.data().email + "'";
            telefono = doc.data().telefono;
            localidad = "'" + doc.data().localidad + "'";
            provincia = "'" + doc.data().provincia + "'";
            tabla.innerHTML += '<tr><td>'+cuit+'</td><td>'+nombre+'</td><td>'+email+'</td><td>'+telefono+'</td><td>'+localidad+'</td><td><button class="col button button-fill color-red" onclick="eliminarProv('+cuit+')">Eliminar</button></td><td><button class="col button button-fill color-green popup-open" href="#"" data-popup=".popup-editarProv" onclick="editarProv('+cuit+','+nombre+','+email+','+telefono+','+localidad+','+provincia+')">Editar</button></td></tr>';
        });
    });
};

function eliminarProv(cuit) {
    colProveedores.doc(cuit.toString()).delete()
    .then(() => {
    console.log("Proveedor Borrado!");
    })
    .catch((error) => {
    console.error("Error removing document: ", error);
    });
    };

function editarProv(cuit,nombre,email,telefono,localidad,provincia){
    $$("#cuitProveedorEd").val(cuit);
    $$("#nombreProveedorEd").val(nombre);
    $$("#emailProveedorEd").val(email);
    $$("#telefonoProveedorEd").val(telefono);
    $$("#localidadProveedorEd").val(localidad);
    $$("#provinciaProveedorEd").val(provincia);
}

function editarProvOk() {
    cuit = $$("#cuitProveedorEd").val();
        return colProveedores.doc(cuit).update({
            nombre: $$("#nombreProveedorEd").val(),
            email: $$("#emailProveedorEd").val(),
            telefono: $$("#telefonoProveedorEd").val(),
            localidad: $$("#localidadProveedorEd").val(),
            provincia: $$("#provinciaProveedorEd").val(),
        })
        .then(() => {
            console.log("Prov Editado!");
            $$("#cuitProveedorEd").val("");
            $$("#nombreProveedorEd").val("");
            $$("#emailProveedorEd").val("");
            $$("#telefonoProveedorEd").val("");
            $$("#localidadProveedorEd").val("");
            $$("#provinciaProveedorEd").val("");
        })
        .catch((error) => {
            console.error("Error updating document: ", error);
        });

};

function fnBuscarProv() {
    console.log("sii");
    colProveedores.get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            cuit = doc.data().cuit;
            nombre = doc.data().nombre;
            email = doc.data().email;
            telefono = doc.data().telefono;
            localidad = doc.data().localidad;
            provincia = doc.data().provincia;
        })
        if ($$("#cuitProveedorEd").val()== cuit) {
            $$("#nombreProveedorEd").html(nombre);
            $$("#emailProveedorEd").html(email);
            $$("#telefonoProveedorEd").val(telefono);
            $$("#localidadProveedorEd").val(localidad);
            $$("#provinciaProveedorEd").val(provincia);
        } else {
            $$("#nombreProveedorEd").html("");
            $$("#emailProveedorEd").html("");
            $$("#telefonoProveedorEd").val("");
            $$("#localidadProveedorEd").val("");
            $$("#provinciaProveedorEd").val("");
        }
    })
    .catch(function(err) {
        console.log("Error" + err);
    })
}

function fnAgregarFac() {
    var data = {
        numero: $$("#numeroFactura").val(),
        fecha: $$("#fechaFactura").val(),
        vencimiento: $$("#vencimientoFactura").val(),
        proveedor: $$("#proveedorFactura").val(),
        monto: $$("#montoFactura").val(),
        estado: $$("#estadoFactura").val(),
        vtocae: $$("#vencimientocaeFactura").val(),
    };
    MiID = $$("#caeFactura").val();
    colFacturas.doc(MiID).set(data)
    .then(function(idFac) {
        console.log("OK! En base de Datos");
        $$("#numeroFactura").val("");
        $$("#fechaFactura").val("");
        $$("#vencimientoFactura").val("");
        $$("#proveedorFactura").val("");
        $$("#montoFactura").val("");
        $$("#caeFactura").val("");
        $$("#vencimientocaeFactura").val("");
        alert("Factura Añadida");
    })
    .catch(function(datosDelError) {
        console.error("Error: " + datosDelError);
    });
};

function mostrarFac() {
    var tabla = document.getElementById('datosFacturas');
    
    colFacturas.onSnapshot(function(querySnapshot) {
        tabla.innerHTML = '';
        querySnapshot.forEach(function(doc) {
            cae = doc.id;
            numero = doc.data().numero;
            fecha = "'" + doc.data().fecha + "'";
            vencimiento = "'" + doc.data().vencimiento + "'";
            proveedor = "'" + doc.data().proveedor + "'";
            monto = doc.data().monto;
            estado = "'" + doc.data().estado + "'";
            vtocae = "'" + doc.data().vtocae + "'";
            tabla.innerHTML += '<tr><td>'+cae+'</td><td>'+numero+'</td><td>'+estado+'</td><td>'+monto+'</td><td>'+vencimiento+'</td><td><button class="col button button-fill color-red" onclick="eliminarFac('+cae+')">Eliminar</button></td><td><button class="col button button-fill color-green popup-open" href="#"" data-popup=".popup-editarFac" onclick="editarFac('+cae+','+numero+','+fecha+','+vencimiento+','+proveedor+','+monto+','+estado+','+vtocae+')">Editar</button></td></tr>';
            console.log(fecha);
        });
    });
};


function eliminarFac(cae) {
    colFacturas.doc(cae.toString()).delete()
    .then(() => {
    console.log("Borrado!");
    })
    .catch((error) => {
    console.error("Error removing document: ", error);
    });
    };

function editarFac(cae,numero,fecha,vencimiento,proveedor,monto,estado,vtocae){
    console.log(fecha);
    $$("#caeFacturaEd").val(cae);
    $$("#numeroFacturaEd").val(numero);
    $$("#fechaFacturaEd").val(fecha);
    $$("#vencimientoFacturaEd").val(vencimiento);
    $$("#proveedorFacturaEd").val(proveedor);
    $$("#montoFacturaEd").val(monto);
    $$("#estadoFacturaEd").val(estado);
    $$("#vencimientocaeFacturaEd").val(vtocae);
}

function editarFacOk() {
    cae = $$("#caeFacturaEd").val();
        return colFacturas.doc(cae).update({
            numero: $$("#numeroFacturaEd").val(),
            fecha: $$("#fechaFacturaEd").val(),
            vencimiento: $$("#vencimientoFacturaEd").val(),
            proveedor: $$("#proveedorFacturaEd").val(),
            monto: $$("#montoFacturaEd").val(),
            estado: $$("#estadoFacturaEd").val(),
            vtocae: $$("#vencimientocaeFacturaEd").val(),
        })
        .then(() => {
            console.log("Editado!");
            $$("#numeroFacturaEd").val("");
            $$("#fechaFacturaEd").val("");
            $$("#vencimientoFacturaEd").val("");
            $$("#proveedorFacturaEd").val("");
            $$("#montoFacturaEd").val("");
            $$("#caeFacturaEd").val("");
            $$("#vencimientocaeFacturaEd").val("");
        })
        .catch((error) => {
            console.error("Error updating document: ", error);
        });
};

function fnGrafico() {
    var hoy = Date.now();
    colFacturas.get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            vencimiento = new Date(doc.data().vencimiento);
            numero = doc.data().numero;
            monto = doc.data().monto;
            console.log(vencimiento);
            console.log(hoy);
            // Calcular días
            var diferencia = Math.abs(vencimiento-hoy);
            dias = parseInt(diferencia/(1000 * 3600 * 24));
            console.log(dias);
            if (vencimiento < hoy) {
                $$("#alertas").append('Tu Factura Nº ' + numero + ' por $ ' + monto + ' venció hace ' + dias + ' días!<br>');
            }
            if (vencimiento > hoy && dias <= diasAlerta) {
                $$("#alertas").append('Tu Factura Nº ' + numero + ' por $ ' + monto + ' vence en ' + dias + ' días!<br>');
            };
        })
    })
    .catch(function(err) {
        console.log("Error" + err);
    })

var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['MARZO', 'ABRIL', 'MAYO', 'JUNIO'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 15],
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(255, 99, 132, 0.6)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 1
        }]
    },
    options: {
        color: 'rgba(255, 99, 132, 0.6)',
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
};

function fnAlerta () {
    if ($$("#alerta").val() == "No") {
        alerta = "No";
        diasAlerta = "";
        $$("#diasAlerta").val(diasAlerta).addClass('disabled')
    };
    if ($$("#alerta").val() == "Si") {
        alerta = "Si";
        $$("#diasAlerta").val(diasAlerta).removeClass('disabled')
    };
}

function fnAgregarAlerta() {
    diasAlerta = $$("#diasAlerta").val();
    console.log(alerta+diasAlerta);
    alert("Datos Guardados");
};

function mostrarProdStock() {
    colProductos.onSnapshot(function(querySnapshot) {
            $$(".borrar").remove();
            $$(".borrar2").remove();
        querySnapshot.forEach(function(doc) {
            codigo = doc.id;
            nombre = doc.data().nombre;
            marca = doc.data().marca;
            detalle = doc.data().detalle;
            stock = doc.data().stock;
            alerta = doc.data().alerta;
            minimoStock = doc.data().minimoStock;
            $$("#prod_stock").append('<div class="borrar"><li class="item-content"><div class="item-inner" onclick="listar(\''+codigo+'\',\''+nombre+'\',\''+marca+'\',\''+detalle+'\',\''+stock+'\')"><div class="item-title">'+doc.data().nombre+' - '+doc.data().marca+' - '+doc.data().detalle+' ('+doc.data().stock+')</div></div></li></div>');
            $$("#prod_stock2").append('<div class="borrar2"><li class="item-content"><div class="item-inner" onclick="listar2(\''+codigo+'\',\''+nombre+'\',\''+marca+'\',\''+detalle+'\',\''+stock+'\')"><div class="item-title">'+doc.data().nombre+' - '+doc.data().marca+' - '+doc.data().detalle+' ('+doc.data().stock+')</div></div></li></div>');
        });
    });
}

function listar (codigo,nombre,marca,detalle,stock) {
    conteoListado ++;
    $$("#listar").append('<div class="row item-inner"><input type="number" disabled="disabled" class="oculto" value="'+codigo+'" id="lista_prod'+conteoListado+'"><input type="number" disabled="disabled" class="oculto" value="'+stock+'" id="lista_stock'+conteoListado+'"><input type="text" disabled="disabled" class="col-75" value="'+nombre+' / '+marca+' / '+detalle+'"><input type="number" placeholder="Cantidad" class="col-25 text-color-white bg-color-grey padding-right text-align-center" id="lista_cant'+conteoListado+'"></div>');
    console.log(conteoListado);
    $$("#actualizaStock").removeClass('oculto').addClass('visible');
    $$("#eliminaLista").removeClass('oculto').addClass('visible');
}

function listar2 (codigo,nombre,marca,detalle,stock) {
    conteoListado2 ++;
    $$("#listar2").append('<div class="row item-inner"><input type="number" disabled="disabled" class="oculto" value="'+codigo+'" id="lista_prod2'+conteoListado2+'"><input type="number" disabled="disabled" class="oculto" value="'+stock+'" id="lista_stock2'+conteoListado2+'"><input type="text" disabled="disabled" class="col-75" value="'+nombre+' / '+marca+' / '+detalle+'"><input type="number" placeholder="Cantidad" class="col-25 text-color-white bg-color-grey padding-right text-align-center" id="lista_cant2'+conteoListado2+'"></div>');
    console.log(conteoListado2);
    $$("#actualizaStock2").removeClass('oculto').addClass('visible');
    $$("#eliminaLista2").removeClass('oculto').addClass('visible');
}


function eliminaLista (){
    conteoListado = 0;
    $$("#listar").html("");
    $$("#actualizaStock").removeClass('visible').addClass('oculto');
    $$("#eliminaLista").removeClass('visible').addClass('oculto');
}

function eliminaLista2 (){
    conteoListado2 = 0;
    $$("#listar2").html("");
    $$("#actualizaStock2").removeClass('visible').addClass('oculto');
    $$("#eliminaLista2").removeClass('visible').addClass('oculto');
}

function actualizaStock () {
    for (var i = 1; i <= conteoListado; i++) {
        actualiza_codigo = $$("#lista_prod"+i).val();
        actualiza_cantidad = $$("#lista_cant"+i).val();
        actualiza_stock = $$("#lista_stock"+i).val();
        stock_final = parseInt(actualiza_stock) + parseInt(actualiza_cantidad);

        console.log("Voy a actualizar el codigo " + actualiza_codigo + " con un stock de " + actualiza_stock + " con la cantidad de: " + actualiza_cantidad + ". Total: " + stock_final);
        
        ahre(actualiza_codigo,stock_final);
    };

    eliminaLista();
}

function actualizaStock2 () {
    for (var i = 1; i <= conteoListado2; i++) {
        
        actualiza_codigo2 = $$("#lista_prod2"+i).val();
        actualiza_cantidad2 = $$("#lista_cant2"+i).val();
        actualiza_stock2 = $$("#lista_stock2"+i).val();
        stock_final2 = parseInt(actualiza_stock2) - parseInt(actualiza_cantidad2);

        console.log("Voy a actualizar el codigo " + actualiza_codigo2 + " con un stock de " + actualiza_stock2 + " con la cantidad de: " + actualiza_cantidad2 + ". Total: " + stock_final2);
        
        ahre2(actualiza_codigo2,stock_final2);
    };

    eliminaLista2();
}

function ahre(actualiza_codigo,stock_final) {
    return colProductos.doc(actualiza_codigo).update({
            stock: stock_final,
        })
        .then(() => {
            console.log("Stock Actualizado!");
        })

        .catch((error) => {
            console.error("Error updating document: ", error);
        });
}

function ahre2(actualiza_codigo2,stock_final2) {
    return colProductos.doc(actualiza_codigo2).update({
            stock: stock_final2,
        })
        .then(() => {
            console.log("Stock Actualizado!");
        })

        .catch((error) => {
            console.error("Error updating document: ", error);
        });
}

function irProductos () {
    mainView.router.navigate('/productos/');
}

