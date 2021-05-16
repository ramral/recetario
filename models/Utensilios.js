const mongoose= require ('../conexion');

let utensilioSchema = mongoose.Schema({
    nombre: {
        type: String,
        requiere: true
    }
})


utensilioSchema.statics.getUtensilio= async ()=>{
    let docs = await Utensilio.find({});
    console.log(docs);
    return docs;
}

let Utensilio= mongoose.model('utensilio',utensilioSchema);

//Utensilio.getUtensilio();


module.exports=Utensilio;