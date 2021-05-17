function log(val) { console.log("683153",val); }
let utencilios=[];
//numero de registros
let np;
//numero de pagina actual
let numeropag;
//Utencilio ocn la que se esta trabajando
let Utencilioactual;
//model de ver
let verr=document.querySelector('#Utenciliover');
//model de editar
let edi=document.querySelector('#Editt');
//boton actualizar
let actualizar=document.querySelector('#Actualizar');
//boton crear nueva Utencilio
let guardarUtencilio=document.querySelector('#guardcrear');
//saber si existe un filtro para el paginado
let filtro;
//hacer el paginado , los botones no funcionan y poner la variable filtro en la funcion buscar y en la funcion de load
let eliminar=document.querySelector('#botonacepeliminar');

let det=document.querySelector('#detalle2');

  async function buscar(e) {
    e.preventDefault();
    
    let string = "&";
    let nombre=document.getElementById('nombrebuscar').value;
    if (nombre!="") string += `nombre=${nombre}`
    log(`esto envia${string}`);
    filtro=string;
    numeropag=0;
    await paginado(0);
  }
  document.getElementById("buscar").addEventListener("click", buscar);

window.onload = async function () {
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
};

document.getElementById("login").addEventListener("click", function () {
    sessionStorage.token = null;
    sessionStorage.us=null;
    sessionStorage.email=null;
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
    let resp= await fetch(`https://ramral.herokuapp.com/api/Utencilio?sk=${sk}${filtro}`,{
        method: 'GET',
        headers:{
            'x-auth': sessionStorage.token
        },
    });
    if(resp.status==200){
        //log('cargo datos')
        utencilios= await resp.json();
        //una vez teniendo los datos pasarlos a userlist para ponerlos en pantalla
        utenciliosListToHTML(utencilios[1]);
        np=utencilios[0]
        log(`numero de utencilios ${np}`);
        agregarboton();
        //poner botones de busqueda necesarios
    }else{
        alert('Ha ocurrido un error');
    }
}

function UtencilioToHtml(Utencilio){
    return`
    <tr>
    <td>${Utencilio.nombre}</td>

    <td width="50px">
        <div class="btn-group" role="group" aria-label="Basic example">
            <a onclick="verdetalle('${Utencilio._id}')" class="btn-sm  btn-success text-center" href="" data-toggle="modal" data-dismiss="modal" data-target="#ver" ><i class="far fa-eye"></i> ver</a>
            <a onclick="editarcate('${Utencilio._id}')" class="btn-sm btn-primary text-center ${editarbotton(Utencilio.correo)}" href="" data-toggle="modal" data-dismiss="modal" data-target="#detalleEditar" ><i class="far fa-fw fa-edit"></i> Editar</a>
            <a onclick="confirmacionborrar('${Utencilio._id}')" class="confirmation btn-sm btn-danger text-center ${borrabotton(Utencilio)}" href="" data-toggle="modal" data-dismiss="modal" data-target="#borrarmodal"  ><i class="far fa-fw fa-trash-alt"></i> Eliminar</a>
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

function utenciliosListToHTML(utenciliosl){
    //limpipa la pantalla
    listautencilios.innerText="";
    //pone los nuevos datos en pantalla
    //document.querySelector('#listautencilios').insertAdjacentHTML('beforeend',UtencilioToHtml(utenciliosl[0]));
    for(let i=0;i<utenciliosl.length;i++){
        document.querySelector('#listautencilios').insertAdjacentHTML('beforeend',UtencilioToHtml(utenciliosl[i]));
    }
}

async function actual(id){
    let resp= await fetch(`https://ramral.herokuapp.com/api/Utencilio/${id}`,{
        method: 'GET',
        headers:{
            'x-auth': sessionStorage.token
        },
    });
    if(resp.status==200){
        //log('cargo datos')
        let s= await resp.json();
        Utencilioactual=s[1];
    }else{
        alert('Ha ocurrido un error');
    }
}

async function verdetalle(id){
    await actual(id);
    console.log(Utencilioactual[0].nombre);
    document.querySelector('#Nombrever').innerText=Utencilioactual[0].nombre;
    document.querySelector('#vernom').innerText=Utencilioactual[0].nombre;
  
}

async function editarcate(id){
    await actual(id);
    edi.querySelector('#editnombre').value=Utencilioactual[0].nombre;
}

async function confirmacionborrar(id){
    await actual(id);
    document.querySelector('#eliminaring').innerText=`Eliminar: ${Utencilioactual[0].nombre}`
}

eliminar.addEventListener("click", async function(e){
    e.preventDefault();
    id=Utencilioactual[0]._id
    let resp= await fetch(`https://ramral.herokuapp.com/api/Utencilio/${id}`,{
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
    }
    let imp=JSON.stringify(f);
    //console.log(imp);
    let resp= await fetch(`https://ramral.herokuapp.com/api/Utencilio/${Utencilioactual[0]._id}`,{
        method: 'PUT',
        headers:{
            'x-auth': sessionStorage.token,
            'Content-Type': 'application/json'},
        body: imp
    });
    //console.log(resp.status);
    if(resp.status==200){
        paginado(0);
        alert('El Utencilio se ha Actualizado')
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
        guardarUtencilio.removeAttribute('disabled');
    }else{
        if(!guardarUtencilio.hasAttribute('disabled')){
            guardarUtencilio.setAttribute('disabled','true');
        }
    }
})

guardarUtencilio.addEventListener("click", async function(e){
    e.preventDefault();
    let f={
        "nombre": document.querySelector('#Nuevonombre').value,
    }
    let imp=JSON.stringify(f);
    console.log(imp);
    let resp= await fetch(`https://ramral.herokuapp.com/api/Utencilio`,{
        method: 'POST',
        headers:{
            'x-auth': sessionStorage.token,
            'Content-Type': 'application/json'},
        body: imp
    });
    console.log(resp.status);
    if(resp.status==201){
        alert('Se ha creado nueva Utencilio')
        log('Utencilio');
        paginado(numeropag);
        det.reset();
        guardarUtencilio.setAttribute('disabled','true');
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
