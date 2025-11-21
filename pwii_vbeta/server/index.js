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
      return resp.status(500).json({
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

app.get("/getCommentsByPostId/:id", (req, resp) => {
  const { id } = req.params;
  db.query(
    "CALL SP_ObtenerComentariosPorPublicacion(?)",
    [id],
    (err, result) => {
      if (err) {
        console.error("Error en la consulta a la BD:", err);
        return resp.status(500).json({
          msg: "Error interno del servidor al obtener los comentarios.",
        });
      }
      resp.json(result[0]);
    }
  );
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
      return resp.status(500).json({
        msg: "Error interno del servidor al verificar el seguimiento.",
      });
    }
    const sigue_actualmente =
      result && result[0] && result[0][0] ? result[0][0].sigue_actualmente : 0;

    resp.json({ sigue_actualmente: sigue_actualmente });
  });
});

app.get("/posts/:id", (req, resp) => {
  const { id } = req.params;

  db.query("CALL SP_ObtenerPublicacionesPorUsuario(?)", [id], (err, result) => {
    if (err) {
      console.error("Error en la consulta a la BD:", err);
      return resp.status(500).json({
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
        resp.status(404).json({
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

app.post("/createComment", (req, resp) => {
  const { id_usuario, id_publicacion, texto_comentario } = req.body;
  console.log("Received data for createComment:", {
    id_usuario,
    id_publicacion,
    texto_comentario,
  });

  db.query(
    "CALL SP_CrearComentario(?, ?, ?)",
    [id_usuario, id_publicacion, texto_comentario],
    (err, result) => {
      if (err) {
        console.error("Error in DB query for createComment:", err);
        console.error("MySQL error code:", err.code);
        console.error("MySQL error message:", err.sqlMessage);
        return resp.status(500).json({
          msg: "Error interno del servidor al intentar crear el comentario.",
          error: err.message,
          mysqlError: err.sqlMessage,
          mysqlErrorCode: err.code,
        });
      }
      console.log("DB query result for createComment:", result);
      const nuevoComentarioId = result[0][0].nuevo_comentario_id;
      resp.json({
        msg: "Comentario creado exitosamente.",
        nuevo_comentario_id: nuevoComentarioId,
      });
    }
  );
});

app.get("/feed/:userId", (req, resp) => {
  const { userId } = req.params;

  if (!userId) {
    return resp
      .status(400)
      .json({ msg: "El ID de usuario es requerido para obtener el feed." });
  }

  const query = "CALL SP_ObtenerFeed(?)";
  const params = [userId];

  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Error al obtener el feed de publicaciones:", err);
      return resp.status(500).json({
        msg: "Error interno del servidor al obtener el feed.",
        error: err.sqlMessage,
      });
    }
    resp.json(result[0]);
  });
});

app.post("/addFavorite", (req, resp) => {
  const { id_usuario, id_publicacion, descripcion } = req.body;

  if (!id_usuario || !id_publicacion || descripcion === undefined) {
    return resp
      .status(400)
      .json({ msg: "Faltan datos requeridos (usuario, publicación o nota)." });
  }

  db.query(
    "CALL SP_AgregarFavoritoConNota(?, ?, ?)",
    [id_usuario, id_publicacion, descripcion],
    (err, result) => {
      if (err) {
        console.error("Error al agregar Favorito con nota:", err);

        if (err.sqlState === "45000") {
          return resp.status(409).json({ msg: err.sqlMessage });
        }

        return resp
          .status(500)
          .json({ msg: "Error interno al procesar el Favorito." });
      }

      const nuevoFavoritoId =
        result && result[0] && result[0][0]
          ? result[0][0].nuevo_favorito_id
          : null;

      resp.status(200).json({
        msg: "Publicación agregada a favoritos con nota exitosamente.",
        id: nuevoFavoritoId,
      });
    }
  );
});

app.post("/removeFavorite", (req, resp) => {
  const { id_usuario, id_publicacion } = req.body;

  if (!id_usuario || !id_publicacion) {
    return resp.status(400).json({ msg: "Faltan los IDs de usuario o publicación." });
  }

  db.query(
    "CALL SP_EliminarFavorito(?, ?)",
    [id_usuario, id_publicacion],
    (err, result) => {
      if (err) {
        console.error("Error al quitar Favorito:", err);
        return resp.status(500).json({ msg: "Error interno al quitar el Favorito." });
      }

      const rowsAffected = result && result[0] && result[0][0] ? result[0][0].rows_affected : 0;

      if (rowsAffected > 0) {
        resp.status(200).json({ msg: "Favorito eliminado exitosamente." });
      } else {
        resp.status(404).json({ msg: "La publicación no se encontró en favoritos." });
      }
    }
  );
});

app.get("/favorites/:userId", (req, resp) => {
  const { userId } = req.params;

  db.query("CALL SP_ObtenerFavoritosPorUsuario(?)", [userId], (err, result) => {
    if (err) {
      console.error("Error al obtener favoritos:", err);
      return resp
        .status(500)
        .json({ msg: "Error interno del servidor al obtener favoritos." });
    }
    resp.json(result[0]);
  });
});

app.post("/follow", (req, resp) => {
  const { seguidorId, seguidoId } = req.body;

  if (!seguidorId || !seguidoId) {
    return resp.status(400).json({ msg: "Faltan los parámetros 'seguidorId' o 'seguidoId'." });
  }

  const query = "CALL SP_SeguirUsuario(?, ?)";
  const params = [seguidorId, seguidoId];

  db.query(query, params, (err, result) => {
    if (err) {
      if (err.sqlState === "45000") {
        return resp.status(409).json({ msg: err.sqlMessage });
      }
      return resp.status(500).json({ msg: "Error interno." });
    }
    resp.json({ msg: "Ahora sigues a este usuario." });
  });
});

app.post("/unfollow", (req, resp) => {
  const { seguidorId, seguidoId } = req.body;

  if (!seguidorId || !seguidoId) {
    return resp.status(400).json({ msg: "Faltan los parámetros." });
  }

  const query = "CALL SP_DejarDeSeguirUsuario(?, ?)";
  const params = [seguidorId, seguidoId];

  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Error al dejar de seguir:", err);
      return resp.status(500).json({ msg: "Error interno." });
    }
    resp.json({ msg: "Has dejado de seguir a este usuario." });
  });
});

app.get("/verificar-seguimiento", (req, resp) => {
  const { seguidorId, seguidoId } = req.query;

  if (!seguidorId || !seguidoId) {
    return resp.status(400).json({ msg: "Faltan parámetros." });
  }

  const query = "CALL SP_VerificarSiSigue(?, ?)";
  const params = [seguidorId, seguidoId];

  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Error al verificar:", err);
      return resp.status(500).json({ msg: "Error interno." });
    }
    const sigue_actualmente = result && result[0] && result[0][0] ? result[0][0].sigue_actualmente : 0;
    resp.json({ sigue_actualmente: sigue_actualmente });
  });
});

