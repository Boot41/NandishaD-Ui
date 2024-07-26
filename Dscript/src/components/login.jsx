import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css_files/login.css';

const LoginComponent = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there is a logged-in user in localStorage
    const storedUserId = localStorage.getItem('userId');
    const storedPassword = localStorage.getItem('password');

    if (storedUserId && storedPassword) {
      const authenticatedUser = authenticateUser(storedUserId, storedPassword);
      if (authenticatedUser) {
        navigate(authenticatedUser.role === 'doctor' ? '/doctor-dashboard' : '/recep-dashboard');
      }
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate authentication
    const authenticatedUser = authenticateUser(userId, password);

    if (authenticatedUser) {
      if (rememberMe) {
        // Store credentials in localStorage
        localStorage.setItem('userId', userId);
        localStorage.setItem('password', password);
      } else {
        // Clear credentials from localStorage if rememberMe is unchecked
        localStorage.removeItem('userId');
        localStorage.removeItem('password');
      }

      // Navigate based on user role
      navigate(authenticatedUser.role === 'doctor' ? '/doctor-dashboard' : '/recep-dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  const authenticateUser = (id, pass) => {
    const users = {
      receptionist: { id: 'recep', password: 'recepPass', role: 'receptionist' },
      doctor: { id: 'doctor', password: 'doctorPass', role: 'doctor' }
    };

    for (const key in users) {
      if (users[key].id === id && users[key].password === pass) {
        return users[key];
      }
    }
    return null;
  };

  return (
    <div className="wrapperCont">
      <div className="login-container">
        <h2>Dscript</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="userId">User ID</label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter User ID"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              required
            />
          </div>
          <div className="form-group2">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe">Remember Me</label>
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginComponent;
