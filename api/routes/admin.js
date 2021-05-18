var express = require('express');
var router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

// router para guardar palabras de admin en BBDD

// router.post('/crearsopa', function(req, res, next) {
//   let dbConnection = req.app.locals.db;
//   let nombreColeccion = dbConnection.collection('nombreColeccion')

//   let palabrasSopa = [];

//   nombreColeccion.insertOne(palabrasSopa, function (err, resp) {
//     if (err !== null) {
//       console.log(err);
//       res.send({ mensaje: `Lo sentimos, ha habido un error ${err}` });
//     } else {

//       res.send({ mensaje: "Palabras introducidas correctamente." });

//     }
//   })
// });

// modificar palabras sopa

router.put('/modificar', function(req, res, next) {
  let dbConnection = req.app.locals.db;
  let nombreColeccion = dbConnection.collection('nombreColeccion')

  let palabrasSopa = [];

  nombreColeccion.updateOne({ usuario: usuario },{clavevalor: palabrasSopa}, function (err, resp) {
    if (err !== null) {
      console.log(err);
      res.send({ mensaje: `Lo sentimos, ha habido un error ${err}` });
    } else {

      res.send({ mensaje: "Palabras modificadas correctamente." });

    }
  })
});

router.get('/recogertiempoadmin', function (req, res) {
  let dbConnection = req.app.locals.db;
  dbConnection = dbConnection.collection('Tableros').find().toArray(function(err, tiempoAdmin){
    
    if(err !== null){
      res.send({mensaje: 'error' + err})
    } else{
      res.send({tiempoAdmin:tiempoAdmin});
    }
  })
})

module.exports = router;