app.get("/getFollowing/:id", (req, resp) => {
  const { id } = req.params;

  if (!id) {
    return resp.status(400).json({ msg: "Falta el ID del usuario." });
  }

  db.query("CALL SP_ObtenerSiguiendo(?)", [id], (err, result) => {
    if (err) {
      console.error("Error al obtener lista de seguidos:", err);
      return resp.status(500).json({
        msg: "Error interno al obtener la lista de seguidos.",
      });
    }
    resp.json(result[0]);
  });
});

app.get("/getTopPosts", (req, resp) => {
  db.query("CALL SP_ObtenerTop3Publicaciones()", (err, result) => {
    if (err) {
      console.error("Error al obtener el top de publicaciones:", err);
      return resp.status(500).json({
        msg: "Error interno del servidor al obtener el top.",
      });
    }
    resp.json(result[0]);
  });
});

app.get("/getTopCommented", (req, resp) => {
  db.query("CALL SP_ObtenerTop5MasComentadas()", (err, result) => {
    if (err) {
      console.error("Error al obtener top comentados:", err);
      return resp.status(500).json({ msg: "Error interno." });
    }
    resp.json(result[0]);
  });
});

app.get("/search", (req, resp) => {
  const { q } = req.query;

  if (!q) {
    return resp.json([]);
  }

  db.query("CALL SP_BuscarPublicaciones(?)", [q], (err, result) => {
    if (err) {
      console.error("Error en la búsqueda:", err);
      return resp.status(500).json({ msg: "Error interno al buscar." });
    }
    resp.json(result[0]);
  });
});