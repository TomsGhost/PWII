
function Nav(){
    return(
        <header className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <a className="navbar-brand fw-bold" href="/">
        MiApp
      </a>

      <div className="ms-auto d-flex align-items-center gap-3">
        <>
          <span className="text-white">👋 Hola, </span>
          <button className="btn btn-outline-light btn-sm">
            Cerrar sesión
          </button>
        </>
        <>
          <button className="btn btn-outline-light btn-sm">
            Iniciar sesión
          </button>
          <button className="btn btn-primary btn-sm">Registrarse</button>
        </>
      </div>
    </header>
    );
}

function Footer(){
    return(
        <footer className="bg-dark text-white text-center py-3 mt-auto">
          <p>
            {" "}
            Creado por <b>Profe Angeles</b>
          </p>
        </footer>
    );
}

/*
export const Footer;
export const Nav;*/
export {Nav, Footer};