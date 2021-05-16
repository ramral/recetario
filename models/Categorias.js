const mongoose= require ('../conexion');

let categoriaSchema = mongoose.Schema({
    nombre: {
        type: String,
        requiere: true
    }
})


categoriaSchema.statics.getCategoria= async ()=>{
    let docs = await Categoria.find({});
    console.log(docs);
    return docs;
}

let Categoria= mongoose.model('categoria',categoriaSchema);

//Categoria.getCategoria();


module.exports=Categoria;