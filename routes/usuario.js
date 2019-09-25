var express = require('express');
//var bcrypt = require('bcrypt');
var saltRounds = 10;
var jwt = require('jsonwebtoken');

var app = express();

var Usuario = require('../models/usuario');

var mdAutentication = require('../middlewares/autentications');

// ================================================
// Obtener todos los usuarios
// ================================================

app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role').exec(
        (err, usuarios) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuario',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                usuarios: usuarios
            });
        });
});

// ================================================
// Actualizar un nuevo usuario 
// ================================================

app.put('/:id', mdAutentication.verificaToken, (req, res) => {

    var id = req.params.id;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        var body = req.body;

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;
        usuario.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });

            }
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });


    });

});

// ================================================
// Crear un nuevo usuario 
// ================================================

app.post('/', mdAutentication.verificaToken, (req, res, next) => {

    var body = req.body;

    var usuario = new Usuario({

        nombre: body.nombre,
        email: body.email,
        //  password: bcrypt.hashSync(body.password, saltRounds),
        password: body.password,
        img: body.img,
        role: body.role

    });

    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });

        }
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });
        return next();
    });


});

// ================================================
// Borrar un usuario
// ================================================

app.delete('/:id', mdAutentication.verificaToken, (req, res, next) => {

    var id = req.params.id;

    Usuario.findByIdAndDelete(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'NO existe el usuario con el id ' + id,
                errors: {
                    message: 'No existe un usuario con ese ID'
                }
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });


    });

});


module.exports = app;