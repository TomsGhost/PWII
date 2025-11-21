DELIMITER //
CREATE PROCEDURE SP_ObtenerPublicacionesPorUsuario (
    IN p_id_usuario INT
)
BEGIN
    SELECT
        P.id,
        P.titulo,
        P.descripcion,
        P.fecha_creacion,
        U.nombre_usuario,
        (SELECT COUNT(*) FROM Me_gusta WHERE id_publicacion = P.id) AS likes,
        (SELECT COUNT(*) FROM Comentario WHERE id_publicacion = P.id) AS comments
    FROM Publicacion P
    JOIN Usuario U ON P.id_usuario = U.id
    WHERE P.id_usuario = p_id_usuario AND P.baja = 0
    ORDER BY P.fecha_creacion DESC;
END //
DELIMITER ;