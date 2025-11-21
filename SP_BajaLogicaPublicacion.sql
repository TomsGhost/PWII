DELIMITER //

CREATE PROCEDURE SP_BajaLogicaPublicacion (
    IN p_id_publicacion INT,      -- ID de la publicación a dar de baja
    IN p_id_usuario_autor INT     -- ID del usuario que solicita la baja (para verificación de seguridad)
)
BEGIN
    DECLARE filas_afectadas INT;

    -- Actualiza el campo 'baja' a 1 (TRUE) para marcar la publicación como eliminada lógicamente.
    UPDATE Publicacion
    SET
        baja = 1
    WHERE
        id = p_id_publicacion
        AND id_usuario = p_id_usuario_autor; -- Seguridad: Solo el autor puede dar de baja su publicación
        
    -- Devuelve el número de filas actualizadas (1 si fue exitoso, 0 si falló la condición WHERE)
    SET filas_afectadas = ROW_COUNT();
    SELECT filas_afectadas AS rows_affected;

END //

DELIMITER ;
