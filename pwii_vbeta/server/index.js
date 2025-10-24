const express = require("express");
const cors = require("cors");
const mysql2 = require("mysql2");
const multer = require("multer");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, resp) => {
  resp.json("Grettings programs");
});

app.listen(3001, () => {
  console.log("Servidor conectado");
});

const db = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: "mayo",
  database: "PWII",
  port: 3306,
});

const filefilter = (req, file, cb) => {
  const formatos = ["image/png", "image/jpg", "image/jpeg"];

  if (formatos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    return cb(new Error("Archivo no aceptado"));
  }
};

const espacio = multer.memoryStorage();

const Archivo = multer({
  storage: espacio,
  fileFilter: filefilter,
});

app.post("/register", Archivo.single("file"), (req, resp) => {
  const { name, aka, mail, pass } = req.body;
  const imagen = req.file.buffer.toString("base64");

  db.query(
    "CALL SP_RegistrarUsuario(?, ?, ?, ?, ?)",
    [name, aka, pass, mail, imagen],
    (err, result) => {
      if (err) {
        console.error("Error en la consulta a la BD:", err);
        return resp
          .status(500)
          .json({ msg: "Error interno del servidor al intentar registrar." });
      }
      resp.json({
        msg: result,
      });
    }
  );
});

app.post("/login", (req, resp) => {
  const { username, password } = req.body;

  db.query("CALL SP_IniciarSesion(?, ?)", [username, password], (err, result) => {
    if (err) {
      console.error("Error en la consulta a la BD:", err);
      return resp
        .status(500)
        .json({ msg: "Error interno del servidor al intentar ingresar." });
    }
    resp.json({
      msg: result,
    });

  });
});

app.post("/getUserData", (req, resp) => {
  const { id } = req.body;

  db.query("CALL SP_ObtenerDatosDePerfil(?)", [id], (err, result) => {
    if (err) {
      console.error("Error en la consulta a la BD:", err);
      return resp
        .status(500)
        .json({ msg: "Error interno del servidor al intentar ingresar." });
    }
    resp.json({
      msg: result,
    });

  });
});