var express = require('express');     //necesito este para que funciones
var ABCC = require('./ABCCmongodb').ABCC;   //necesita mi archivo donde describo como esta la BD
var servidor = express();
var bodyParser = require('body-parser') //los dos estan en los paquetes de node
var ABCC= new ABCC('localhost', 27017);  // puerto de mongoDB

servidor.use( bodyParser.json() );
servidor.use( bodyParser.urlencoded({ extended: true  })); //url encoded ...??
servidor.set('views', __dirname + '/views');
servidor.set('view engine', 'jade');
servidor.use(require('stylus').middleware({ src: __dirname + '/public' }));
servidor.use(express.static(__dirname + '/public')); ///leee donde estan los estilos


servidor.get('/', function(request, response){
  ABCC.consultaTodo( function(error,docs){   //listar   consultar
    if(error) {
      console.log("mongo db error"+error); //consola ocurrio un error que no encontro nada ...listar
      docs = [];
    }
    response.render('index.jade', {autor: 'Bienvenido al Blog', articulos:docs});
  })
});

servidor.get('/blog/nuevo', function(request, response) {
    response.render('entrada.jade', {autor: 'Nueva Entrada' });///blog_nuevo.jade
});

servidor.post('/blog/nuevo', function(request, response){
  ABCC.Guardar({   //guardar
      autor: request.body.autorpost,
      texto: request.body.textopost
    }, function( error, docs) {
      response.redirect('/')
    });

});


servidor.get('/blog/:id', function(request, response) {
    var idObjeto = require('mongodb').ObjectID;
    var id = idObjeto.createFromHexString(request.params.id);
    ABCC.buscar(id, function(error, articulo) { //encontrar  consultar
        response.render('coment.jade', {autor: articulo.autor, articulo:articulo});
    });
});


servidor.post('/blog/ponComentario', function(request, response) { //pon comentario
    var idObjeto = require('mongodb').ObjectID;
    var articuloId = idObjeto.createFromHexString(request.body._id);

    ABCC.ponComentarioAlArticulo(articuloId, { //comentario
        autorcomentario: request.body.autorcomentario,
        comentario: request.body.comentario
       } , function( error, docs) {
           response.redirect('/blog/' + request.body._id)
       });
});

servidor.listen(4000);