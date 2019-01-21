const express = require('express');
const { verificaToken } = require('../middlewares/authenticacion');

let app = express();
let Producto = require('../models/producto');


//================
// Opten productos
//================
app.get('/productos', verificaToken, (req, res) => {
    // trae todo los productos 
    //populate:usuario categoria
    //paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);
    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            res.json({
                ok: true,
                producto
            })
        });

});

//=======================
// Opten productos por id
//=======================
app.get('/productos/:id', verificaToken, (req, res) => {
    //populate: usuario categoria
    //paginado 
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontro el ID'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            })
        });
});

//=================
// Buscar productos
//=================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i')
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500), json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                productos
            })
        })
})


//==================
// Cread un producto
//==================
app.post('/productos', verificaToken, (req, res) => {
    //grabar el usuario, categoria
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        res.json({
            ok: true,
            productoDB
        })
    });
});

//=======================
// Actualizar un producto
//=======================
app.put('/productos/:id', verificaToken, (req, res) => {
    //grabar el usuario, categoria
    let id = req.params.id;
    let body = req.body;
    let actProducto = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario: body.usuario
    }
    Producto.findByIdAndUpdate(id, actProducto, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'id no existe'
                }
            });
        };
        res.json({
            ok: true,
            message: 'producto actualizado'
        })
    })
});

//===================
// borrar un producto
//===================
app.delete('/productos/:id', verificaToken, (req, res) => {
    //grabar el usuario, categoria
    let id = req.params.id;
    let body = req.body;
    let disponible = {
        disponible: false
    }

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontro el ID'
                }
            });
        }
        productoDB.disponible = false
        productoDB.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            res.json({
                ok: true,
                producto: productoBorrado,
                message: 'producto borrado'
            })
        })
    });

    // Producto.findByIdAndUpdate(id, disponible, { new: true, runValidators: true }, (err, productoDB) => {
    //     if (err) {
    //         return res.status(500).json({
    //             ok: false,
    //             err
    //         });
    //     };
    //     if (!productoDB) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'id no existe'
    //             }
    //         });
    //     };
    //     res.json({
    //         ok: true,
    //         message: 'producto borrado'
    //     })
    // })
});


module.exports = app;