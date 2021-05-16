function log(val) { console.log("726396",val); }
let recetas=[];
//numero de registros
let np;
//numero de pagina actual
let numeropag;
//receta ocn la que se esta trabajando
let recetaactual;
//model de ver
let verr=document.querySelector('#recetaver');
//model de editar
let edi=document.querySelector('#Editt');
//boton actualizar
let actualizar=document.querySelector('#Actualizar');
//boton crear nueva receta
let guardarrecer=document.querySelector('#guardcrear');
//saber si existe un filtro para el paginado
let filtro;
//hacer el paginado , los botones no funcionan y poner la variable filtro en la funcion buscar y en la funcion de load
let ingred;
let utens;
let eliminar=document.querySelector('#botonacepeliminar');

let det=document.querySelector('#detalle2');

async function listing_ingredients() {
    resp = await fetch(`https://recetariodasw.herokuapp.com/api/ingredientes`, {
      method: "GET",
      headers: {
        "x-auth": sessionStorage.token,
      },
    });
    if(resp.status==200){
        //log('cargo datos')
        ingred= await resp.json();
    }else{
        alert('Ha ocurrido un error');
    }
  }

 function insert_ingredients(id) {
    let select = document.getElementById(id);
    for (let i = 0; i < ingred.length; i++) {
      let option = document.createElement("option");
      option.innerHTML =
        "<option value='" +
        ingred[i].nombre +
        "'>" +
        ingred[i].nombre +
        " </option> ";
      
      select.appendChild(option.firstChild);
    }
  } 
  
  async function listing_utensilios(id) {
    let res = await fetch(`https://recetariodasw.herokuapp.com/api/Utensilio`, {
      method: "GET",
      headers: {
        "x-auth": sessionStorage.token,
      },
    })
    if(resp.status==200){
        //log('cargo datos')
        utens= await res.json();
    }else{
        alert('Ha ocurrido un error');
    }
  }

  function insert_utenss(id) {
    let select = document.getElementById(id);
    for (let i = 0; i < utens.length ; i++) {
      let option = document.createElement("option");
      option.innerHTML =
        "<option value='" +
        utens[i].nombre+
        "'>" +
        utens[i].nombre+
        " </option> ";
      
      select.appendChild(option.firstChild);
    }
  } 

  async function buscar(e) {
    e.preventDefault();
    
    let string = "&";
    let nombre=document.getElementById('nombrebuscar').value;
    if (nombre!="") string += `nombre=${nombre}`
    let ingrediente = document.getElementById("select-ingredientes").value;
    if (ingrediente ) string += `ingredientes=${ingrediente}`
    //log("aqui estoy");
  
    let utensilio = document.getElementById("select-utensilio").value;
    if(utensilio){
      if(string.length>1){
        string += `&utencilios=${utensilio}`
      }
      else
        string+=`utencilios=${utensilio}`
        
    }
  
    let categoria = document.getElementById("select-categorias").value;
    if(categoria!=0){
      if(string.length>1){
        string += `&categoria=${categoria}`
      }
      else
        string+=`categoria=${categoria}`
        
    }
  
    let etiqueta = document.getElementById("select-etiqueta").value;
    if(etiqueta!=0){
      if(string.length>1){
        string += `&etiquetas=${etiqueta}`
      }
      else
        string+=`etiquetas=${etiqueta}`    
    }
    log(`esto envia${string}`);
    filtro=string;
    numeropag=0;
    await paginado(0);
  }
  document.getElementById("buscar").addEventListener("click", buscar);

window.onload = async function () {
    await listing_ingredients();
    await listing_utensilios();
    insert_utenss("select-utensilio");
    insert_utenss("ut1");
    insert_utenss("ut2");
    insert_utenss("ut3");
    insert_ingredients("select-ingredientes");
    insert_ingredients("select-ingredientes1");
    insert_ingredients("select-ingredientes2");
    insert_ingredients("select-ingredientes3");
    insert_ingredients("select-ingredientes4");
    insert_ingredients("select-ingredientes5");

    if (sessionStorage.us=="regular" || sessionStorage.us==null) {
      document.getElementById("crear").classList.add("oculto");
    }else{
        document.getElementById("crear").classList.remove("oculto");
    }
    if (sessionStorage.token!=null) {
        document.getElementById("Linkreg").classList.add("oculto");
        document.getElementById("login").innerText="logout";
    }else{
        document.getElementById("Linkreg").classList.remove("oculto");
        document.getElementById("login").innerText="login";
    }
    document.getElementById("login").addEventListener("click", function () {
        sessionStorage.token = null;
        sessionStorage.us = null;
      });
};

