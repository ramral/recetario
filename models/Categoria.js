const mongoose= require ('../conexion');
const { find } = require('./Categoria');

let categoriaSchema = mongoose.Schema({
    nombre: {
        type: String,
        requiere: true
    },
})



categoriaSchema.statics.guardarCategoria= async (newcategoria)=>{
    let categoria= new Categoria(newcategoria);
    console.log(newcategoria);
    try{
        let doc = await categoria.save();
        console.log(doc);
        return doc;
    }catch(e){
        console.log("Error al guardar" ,e.code);
        // throw e;
        return {error: 'Fallo al guardar'};
    }
}

categoriaSchema.statics.getCategoria= async (filtro,sk)=>{
    console.log(filtro);
    let re=[]
    let docs = await Categoria
                    .find(filtro,{'categorias._id':0})
                    .skip(parseInt(sk,10))
                    .limit(6);
    //console.log(docs);
    let max= await Categoria.find(filtro).count();
    console.log(max);
    re.push(max);
    re.push(docs)
    return re;
}

categoriaSchema.statics.updateCategoria = async function(_id, categoria ){
    let doc = await Categoria.findOneAndUpdate(
           {_id},
           {$set: categoria },
           {new: true, useFindAndModify: false} );
    return doc;
}

categoriaSchema.statics.deleteCategoria = async function(_id ){
    await Categoria.findOneAndDelete(
           {_id});
    return;
}

let Categoria= mongoose.model('categoria',categoriaSchema);



module.exports=Categoria;