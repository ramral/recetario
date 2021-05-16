const mongoose= require ('../conexion');
const { find } = require('./Ingrediente');

let ingredienteSchema = mongoose.Schema({
    nombre: {
        type: String,
        requiere: true
    },

    medida:{
        type: String,
        requiere: true
    }
})



ingredienteSchema.statics.guardaringrediente= async (newingrediente)=>{
    let ingrediente= new Ingrediente(newingrediente);
    console.log(newingrediente);
    try{
        let doc = await ingrediente.save();
        console.log(doc);
        return doc;
    }catch(e){
        console.log("Error al guardar" ,e.code);
        // throw e;
        return {error: 'Fallo al guardar'};
    }
}

ingredienteSchema.statics.getIngrediente= async (filtro,sk)=>{
    console.log(filtro);
    let re=[]
    let docs = await Ingrediente
                    .find(filtro,{'ingredientes._id':0})
                    .skip(parseInt(sk,10))
                    .limit(6);
    //console.log(docs);
    let max= await Ingrediente.find(filtro).count();
    console.log(max);
    re.push(max);
    re.push(docs)
    return re;
}

ingredienteSchema.statics.updateIngrediente = async function(_id, ingrediente ){
    let doc = await Ingrediente.findOneAndUpdate(
           {_id},
           {$set: ingrediente },
           {new: true, useFindAndModify: false} );
    return doc;
}

ingredienteSchema.statics.deleteIngrediente = async function(_id ){
    await Ingrediente.findOneAndDelete(
           {_id});
    return;
}

let Ingrediente= mongoose.model('ingrediente',ingredienteSchema);



module.exports=Ingrediente;