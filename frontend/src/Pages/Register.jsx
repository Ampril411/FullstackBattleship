import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setMessage('Passwords do not match.');
      setIsSuccess(false);
      return;
    }

    try{
      const res = await fetch('/api/user/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, confirmPassword: confirm }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Registration successful! Redirecting...');
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setMessage(data.message || 'Registration failed.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setMessage('An error occurred. Please try again.');
      setIsSuccess(false);
    }
  };

  return (
    <main className="auth-container">
      {/* 🔔 提示信息区域 */}
      <div className={isSuccess ? 'success-message' : 'error'}>{message}</div>

      <form onSubmit={handleRegister} className="login-form">
        <input
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setMessage('');
          }}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setMessage('');
          }}
          placeholder="Password"
          required
        />
        <input
          type="password"
          value={confirm}
          onChange={(e) => {
            setConfirm(e.target.value);
            setMessage('');
          }}
          placeholder="Confirm Password"
          required
        />
        <button type="submit" className="btn">Register</button>
      </form>
    </main>
  );
};

export default Register;
