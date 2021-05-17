const mongoose= require ('../conexion');
const { find } = require('./Utensilio');

let utensilioSchema = mongoose.Schema({
    nombre: {
        type: String,
        requiere: true
    },
})



utensilioSchema.statics.guardarUtensilio= async (newutensilio)=>{
    let utensilio= new Utensilio(newutensilio);
    console.log(newutensilio);
    try{
        let doc = await utensilio.save();
        console.log(doc);
        return doc;
    }catch(e){
        console.log("Error al guardar" ,e.code);
        // throw e;
        return {error: 'Fallo al guardar'};
    }
}

utensilioSchema.statics.getUtensilio= async (filtro,sk)=>{
    console.log(filtro);
    let re=[]
    let docs = await Utensilio
                    .find(filtro,{'utensilios._id':0})
                    .skip(parseInt(sk,10))
                    .limit(6);
    //console.log(docs);
    let max= await Utensilio.find(filtro).count();
    console.log(max);
    re.push(max);
    re.push(docs)
    return re;
}

utensilioSchema.statics.updateUtensilio = async function(_id, utensilio ){
    let doc = await Utensilio.findOneAndUpdate(
           {_id},
           {$set: utensilio },
           {new: true, useFindAndModify: false} );
    return doc;
}

utensilioSchema.statics.deleteUtensilio = async function(_id ){
    await Utensilio.findOneAndDelete(
           {_id});
    return;
}

let Utensilio= mongoose.model('utensilio',utensilioSchema);



module.exports=Utensilio;