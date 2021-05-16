"use strict";

async function listing_ingredients() {
  let ingred = await fetch(`https://recetariodasw.herokuapp.com/api/ingredientes`, {
    method: "GET",
    headers: {
      "x-auth": sessionStorage.token,
    },
  }).then((res) => res.json());
  let select = document.getElementById("select-ingredientes");
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

async function listing_utensilios() {
  let utensilio = await fetch(`https://recetariodasw.herokuapp.com/api/Utensilio`, {
    method: "GET",
    headers: {
      "x-auth": sessionStorage.token,
    },
  }).then((res) => res.json());
  let select = document.getElementById("select-utensilio");
  for (let i = 0; i < utensilio.length; i++) {
    let option = document.createElement("option");
    option.innerHTML =
      "<option value='" +
      utensilio[i].nombre +
      "'>" +
      utensilio[i].nombre +
      " </option> ";
    select.appendChild(option.firstChild);
  }
}

async function buscar(e) {
  e.preventDefault();
  let ingrediente = document.getElementById("select-ingredientes").value;
  let string = "";
  if (ingrediente) string = `ingredientes=${ingrediente}`;

  let utensilio = document.getElementById("select-utensilio").value;
  if (utensilio) {
    if (string.length > 1) {
      string += `&utencilios=${utensilio}`;
    } else string = `utencilios=${utensilio}`;
  }

  // let categoria = document.getElementById("select-categorias").value;
  // if(categoria){
  //   if(string.length>1){
  //     string += `&categoria=${categoria}`
  //   }
  //   else
  //     string=`categoria=${categoria}`

  // }

  // let etiqueta = document.getElementById("select-etiqueta").value;
  // if(etiquea){
  //   if(string.length>1){
  //     string += `&etiquetas=${etiqueta}`
  //   }
  //   else
  //     string=`etiquetas=${etiqueta}`
  // }

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var requestOptions = {
    method: "GET",
    headers: myHeaders,
  };
  fetch(`https://recetariodasw.herokuapp.com/api/Recipe?${string}`, requestOptions)
    .then((response) => response.json())
    .then((result) => console.log(result));
}
document.getElementById("buscar").addEventListener("click", buscar);

window.onload = function () {
  listing_ingredients();
  listing_utensilios();
  console.log(sessionStorage.token);
  if (sessionStorage.token) {
    document.getElementById("Linkreg").classList.add("oculto");

    document.getElementById("login").innerText = "logout";
  } else {
    document.getElementById("Linkreg").classList.remove("oculto");

    document.getElementById("login").innerText = "login";
  }
  document.getElementById("login").addEventListener("click", function () {
    sessionStorage.token = null;
    sessionStorage.us = null;
  });
};