document.getElementById("login").addEventListener("click", function () {
    sessionStorage.token = null;
    sessionStorage.us=null;
    sessionStorage.email=null;
    //window.location.href="Login.html";
  });

async function load(){
    log(`pagina de load ${numeropag}`);
    if(numeropag==undefined){
        numeropag=0;
    }else{
        sk=numeropag*6
    }
    // log(`busqueda ${string}`);
    if(filtro=="&"){
        filtro="";
    }
    // log(`busqueda despues ${string}`);
    //pedir los datos con fetch
    let resp= await fetch(`https://recetariodasw.herokuapp.com/api/Recipe?sk=${sk}${filtro}`,{
        method: 'GET',
        headers:{
            'x-auth': sessionStorage.token
        },
    });
    if(resp.status==200){
        //log('cargo datos')
        recetas= await resp.json();
        //una vez teniendo los datos pasarlos a userlist para ponerlos en pantalla
        recetasListToHTML(recetas[1]);
        np=recetas[0]
        log(`numero de recetas ${np}`);
        agregarboton();
        //poner botones de busqueda necesarios
    }else{
        alert('Ha ocurrido un error');
    }
}

function recipeToHtml(recipe){
    return`
    <tr>
    <td>${recipe.nombre}</td>
    <td>${recipe.categoria}</td>
    <td>
        <ul>
            ${listing(recipe.ingredientes)}
        </ul>
    </td>
    <td>
        <ul>
        ${list(recipe.utencilios)}                                 
        </ul>
    </td>
    <td>
        <ul>
        ${list(recipe.etiquetas)}
        </ul>
    </td>
    <td>
        <img class="brand-logo-light"
    src=${recipe.url}
    alt="" width="140">
    </td>
    <td width="50px">
        <div class="btn-group" role="group" aria-label="Basic example">
            <a onclick="verdetalle('${recipe._id}')" class="btn-sm  btn-success text-center" href="" data-toggle="modal" data-dismiss="modal" data-target="#ver" ><i class="far fa-eye"></i> ver</a>
            <a onclick="editarrect('${recipe._id}')" class="btn-sm btn-primary text-center ${editarbotton(recipe.correo)}" href="" data-toggle="modal" data-dismiss="modal" data-target="#detalleEditar" ><i class="far fa-fw fa-edit"></i> Editar</a>
            <a onclick="confirmacionborrar('${recipe._id}')" class="confirmation btn-sm btn-danger text-center ${borrabotton(recipe)}" href="" data-toggle="modal" data-dismiss="modal" data-target="#borrarmodal"  ><i class="far fa-fw fa-trash-alt"></i> Eliminar</a>
        </div>
    </td>
    </tr>
    `
}
function editarbotton(correo){
    if(sessionStorage.us=="regular" || sessionStorage.us==null){
        return("oculto")
    }else if(sessionStorage.us=="chef"){
        if((sessionStorage.email).toUpperCase()==correo.toUpperCase()){
            return;
        }else{
            return("oculto");
        }
    }else{
        return;
    }
    
}
function borrabotton(correo){
    if(sessionStorage.us!="admin"){
        return("oculto")
    }else{
        return;
    }
}

function listing(ingre){
    let r="";
    for(let i=0;i<ingre.length;i++){
        r+="<li>"+ingre[i].nombre+" "+ingre[i].cantidad+"</li>";
    }
    return(r);
}

function list(type){
    let r="";
    for(let i=0;i<type.length;i++){
        r+="<li>"+type[i]+"</li>";
    }
    return(r);
}

function recetasListToHTML(recetasl){
    //limpipa la pantalla
    listarecetas.innerText="";
    //pone los nuevos datos en pantalla
    //document.querySelector('#listarecetas').insertAdjacentHTML('beforeend',recipeToHtml(recetasl[0]));
    for(let i=0;i<recetasl.length;i++){
        document.querySelector('#listarecetas').insertAdjacentHTML('beforeend',recipeToHtml(recetasl[i]));
    }
}

