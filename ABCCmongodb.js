var Db = require('mongodb').Db;
var conexion = require('mongodb').conexion;//
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

ABCC = function(host, port) {
  this.base = new Db('nodeblog', new Server(host, port, {auto_reconnect: true}, {}));//nodeblog
  this.base.open(function(){});
};


ABCC.prototype.obtenerColeccion= function(callback) {
  this.base.collection('articulos', function(error, coleccion) {
    if( error ) callback(error);
    else callback(null, coleccion);
  });
};

ABCC.prototype.consultaTodo = function(callback) {
    this.obtenerColeccion(function(error, coleccion) {
      if( error ) callback(error)
      else {
        coleccion.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};


ABCC.prototype.buscar = function(id, callback) {
    this.obtenerColeccion(function(error, coleccion) {
      if( error ) callback(error)
      else {
        coleccion.findOne({_id: id}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

ABCC.prototype.Guardar = function(articulos, callback) {
    this.obtenerColeccion(function(error, coleccion) {
      if( error ) callback(error)
      else {
        if( typeof(articulos.length)=="undefined")
          articulos = [articulos];

        for( var i =0;i< articulos.length;i++ ) {
          article = articulos[i];
          article.fecha = new Date();
          if( article.comentarios === undefined ) article.comentarios = [];
          for(var j =0;j< article.comentarios.length; j++) {
            article.comentarios[j].fecha = new Date();
          }
        }

        coleccion.insert(articulos, function() {
          callback(null, articulos);
        });
      }
    });
};

ABCC.prototype.ponComentarioAlArticulo = function(articuloId, comentario, callback) {
  this.obtenerColeccion(function(error, coleccion) {
    if( error ) callback( error );
    else {
      coleccion.update(
        {_id: articuloId},
        {"$push": {comentarios: comentario}},
        function(error, article){
          if( error ) callback(error);
          else callback(null, article)
        });
    }
  });
};

exports.ABCC = ABCC;