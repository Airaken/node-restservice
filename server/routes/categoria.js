const express = require('express');
const app = express();
const Categoria = require('../models/categoria');
const { verificaToken, verificaAdminRole } = require('../middlewares/authenticacion');

//=============================
//Monstrar todas las categorias
//=============================
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoria) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };
            res.json({
                ok: true,
                categoria
            });
        });
});

//=============================
//Monstrar una categoria por ID
//=============================
app.get('/categoria/:usuario', verificaToken, (req, res) => {
    let usuario = req.params.usuario;
    Categoria.findById(usuario, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontro el ID'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });
});

//=============================
//Crear nueva categotia
//=============================
app.post('/categoria', [verificaToken, verificaAdminRole], (req, res) => {
    //regresa la nueva categoria
    let body = req.body;

    let categoria = new Categoria({
        usuario: req.usuario._id,
        descripcion: body.descripcion
    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })
});

//=============================
//Actualizar categoria
//=============================
app.put('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id
    let body = req.body;
    let descCategoria = {
        descripcion: body.descripcion
    }
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el id no existe'
                }
            });
        }
        res.json({
            ok: true,
            message: 'Categoria actualizada'
        })
    })
});

//=============================
//Borrar categoria
//=============================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categoria: categoriaDB
            })
        })
        // Categoria.findByIdAndRemove()
});

module.exports = app;