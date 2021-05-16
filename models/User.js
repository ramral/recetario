const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var SchemaUser = new Schema(
  {
    email: { type: String, require: true },
    nombre: { type: String, require: true },
    password: { type: String, require: true },
    rol: {
      type: String,
      enum: ["admin", "chef", "regular"],
      default: "regular",
      require: true,
    },
    create_at: { type: Date, required: true, default: Date.now },
  },
  { versionKey: false }
);

var Usuario = mongoose.model("User", SchemaUser);

module.exports = Usuario;
