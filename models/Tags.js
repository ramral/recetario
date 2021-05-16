const mongoose= require ('../conexion');

let tagSchema = mongoose.Schema({
    nombre: {
        type: String,
        requiere: true
    }
})


tagSchema.statics.getTag= async ()=>{
    let docs = await Tag.find({});
    console.log(docs);
    return docs;
}

let Tag= mongoose.model('tag',tagSchema);

//Tag.getTag();


module.exports=Tag;