async function actual(id){
    let resp= await fetch(`https://recetariodasw.herokuapp.com/api/Recipe/${id}`,{
        method: 'GET',
        headers:{
            'x-auth': sessionStorage.token
        },
    });
    if(resp.status==200){
        //log('cargo datos')
        let s= await resp.json();
        recetaactual=s[1];
    }else{
        alert('Ha ocurrido un error');
    }
}

function listver(ele,list){
    while (ele.firstChild){
        ele.removeChild(ele.firstChild);
      };
    for (let i = 0; i < list.length; i++) {
        let li = document.createElement("li");
        li.innerHTML =
        "<li>" +
        list[i] +
        " </li> ";
        ele.appendChild(li.firstChild);
  }
}
function listvering(ele,list){
    while (ele.firstChild){
        ele.removeChild(ele.firstChild);
      };
    for (let i = 0; i < list.length; i++) {
        let li = document.createElement("li");
        li.innerHTML =
        "<li>" +
        list[i].cantidad +" "+
        list[i].nombre +
        " </li> ";
        ele.appendChild(li.firstChild);
  }
}

async function verdetalle(id){
    await actual(id);
    console.log(recetaactual[0].nombre);
    document.querySelector('#Nombrever').innerText=recetaactual[0].nombre;
    verr.querySelector('#vercat').innerText=recetaactual[0].categoria;
    verr.querySelector('#imaagen').src=recetaactual[0].url;
    let ele = document.getElementById("verute");
    listver(ele,recetaactual[0].utencilios);
    ele = document.getElementById("veringr");
    listvering(ele,recetaactual[0].ingredientes);
    verr.querySelector('#verproc').innerText=recetaactual[0].receta;
    ele = document.getElementById("vereti");
    listver(ele,recetaactual[0].etiquetas);
}

function listedi(ele,list){
    while (ele.firstChild){
        ele.removeChild(ele.firstChild);
      };
      
      for (let i = 0; i < list.length; i++) {
        let li = document.createElement("li");
        li.innerHTML =
        `<select class="form-control" disabled><option>` +
        list[i] +
        " </option></select> ";
        ele.appendChild(li.firstChild);
  }
      ;
}

async function editarrect(id){
    await actual(id);
    edi.querySelector('#editnombre').value=recetaactual[0].nombre;
    edi.querySelector('#select-categorias1').value=recetaactual[0].categoria;
    let ele = document.getElementById("editut");
    log(recetaactual[0].utencilios)
    listedi(ele,recetaactual[0].utencilios);
    edi.querySelector('#Porced').value=recetaactual[0].receta;
    log(recetaactual[0].etiquetas)
    ele = document.getElementById("etiqb");
    listedi(ele,recetaactual[0].etiquetas);
    edi.querySelector('#editurl').value=recetaactual[0].url;
}

async function confirmacionborrar(id){
    await actual(id);
    document.querySelector('#eliniarrec').innerText=`Eliminar: ${recetaactual[0].nombre}`
}

eliminar.addEventListener("click", async function(e){
    e.preventDefault();
    id=recetaactual[0]._id
    let resp= await fetch(`https://recetariodasw.herokuapp.com/api/Recipe/${id}`,{
        method: 'DELETE',
        headers:{
            'x-auth': sessionStorage.token}
    });
    log(`estatus es ${resp.status}`);
    if(resp.status==200){
        log(`pagina enviada ${numeropag}`);
        paginado(numeropag);
    }else{
        alert('Ha ocurrido un error');
    }
});

actualizar.addEventListener("click", async function(e){
    e.preventDefault();
    let f={
        "nombre": edi.querySelector('#editnombre').value,
        "ingredientes":recetaactual[0].ingredientes,
        "receta": edi.querySelector('#Porced').value,
        "categoria":edi.querySelector('#select-categorias1').value,
        "utencilios":recetaactual[0].utencilios,
        "etiquetas":recetaactual[0].etiquetas,
        "url":edi.querySelector('#editurl').value,
        "correo":recetaactual[0].correo
    }
    let imp=JSON.stringify(f);
    //console.log(imp);
    let resp= await fetch(`https://recetariodasw.herokuapp.com/api/Recipe/${recetaactual[0]._id}`,{
        method: 'PUT',
        headers:{
            'x-auth': sessionStorage.token,
            'Content-Type': 'application/json'},
        body: imp
    });
    //console.log(resp.status);
    if(resp.status==200){
        paginado(0);
        alert('El usuario se ha Actualizado')
        log('Actualizado');
    }else{
        alert('Ha ocurrido un error');
    }
})

