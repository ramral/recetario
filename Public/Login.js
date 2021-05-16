sessionStorage.token;
sessionStorage.us;
sessionStorage.email;

//logear usuario
let datos=document.querySelector('#datoslogin');
let entrar=datos.querySelector('#Entrar');


entrar.addEventListener("click", async function(e){
    e.preventDefault();
    let f={
        "email": datos.querySelector('#eemail').value,
        "password": datos.querySelector('#inputPassword').value
    }
    let imp=JSON.stringify(f);
    console.log(imp);
    let resp= await fetch("https://recetariodasw.herokuapp.com/api/User/Login",{
        method: 'POST',
        headers:{'Content-Type': 'application/json'},
       // mode: 'no-cors',
        body: imp
    });
    console.log(resp.status);
    if(resp.status==200){
        let token= await resp.json();
        // guardar el token del usuario
        sessionStorage.token=token[1].token;
        sessionStorage.us=token[0];
        sessionStorage.email=token[2];
        //llevar a la de inicio
        window.location.href="Recetas.html";
    }else{
        alert('Usuario o contraseña incorrectos');
    }
})

