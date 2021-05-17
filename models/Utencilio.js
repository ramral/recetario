const mongoose= require ('../conexion');
const { find } = require('./Utencilio');

let utencilioSchema = mongoose.Schema({
    nombre: {
        type: String,
        requiere: true
    },
})



utencilioSchema.statics.guardarUtencilio= async (newutencilio)=>{
    let utencilio= new Utencilio(newutencilio);
    console.log(newutencilio);
    try{
        let doc = await utencilio.save();
        console.log(doc);
        return doc;
    }catch(e){
        console.log("Error al guardar" ,e.code);
        // throw e;
        return {error: 'Fallo al guardar'};
    }
}

utencilioSchema.statics.getUtencilio= async (filtro,sk)=>{
    console.log(filtro);
    let re=[]
    let docs = await Utencilio
                    .find(filtro,{'utencilios._id':0})
                    .skip(parseInt(sk,10))
                    .limit(6);
    //console.log(docs);
    let max= await Utencilio.find(filtro).count();
    console.log(max);
    re.push(max);
    re.push(docs)
    return re;
}

utencilioSchema.statics.updateUtencilio = async function(_id, utencilio ){
    let doc = await Utencilio.findOneAndUpdate(
           {_id},
           {$set: utencilio },
           {new: true, useFindAndModify: false} );
    return doc;
}

utencilioSchema.statics.deleteUtencilio = async function(_id ){
    await Utencilio.findOneAndDelete(
           {_id});
    return;
}

let Utencilio= mongoose.model('utencilio',utencilioSchema);



module.exports=Utencilio;