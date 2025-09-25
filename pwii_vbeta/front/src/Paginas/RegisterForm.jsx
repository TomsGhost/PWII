import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styleRegister.css'; 
const RegisterForm = () => {
    const squares = [0, 1, 2, 3, 4];
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault(); 

        try {
            //backend
            const response = await fetch('http://localhost:3001/api/register', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, username, password }), 
            });

            const data = await response.json();

            if (response.ok) {
                alert('¡Registro exitoso!');
                navigate('/'); 
            } else {
                alert(`Error: ${data.message}`); 
            }
        } catch (error) {
            console.error('Error de red:', error);
            alert('No se pudo conectar al servidor.');
        }
    };

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
                        <h2>Register</h2>
                        <form onSubmit={handleSubmit}> 
                            <div className="inputBox">
                                <input 
                                    type="text" 
                                    name="fullname" 
                                    placeholder="Nombre" 
                                    required 
                                    value={fullname}
                                    onChange={(e) => setFullname(e.target.value)}
                                />
                            </div>
                            <div className="inputBox">
                                <input 
                                    type="email" 
                                    name="email" 
                                    placeholder="Email" 
                                    required 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="inputBox">
                                <input 
                                    type="text" 
                                    name="username" 
                                    placeholder="Username" 
                                    required 
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="inputBox">
                                <input 
                                    type="password" 
                                    name="password" 
                                    placeholder="Password" 
                                    required 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="inputBox">
                                <input 
                                    type="password" 
                                    name="confirmPassword" 
                                    placeholder="Confirm Password" 
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                            <div className="inputBox">
                                <input type="submit" value="Registrarse" />
                            </div>
                            <p className="forget">
                                Already have an account? <Link to="/"> Login</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RegisterForm;