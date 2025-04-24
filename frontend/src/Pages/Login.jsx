import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';
import '../styles/Login.css';

const Login = () => {
  const { login } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/user/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (data.success) {
        login(data.username); 
        navigate('/');
      } else {
        setError(data.message || 'Login failed.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <main className="auth-container">
      <div className="error">{error}</div>

      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => {
            setUsername(e.target.value);
            setError('');
          }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => {
            setPassword(e.target.value);
            setError('');
          }}
          required
        />
        <button type="submit" className="btn">Login</button>
      </form>
    </main>
  );
};

export default Login;
