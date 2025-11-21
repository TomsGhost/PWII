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
  password: "$0lstici0XD",
  database: "PWII",
  port: 3306,
});

/* MAYO
const db = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: "mayo",
  database: "PWII",
  port: 3306,
});
*/

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

  db.query(
    "CALL SP_IniciarSesion(?, ?)",
    [username, password],
    (err, result) => {
      if (err) {
        console.error("Error en la consulta a la BD:", err);
        return resp
          .status(500)
          .json({ msg: "Error interno del servidor al intentar ingresar." });
      }
      resp.json({
        msg: result,
      });
    }
  );
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

app.post("/createEmbed", (req, resp) => {
  const { id, title, desc, embed } = req.body;

  db.query(
    "CALL SP_CrearPublicacion(?, ?, ?, ?)",
    [id, title, desc, embed],
    (err, result) => {
      if (err) {
        console.error("Error en la consulta a la BD:", err);
        return resp
          .status(500)
          .json({ msg: "Error interno al intentar crear la publicacion." });
      }
      resp.json({
        msg: result,
      });
    }
  );
});

app.get("/getPosts", (req, resp) => {
  db.query("SELECT * FROM V_ObtenerPublicaciones", (err, result) => {
    if (err) {
      console.error("Error en la consulta a la BD:", err);
      return resp
        .status(500)
        .json({
          msg: "Error interno del servidor al obtener las publicaciones.",
        });
    }
    const posts = result.map((post) => ({
      ...post,
      title: post.titulo,
      likes: post.total_me_gusta,
      comments: post.total_comentarios,
    }));
    resp.json(posts);
  });
});

app.get("/getPostById/:id", (req, resp) => {
  const { id } = req.params;
  db.query("CALL ObtenerPublicacionPorId(?)", [id], (err, result) => {
    if (err) {
      console.error("Error en la consulta a la BD:", err);
      return resp
        .status(500)
        .json({ msg: "Error interno del servidor al obtener la publicacion." });
    }
    resp.json(result);
  });
});

app.get("/verificar-seguimiento", (req, resp) => {
  const { seguidorId, seguidoId } = req.query;

  if (!seguidorId || !seguidoId) {
    return resp
      .status(400)
      .json({ msg: "Faltan los parámetros 'seguidorId' o 'seguidoId'." });
  }

  const query = "CALL VerificarSiSigue(?, ?)";
  const params = [seguidorId, seguidoId];

  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Error al verificar la relación de seguimiento:", err);
      return resp
        .status(500)
        .json({
          msg: "Error interno del servidor al verificar el seguimiento.",
        });
    }
    const sigue_actualmente =
      result && result[0] && result[0][0] ? result[0][0].sigue_actualmente : 0;

    resp.json({ sigue_actualmente: sigue_actualmente });
  });
});

app.post("/follow", (req, resp) => {
  const { seguidorId, seguidoId } = req.body;

  if (!seguidorId || !seguidoId) {
    return resp
      .status(400)
      .json({ msg: "Faltan los parámetros 'seguidorId' o 'seguidoId'." });
  }

  const query = "CALL SeguirUsuario(?, ?)";
  const params = [seguidorId, seguidoId];

  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Error al intentar seguir al usuario:", err);
      return resp.status(500).json({
        msg: "Error interno del servidor al intentar seguir al usuario.",
      });
    }
    resp.json({ msg: "Ahora sigues a este usuario." });
  });
});

app.post("/unfollow", (req, resp) => {
  const { seguidorId, seguidoId } = req.body;

  if (!seguidorId || !seguidoId) {
    return resp
      .status(400)
      .json({ msg: "Faltan los parámetros 'seguidorId' o 'seguidoId'." });
  }

  const query = "CALL DejarDeSeguirUsuario(?, ?)";
  const params = [seguidorId, seguidoId];

  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Error al dejar de seguir al usuario:", err);
      return resp.status(500).json({
        msg: "Error interno del servidor al dejar de seguir al usuario.",
      });
    }
    resp.json({ msg: "Has dejado de seguir a este usuario." });
  });
});

app.get("/posts/:id", (req, resp) => {
  const { id } = req.params;

  db.query("CALL SP_ObtenerPublicacionesPorUsuario(?)", [id], (err, result) => {
    if (err) {
      console.error("Error en la consulta a la BD:", err);
      return resp
        .status(500)
        .json({
          msg: "Error interno del servidor al obtener las publicaciones del usuario.",
        });
    }
    resp.json(result[0]);
  });
});

app.put("/updatePost/:id", (req, resp) => {
  const { id } = req.params;
  const { title, desc, embed } = req.body;

  db.query(
    "CALL SP_EditarPublicacion(?, ?, ?, ?)",
    [id, title, desc, embed],
    (err, result) => {
      if (err) {
        console.error("Error en la consulta a la BD:", err);
        return resp.status(500).json({
          msg: "Error interno del servidor al intentar actualizar la publicacion.",
        });
      }
      resp.json({
        msg: "Publicacion actualizada correctamente.",
        data: result,
      });
    }
  );
});

app.put("/deletePost/:id", (req, resp) => {
  const { id } = req.params;
  const { id_usuario_autor } = req.body;

  if (!id_usuario_autor) {
    return resp.status(400).json({ msg: "El id del autor es requerido." });
  }

  db.query(
    "CALL SP_BajaLogicaPublicacion(?, ?)",
    [id, id_usuario_autor],
    (err, result) => {
      if (err) {
        console.error("Error en la consulta a la BD:", err);
        return resp.status(500).json({
          msg: "Error interno del servidor al intentar eliminar la publicacion.",
        });
      }

      const rowsAffected =
        result && result[0] && result[0][0] ? result[0][0].rows_affected : 0;

      if (rowsAffected > 0) {
        resp.json({ msg: "Publicacion eliminada lógicamente." });
      } else {
        resp
          .status(404)
          .json({
            msg: "No se encontró la publicación o el usuario no tiene permisos para eliminarla.",
          });
      }
    }
  );
});

app.put("/updateProfile/:id", Archivo.single("file"), (req, resp) => {
  const { id } = req.params;
  const { name, mail } = req.body;
  const imagen = req.file ? req.file.buffer.toString("base64") : null;

  db.query(
    "CALL SP_EditarPerfil(?, ?, ?, ?)",
    [id, name, mail, imagen],
    (err, result) => {
      if (err) {
        console.error("Error en la consulta a la BD:", err);
        return resp.status(500).json({
          msg: "Error interno del servidor al intentar actualizar el perfil.",
        });
      }
      resp.json({
        msg: "Perfil actualizado correctamente.",
        data: result,
      });
    }
  );
});
