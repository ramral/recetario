let form = document.getElementById("formregistro");
let registrobot = document.getElementById("registro")

function registro(e) {
  e.preventDefault();
  let email = document.getElementById("email").value;
  let password = document.getElementById("Pass1").value;
  let nombre = document.getElementById("nombre").value;
  let apellido = document.getElementById("apellidos").value;

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    email,
    password,
    nombre,
    apellido,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("https://recetariodasw.herokuapp.com/api/User", requestOptions).then((response) => {
      console.log(response);
      if ((response.status == 200))
        return (window.location.href = "/Public/index.html");
      window.location.href = "/Public/Registro.html";
    })
    .then((result) => console.log(result));

}
registrobot.addEventListener("click", registro);

form.addEventListener("change", function (e) {
  //checar si todos los registros son validos
  if (form.querySelectorAll('* :invalid').length == 0) {
    //log('son validos')
    //checar si las contraseñas son iguales
    if ((form.querySelector('#Pass1').value == form.querySelector('#Pass2').value) & 
    (form.querySelector('#email').value == form.querySelector('#email2').value)) {
      //log('contraseñas iguales')
      registrobot.removeAttribute('disabled');
      //si tiene aviso de contraseñas o correo no coinciden quitarlo 
      if (form.querySelector('#nocoinciden') != null) {
        form.querySelector('#nocoinciden').remove();
      }else if (form.querySelector('#nocoinciden1') != null) {
        form.querySelector('#nocoinciden1').remove();
      }
    } else {
      if(!(form.querySelector('#Pass1').value == form.querySelector('#Pass2').value)){
          //hacer aviso de contraseña no coinciden
        let nocoinciden = document.createElement('small');
        nocoinciden.className = "form-text text-muted";
        nocoinciden.innerText = "Las contraseñas no coinciden";
        nocoinciden.id = "nocoinciden";
        //checar si ya hay un aviso si no lo hay ponerlo
        if (form.querySelector('#nocoinciden') == null) {
          form.querySelector('#Pass2').after(nocoinciden);
        }
        //checar que este deshabilitado el boton y si no deshabilitarlo
        if (!registrobot.hasAttribute('disabled')) {
          registrobot.setAttribute('disabled', 'true');
        }
      }else{
        let nocoinciden1 = document.createElement('small');
        nocoinciden1.className = "form-text text-muted";
        nocoinciden1.innerText = "Los correos no coinciden";
        nocoinciden1.id = "nocoinciden1";
        //checar si ya hay un aviso si no lo hay ponerlo
        if (form.querySelector('#nocoinciden1') == null) {
          form.querySelector('#email2').after(nocoinciden1);
        }
        //checar que este deshabilitado el boton y si no deshabilitarlo
        if (!registrobot.hasAttribute('disabled')) {
          registrobot.setAttribute('disabled', 'true');
        }
      }
      
    }
  } else {
    //checar si en caso de que se cmabie la contraseña
    if (form.querySelector('.disabled') == null) {
      registrobot.setAttribute('disabled', 'true');
    }
  };
});