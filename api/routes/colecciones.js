var express = require('express');
var router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.put('/crearTablero', function (req, res, next) {
    let dbConnection = req.app.locals.db;
    let tableros = dbConnection.collection('Tableros')

    // let datosTablero = {
        let palabras = req.body.palabras;
        let tiempo =
             {
                minutos: req.body.minutes,
                segundos: req.body.seconds
            }
              
    // }

    tableros.updateOne({partida: "nueva partida"}, {$set:{palabras: palabras, tiempo: tiempo}}, function (err, resp) {
        if (err !== null) {
            console.log(err);
            res.send({ mensaje: `Lo sentimos, ha habido un error ${err}` });
        } else {

            res.send({ mensaje: "Datos introducidos correctamente" });

        }
    })

});


router.get('/crearTemporizador', function(req, res){
    let dbConnection = req.app.locals.db;
      dbConnection = dbConnection.collection('Tableros').find().toArray(function(err, temporizador){
        if(err !== null){
          res.send({mensaje: 'error' + err})
        } else{
           // console.log(temporizador)
          res.send({crearTemporizador:temporizador});
        }
      })
})

// router.get('/palabras', function (req, res){
//   let dbConnection = req.app.locals.db;
//   dbConnection = dbConnection.collection('Words').find().toArray(function(err, responseWords){
//     if(err !== null){
//       res.send({mensaje: 'error' + err})
//     } else{
//       res.send(responseWords);
//     }
//   })
// })




module.exports = router;