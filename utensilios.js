const router = require("express").Router();
const fs = require('fs')
const path = require('path')
const Utensilio = require("./models/Utensilio");
const jwt = require("jsonwebtoken");
const { route } = require("./users");
const { restart } = require("nodemon");
const { test } = require("./middlewares/logs");

const secret = "gH$iDa&T0Gr3&@kTcly09DB#$FcC3tNGBQvVCf@M";

function authPer(token) {
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return 
    }
    let reg=[];
    reg.push(decoded.rol);
    reg.push(decoded.email);
    console.log(`reg 0 es ${reg[0]}`);
    return reg;
  }

router.get('/', async(req,res)=>{
    let {sk}=req.query;
    let {nombre}= req.query;
    let filtro={};
    let and=[];
    if(nombre)
        filtro.nombre = new RegExp(nombre,'i')
    let lista= await Utensilio.getUtensilio(filtro,sk);
    if(lista[1]){
        res.status(200).send(lista);
        return;
    }else{
        res.status(404).send({error: "No se encontro ningun Utensilio"})
    }
})

router.post('/', async(req,res)=>{
    let token = req.headers["x-auth"];
    let us=authPer(token);
    console.log(us);
    if(us[0]=="regular"){
        res.status(401).send({error: "Usuario no autorizado"})
        return
    }
    let {nombre}= req.body;
    let newUtensilio={nombre}
    let faltan= Object.keys(newUtensilio).filter(prop=> newUtensilio[prop]==undefined).join();
    if(faltan){
        res.status(400).send(`Falta: ${faltan}`);
        return;
    }
    let doc = await Utensilio.guardarUtensilio({nombre})
        if(doc && !doc.error ){
            res.status(201).send(doc)
        }else{
            res.status(400).send(doc)
        }
        return;
})

router.get('/:id', async(req,res)=>{
    console.log(req.params.id);
    let token = req.headers["x-auth"];
    let us=authPer(token);
    console.log(us);
    if(!us){
        res.status(401).send({error: "Usuario no ingresado"})
        return
    }
    let doc = await Utensilio.getUtensilio({_id : req.params.id});
    if(doc[0]){
        res.status(200).send(doc);
        return;
    }else{
        res.status(404).send({error: "No se encontro ningun Utensilio"})
    }
})

router.put('/:id', async (req,res)=>{
    let token = req.headers["x-auth"];
    let us=authPer(token);
    console.log(us);
    let utensilio = await Utensilio.getUtensilio({_id : req.params.id});
    if(us[0]!="admin"){
        res.status(401).send({error: "Usuario no autorizado"})
        return
    }
    if(!utensilio[0]){
        res.status(404).send({error: "No se encontro el Utensilio a actualizar"})
           return;
    }else{
        let {nombre}= req.body;
        let doc= await Utensilio.updateUtensilio(req.params.id,{nombre});
        res.status(200).send(doc);
    }
})

router.delete('/:id', async (req,res)=>{
    let token = req.headers["x-auth"];
    let us=authPer(token);
    console.log(us);
    let utensilio = await Utensilio.getUtensilio({_id : req.params.id});
    if(us[0]!="admin"){
        res.status(401).send({error: "Usuario no autorizado"});
        return 
    } 
    if(!utensilio[0]){
        res.status(404).send({alert: "Utensilio no encontrado"});
        return
    }else{
        await Utensilio.deleteUtensilio(req.params.id);
        res.status(200).send({alert: "Se ha eliminado"});
        return
    }
})
module.exports = router;