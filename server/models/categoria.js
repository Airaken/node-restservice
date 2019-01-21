const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripcion es necesario']
    }
});

module.exports = mongoose.model('Categoria', categoriaSchema);