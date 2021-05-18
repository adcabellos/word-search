var express = require('express');
var router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

// login

router.post('/', function (req, res, next) {
    let dbConnection = req.app.locals.db;
    let users = dbConnection.collection('Users')

    let email = req.body.correo;
    let pass = req.body.contrasenia;

    users.find({ "email": email }).toArray(function (err, response) {
        // console.log(response);
        if (response.length == 0) {
            res.send({ mensaje: "El usuario no existe" });
        } else {
            let contrasenia = response[0].pass;

            if (pass == contrasenia) {

                res.send({ mensaje: 'login' });
            } else {

                res.send({ mensaje: "La contraseña introducida no es correcta." });
            }

        }
    })
});

module.exports = router;
