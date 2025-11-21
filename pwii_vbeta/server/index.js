const express = require("express");
const cors = require("cors");
const { Pool } = require("pg"); // CAMBIO: Usamos pg en lugar de mysql2
const multer = require("multer");
require("dotenv").config(); // CAMBIO: Para leer las variables de entorno de Render

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, resp) => {
  resp.json("Greetings programs from PostgreSQL");
});

// CAMBIO: Usar el puerto que Render nos asigne o el 3001 por defecto
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor conectado en el puerto ${PORT}`);
});

// CAMBIO: Configuración de conexión para PostgreSQL en Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Render llena esto automáticamente
  ssl: {
    rejectUnauthorized: false, // Necesario para que Render acepte la conexión segura
  },
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

// ---------------- RUTAS ------------------

app.post("/register", Archivo.single("file"), (req, resp) => {
  const { name, aka, mail, pass } = req.body;
  // Manejo seguro si no se sube imagen
  const imagen = req.file ? req.file.buffer.toString("base64") : null;

  // CAMBIO: CALL -> SELECT * FROM funcion($1, $2...)
  pool.query(
    "SELECT * FROM SP_RegistrarUsuario($1, $2, $3, $4, $5)",
    [name, aka, pass, mail, imagen],
    (err, result) => {
      if (err) {
        console.error("Error BD:", err);
        return resp.status(500).json({ msg: "Error al registrar." });
      }
      // CAMBIO: result[0] -> result.rows
      resp.json({ msg: result.rows });
    }
  );
});

app.post("/login", (req, resp) => {
  const { username, password } = req.body;

  pool.query(
    "SELECT * FROM SP_IniciarSesion($1, $2)",
    [username, password],
    (err, result) => {
      if (err) {
        console.error("Error BD:", err);
        return resp.status(500).json({ msg: "Error al ingresar." });
      }
      resp.json({ msg: result.rows });
    }
  );
});

app.post("/getUserData", (req, resp) => {
  const { id } = req.body;

  pool.query("SELECT * FROM SP_ObtenerDatosDePerfil($1)", [id], (err, result) => {
    if (err) {
      console.error("Error BD:", err);
      return resp.status(500).json({ msg: "Error interno." });
    }
    resp.json({ msg: result.rows });
  });
});

app.post("/createEmbed", (req, resp) => {
  const { id, title, desc, embed } = req.body;

  pool.query(
    "SELECT * FROM SP_CrearPublicacion($1, $2, $3, $4)",
    [id, title, desc, embed],
    (err, result) => {
      if (err) {
        console.error("Error BD:", err);
        return resp.status(500).json({ msg: "Error al crear publicación." });
      }
      resp.json({ msg: result.rows });
    }
  );
});

app.get("/getPosts", (req, resp) => {
  // Las VISTAS (Views) se llaman igual en Postgres
  pool.query("SELECT * FROM V_ObtenerPublicaciones", (err, result) => {
    if (err) {
      console.error("Error BD:", err);
      return resp.status(500).json({ msg: "Error al obtener publicaciones." });
    }
    
    // En Postgres los nombres de columnas suelen venir en minúsculas por defecto
    const posts = result.rows.map((post) => ({
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
  pool.query("SELECT * FROM ObtenerPublicacionPorId($1)", [id], (err, result) => {
    if (err) {
      console.error("Error BD:", err);
      return resp.status(500).json({ msg: "Error al obtener publicación." });
    }
    resp.json(result.rows);
  });
});

app.get("/getCommentsByPostId/:id", (req, resp) => {
  const { id } = req.params;
  pool.query(
    "SELECT * FROM SP_ObtenerComentariosPorPublicacion($1)",
    [id],
    (err, result) => {
      if (err) {
        console.error("Error BD:", err);
        return resp.status(500).json({ msg: "Error al obtener comentarios." });
      }
      // Postgres devuelve un array directo en result.rows
      resp.json(result.rows);
    }
  );
});

app.get("/verificar-seguimiento", (req, resp) => {
  const { seguidorId, seguidoId } = req.query;

  if (!seguidorId || !seguidoId) {
    return resp.status(400).json({ msg: "Faltan parámetros." });
  }

  pool.query(
    "SELECT * FROM SP_VerificarSiSigue($1, $2)",
    [seguidorId, seguidoId],
    (err, result) => {
      if (err) {
        console.error("Error BD:", err);
        return resp.status(500).json({ msg: "Error interno." });
      }
      const sigue_actualmente =
        result && result.rows.length > 0 ? result.rows[0].sigue_actualmente : 0;

      resp.json({ sigue_actualmente: sigue_actualmente });
    }
  );
});

app.get("/posts/:id", (req, resp) => {
  const { id } = req.params;

  pool.query("SELECT * FROM SP_ObtenerPublicacionesPorUsuario($1)", [id], (err, result) => {
    if (err) {
      console.error("Error BD:", err);
      return resp.status(500).json({ msg: "Error interno." });
    }
    resp.json(result.rows);
  });
});

app.put("/updatePost/:id", (req, resp) => {
  const { id } = req.params;
  const { title, desc, embed } = req.body;

  pool.query(
    "SELECT * FROM SP_EditarPublicacion($1, $2, $3, $4)",
    [id, title, desc, embed],
    (err, result) => {
      if (err) {
        console.error("Error BD:", err);
        return resp.status(500).json({ msg: "Error al actualizar." });
      }
      resp.json({
        msg: "Publicacion actualizada correctamente.",
        data: result.rows,
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

  pool.query(
    "SELECT * FROM SP_BajaLogicaPublicacion($1, $2)",
    [id, id_usuario_autor],
    (err, result) => {
      if (err) {
        console.error("Error BD:", err);
        return resp.status(500).json({ msg: "Error al eliminar." });
      }

      const rowsAffected = result.rows.length > 0 ? result.rows[0].rows_affected : 0;

      if (rowsAffected > 0) {
        resp.json({ msg: "Publicacion eliminada lógicamente." });
      } else {
        resp.status(404).json({ msg: "No encontrado o sin permisos." });
      }
    }
  );
});

app.put("/updateProfile/:id", Archivo.single("file"), (req, resp) => {
  const { id } = req.params;
  const { name, mail } = req.body;
  const imagen = req.file ? req.file.buffer.toString("base64") : null;

  pool.query(
    "SELECT * FROM SP_EditarPerfil($1, $2, $3, $4)",
    [id, name, mail, imagen],
    (err, result) => {
      if (err) {
        console.error("Error BD:", err);
        return resp.status(500).json({ msg: "Error al actualizar perfil." });
      }
      resp.json({
        msg: "Perfil actualizado correctamente.",
        data: result.rows,
      });
    }
  );
});

app.post("/createComment", (req, resp) => {
  const { id_usuario, id_publicacion, texto_comentario } = req.body;

  pool.query(
    "SELECT * FROM SP_CrearComentario($1, $2, $3)",
    [id_usuario, id_publicacion, texto_comentario],
    (err, result) => {
      if (err) {
        console.error("Error BD:", err);
        return resp.status(500).json({ msg: "Error al crear comentario." });
      }
      // En Postgres, si el SP retorna el ID, estará en la primera fila
      const nuevoComentarioId = result.rows[0] ? result.rows[0].nuevo_comentario_id : null;
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
    return resp.status(400).json({ msg: "El ID de usuario es requerido." });
  }

  pool.query("SELECT * FROM SP_ObtenerFeed($1)", [userId], (err, result) => {
    if (err) {
      console.error("Error BD:", err);
      return resp.status(500).json({ msg: "Error al obtener feed." });
    }
    resp.json(result.rows);
  });
});

app.post("/addFavorite", (req, resp) => {
  const { id_usuario, id_publicacion, descripcion } = req.body;

  if (!id_usuario || !id_publicacion || descripcion === undefined) {
    return resp.status(400).json({ msg: "Faltan datos requeridos." });
  }

  pool.query(
    "SELECT * FROM SP_AgregarFavoritoConNota($1, $2, $3)",
    [id_usuario, id_publicacion, descripcion],
    (err, result) => {
      if (err) {
        console.error("Error BD:", err);
        // Postgres usa códigos diferentes, pero el 45000 de excepciones personalizadas puede variar
        return resp.status(500).json({ msg: "Error al agregar favorito.", error: err.message });
      }

      const nuevoFavoritoId = result.rows[0] ? result.rows[0].nuevo_favorito_id : null;

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
    return resp.status(400).json({ msg: "Faltan IDs." });
  }

  pool.query(
    "SELECT * FROM SP_EliminarFavorito($1, $2)",
    [id_usuario, id_publicacion],
    (err, result) => {
      if (err) {
        console.error("Error BD:", err);
        return resp.status(500).json({ msg: "Error interno." });
      }

      const rowsAffected = result.rows[0] ? result.rows[0].rows_affected : 0;

      if (rowsAffected > 0) {
        resp.status(200).json({ msg: "Favorito eliminado exitosamente." });
      } else {
        resp.status(404).json({ msg: "No se encontró en favoritos." });
      }
    }
  );
});

app.get("/favorites/:userId", (req, resp) => {
  const { userId } = req.params;

  pool.query("SELECT * FROM SP_ObtenerFavoritosPorUsuario($1)", [userId], (err, result) => {
    if (err) {
      console.error("Error BD:", err);
      return resp.status(500).json({ msg: "Error al obtener favoritos." });
    }
    resp.json(result.rows);
  });
});

app.post("/follow", (req, resp) => {
  const { seguidorId, seguidoId } = req.body;

  if (!seguidorId || !seguidoId) {
    return resp.status(400).json({ msg: "Faltan parámetros." });
  }

  pool.query("SELECT * FROM SP_SeguirUsuario($1, $2)", [seguidorId, seguidoId], (err, result) => {
    if (err) {
      return resp.status(500).json({ msg: "Error interno o ya sigues al usuario.", error: err.message });
    }
    resp.json({ msg: "Ahora sigues a este usuario." });
  });
});

app.post("/unfollow", (req, resp) => {
  const { seguidorId, seguidoId } = req.body;

  if (!seguidorId || !seguidoId) {
    return resp.status(400).json({ msg: "Faltan parámetros." });
  }

  pool.query(
    "SELECT * FROM SP_DejarDeSeguirUsuario($1, $2)",
    [seguidorId, seguidoId],
    (err, result) => {
      if (err) {
        console.error("Error BD:", err);
        return resp.status(500).json({ msg: "Error interno." });
      }
      resp.json({ msg: "Has dejado de seguir a este usuario." });
    }
  );
});

app.get("/getFollowing/:id", (req, resp) => {
  const { id } = req.params;

  if (!id) {
    return resp.status(400).json({ msg: "Falta el ID." });
  }

  pool.query("SELECT * FROM SP_ObtenerSiguiendo($1)", [id], (err, result) => {
    if (err) {
      console.error("Error BD:", err);
      return resp.status(500).json({ msg: "Error interno." });
    }
    resp.json(result.rows);
  });
});

app.get("/getTopPosts", (req, resp) => {
  pool.query("SELECT * FROM SP_ObtenerTop3Publicaciones()", (err, result) => {
    if (err) {
      console.error("Error BD:", err);
      return resp.status(500).json({ msg: "Error interno." });
    }
    resp.json(result.rows);
  });
});

app.get("/getTopCommented", (req, resp) => {
  pool.query("SELECT * FROM SP_ObtenerTop5MasComentadas()", (err, result) => {
    if (err) {
      console.error("Error BD:", err);
      return resp.status(500).json({ msg: "Error interno." });
    }
    resp.json(result.rows);
  });
});

app.get("/search", (req, resp) => {
  const { q } = req.query;
  if (!q) {
    return resp.json([]);
  }

  pool.query("SELECT * FROM SP_BuscarPublicaciones($1)", [q], (err, result) => {
    if (err) {
      console.error("Error BD:", err);
      return resp.status(500).json({ msg: "Error al buscar." });
    }
    resp.json(result.rows);
  });
});