det.addEventListener("change", function (e) {
    //checar si todos los registros son validos
    log("cambio")
    if (det.querySelectorAll('* :invalid').length==0){
        log('son validos')
        guardarrecer.removeAttribute('disabled');
    }else{
        if(!guardarrecer.hasAttribute('disabled')){
            guardarrecer.setAttribute('disabled','true');
        }
    }
})

guardarrecer.addEventListener("click", async function(e){
    e.preventDefault();
    let inc=[];
    class ing{
        constructor(nombre,cantidad){
            this.nombre=nombre;
            this.cantidad=cantidad;
        }
      }
    for(let h=1;h<4;h++){
        if(document.querySelector(`#select-ingredientes${h}`).value!=0){
            let nom=document.querySelector(`#select-ingredientes${h}`).value;
            let cant=document.querySelector(`#select-cantidad${h}`).value;
            log(nom);
            inc.push(new ing(nom,cant));
        }
    }
    let ute=[];
    for(let h=1;h<4;h++){
        if(document.querySelector(`#ut${h}`).value!=0){
            ute.push(document.querySelector(`#ut${h}`).value);
        }
    }
    let eti=[];
    for(let h=1;h<3;h++){
        if(document.querySelector(`#select-etiqueta${h}`).value!=0){
            eti.push(document.querySelector(`#select-etiqueta${h}`).value);
        }
    }
    console.log(inc);
    console.log(ute);
    let u=document.querySelector('#urlcrear').value;
    log(`la url ${u}`);
    if (!u){
        u="https://www.seekpng.com/png/full/524-5248604_comida-icono-png-iconos-de-comida-png.png"
    }
    let f={
        "nombre": document.querySelector('#Nuevonombre').value,
        "ingredientes":inc,
        "receta": document.querySelector('#Proc').value,
        "categoria":document.querySelector('#cat1').value,
        "utencilios":ute,
        "etiquetas":eti,
        "correo":sessionStorage.email,
        "url": u

    }
    let imp=JSON.stringify(f);
    console.log(imp);
    let resp= await fetch(`https://recetariodasw.herokuapp.com/api/Recipe`,{
        method: 'POST',
        headers:{
            'x-auth': sessionStorage.token,
            'Content-Type': 'application/json'},
        body: imp
    });
    console.log(resp.status);
    if(resp.status==201){
        alert('Se ha creado nueva receta')
        log('Receta');
        paginado(numeropag);
        det.reset();
        guardarrecer.setAttribute('disabled','true');
    }else{
        alert('Ha ocurrido un error');
    }
})

//pone los botones necesarios
function agregarboton(){
    //limpia el html para que si se hace mas de una busqueda no se dupliquen los botones
    document.querySelector('.pagination').innerText='';
    let agregar=`<li ><button class="btn btn-outline-dark botonpag" onclick="paginado('p')" id="prev">Previous</button></li>`;
    let paginas=np/6;
    log(`numero de paginas ${paginas}`);
    for(let i=1;i<paginas+1;i++){
        agregar+=`<li><button class="btn btn-outline-dark botonpag" onclick="paginado('${i-1}')" id='bot${i-1}' >${i}</button></li>`
        //log(agregar);
    }
    agregar+=`<li ><button class="btn btn-outline-dark botonpag" onclick="paginado('n')" id="next">Next</button></li>`
    document.querySelector('.pagination').insertAdjacentHTML("beforeend",agregar);
}

//hace la division de los usuarios en paginas
async function  paginado(pag){
    //si es next o previus el boton hace los calculos
    log(`pagina entregada ${numeropag}`);
    if(pag=='n'){
        numeropag++;
        pag=numeropag;
    }else if(pag=='p'){
        numeropag--;
        pag=numeropag;
    }else{
        numeropag=pag;
    }
    log(numeropag)
    await load();
    document.querySelectorAll('.botonpag').forEach(e=>{ e.removeAttribute('disabled') })
    //deshabilita los botones necesarios
    if(numeropag==0){
        document.querySelector('#prev').setAttribute('disabled','true');
    }
    if(numeropag+1>=np/6){
        document.querySelector('#next').setAttribute('disabled','true');
    }
    document.querySelector(`#bot${numeropag}`).setAttribute('disabled','true');

}

paginado(0);
