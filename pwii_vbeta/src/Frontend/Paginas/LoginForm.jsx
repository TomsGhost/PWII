import React from 'react';
import { Link } from 'react-router-dom'; 
import './styleLogin.css'; 
const LoginForm = () => {
    const squares = [0, 1, 2, 3, 4];

    return (
        <section>
            <div className="color"></div>
            <div className="color"></div>
            <div className="color"></div>
            <div className="box">
                {squares.map((i) => (
                    <div key={i} className="square" style={{ '--i': i }}></div>
                ))}

                <div className="container">
                    <div className="form">
                        <h2>Login Form</h2>
                        <form>
                            <div className="inputBox">
                                <input type="text" placeholder="Username" />
                            </div>
                            <div className="inputBox">
                                <input type="password" placeholder="Password" />
                            </div>
                            <div className="inputBox">
                                <input type="submit" value="Login" />
                            </div>
                            <p className="forget">
                                No tienes cuenta? 
                                <Link to="/register"> Registrate</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoginForm;