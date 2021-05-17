const mongoose= require ('../conexion');
const { find } = require('./Tag');

let tagSchema = mongoose.Schema({
    nombre: {
        type: String,
        requiere: true
    },
})



tagSchema.statics.guardarTag= async (newtag)=>{
    let tag= new Tag(newtag);
    console.log(newtag);
    try{
        let doc = await tag.save();
        console.log(doc);
        return doc;
    }catch(e){
        console.log("Error al guardar" ,e.code);
        // throw e;
        return {error: 'Fallo al guardar'};
    }
}

tagSchema.statics.getTag= async (filtro,sk)=>{
    console.log(filtro);
    let re=[]
    let docs = await Tag
                    .find(filtro,{'tags._id':0})
                    .skip(parseInt(sk,10))
                    .limit(6);
    //console.log(docs);
    let max= await Tag.find(filtro).count();
    console.log(max);
    re.push(max);
    re.push(docs)
    return re;
}

tagSchema.statics.updateTag = async function(_id, tag ){
    let doc = await Tag.findOneAndUpdate(
           {_id},
           {$set: tag },
           {new: true, useFindAndModify: false} );
    return doc;
}

tagSchema.statics.deleteTag = async function(_id ){
    await Tag.findOneAndDelete(
           {_id});
    return;
}

let Tag= mongoose.model('tag',tagSchema);



module.exports=Tag;