var express = require('express');
var router = express.Router();

router.get('/estadopartida/:emailUsuario', function (req, res){
  let dbConnection = req.app.locals.db;
  let emailUsuario = req.params.emailUsuario;
  

  dbConnection.collection('Users').find({email: emailUsuario}).toArray(function(err, response){
    if(err !== null){
      res.send({mensaje: 'error' + err})
    } else{
    //  console.log(response)
      res.send({enviarEmail:response});
    }
  })
})

router.get('/recogerestadisticas', function (req, res) {
  let dbConnection = req.app.locals.db;
  dbConnection = dbConnection.collection('Users').find().toArray(function(err, datosUser){
    
    if(err !== null){
      res.send({mensaje: 'error' + err})
    } else{
      res.send({datosUser:datosUser});
    }
  })
})

module.exports = router;
