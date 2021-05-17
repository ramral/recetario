const express = require("express");
const users = require("./users");
const recipes = require("./recipes");
const ingredientes = require("./ingredientes");
const categorias = require("./categorias");
const utencilios = require("./utencilios");
const tags = require("./tags");
var mongoose = require("./conexion");
const { log, test } = require("./middlewares/logs");
var Consignador = require("./models/User");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use(log, test);
app.use(express.static(__dirname + "/Public"));
app.use("/api/User", users);
app.use("/api/Recipe", recipes);
app.use("/api/Ingrediente", ingredientes);
app.use("/api/Categoria", categorias);
app.use("/api/Utencilio", utencilios);
app.use("/api/Tag", tags);


// app.get("/api/Tag" , async (req, res) => {
//   let lista= await Tag.getTag();
//   res.send(lista);
// });



app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
