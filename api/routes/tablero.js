var express = require('express');
var router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: false }));


router.get('/palabras', function (req, res) {
  let dbConnection = req.app.locals.db;
  dbConnection.collection('Tableros').find().toArray(function (err, responseWords) {
    if (err !== null) {
      res.send({ mensaje: 'error' + err })
    } else {
      res.send({ responseWords: responseWords });
    }
  })
})

router.get('/recuperarpartida/:emailUsuario', function (req, res) {
  let dbConnection = req.app.locals.db;
  let emailUsuario = req.params.emailUsuario;
  console.log("recuperartiempo" , emailUsuario)
  
  dbConnection.collection('Users').find({ email: emailUsuario }).toArray(function (err, responsePartidaUsuario) {
    if (err !== null) {
      res.send({ mensaje: 'error' + err })
    } else {
      console.log(responsePartidaUsuario);
      res.send({ response: responsePartidaUsuario });
      // console.log(responsePartidaUsuario);
    }
  })
})



router.put('/actualizarpartida', function (req, res) {
  let dbConnection = req.app.locals.db;
  let sopaActualizada = req.body.arrayPalabrasCorrectas;
  let emailUsuario = req.body.emailUsuario;
  
  dbConnection.collection("Users").updateOne({email: emailUsuario}, {$set:{boardState: sopaActualizada}}, function (err, resp){
  
      if (err !== null) {
        // console.log(err);
        res.send({ mensaje: `Lo sentimos, ha habido un error ${err}` });
      } else {
        dbConnection.collection("Users").find({email: emailUsuario}).toArray(function(error, response){
          if(error !== null){

          } else{

            res.send({ mensaje: "Se ha guardado el juego.", data: response[0] });
          }
        })

      }
    })
  }
);

router.put('/partidafinalizada', function (req, res) {

  let dbConnection = req.app.locals.db;
  let estado = req.body.estado;
  let emailUsuario = req.body.emailUsuario;

  dbConnection.collection("Users").updateOne({ email: emailUsuario }, { $set: { estado: estado } }, function (err, resp) {

    // console.log("Hola", resp)
    if (err !== null) {
      // console.log(err);
      res.send({ mensaje: `Lo sentimos, ha habido un error ${err}` });
    } else {

      res.send({ mensaje: "Se ha guardado el juego." });

    }
  })

});



// guardar sopa de manera automática

router.put('/tableroInicial', function (req, res, next) {
  let dbConnection = req.app.locals.db;
  let users = dbConnection.collection('Users')
  let sopaLetras = req.body.array;
  let estado = req.body.estado;
  let emailUsuario = req.body.emailUsuario;

  users.updateOne({ email: emailUsuario }, { $set: { board: sopaLetras, estado: estado } }, function (err, resp) {
    if (err !== null) {
      // console.log(err);
      res.send({ mensaje: `Lo sentimos, ha habido un error ${err}` });
    } else {

      res.send({ mensaje: "Se ha guardado el juego." });

    }
  })
});



router.put('/pausaTemporizador', function (req, res) {
  let dbConnection = req.app.locals.db;
  let temporizador = {
    pausaMinutos: req.body.minutes,
    pausaSegundos: req.body.seconds
  }
  let emailUsuario = req.body.emailUsuario
  dbConnection.collection('Users').updateOne({ email: emailUsuario }, { $set: { temporizador: temporizador } }, function (err, resp) {
    // console.log('Hola', resp)
    if (err !== null) {

      res.send({ mensaje: `Lo sentimos, ha habido un error ${err}` });
    } else {
      res.send({ mensaje: 'Se ha guardado el tiempo.' });
    }
  })
})




router.put('/finTemporizador', function (req, res) {
  let dbConnection = req.app.locals.db;
  let temporizador = {
    pausaMinutos: req.body.minutes,
    pausaSegundos: req.body.seconds
  }
  let emailUsuario = req.body.emailUsuario
  dbConnection.collection('Users').updateOne({ email: emailUsuario }, { $set: { temporizador: temporizador } }, function (err, resp) {
    // console.log('Hola', resp)
    if (err !== null) {
      
      res.send({ mensaje: `Lo sentimos, ha habido un error ${err}` });
    } else {
      res.send({ mensaje: 'Se ha guardado el tiempo.' });
    }
  })
})





module.exports = router;
