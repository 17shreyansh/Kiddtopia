import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const PrivateRoute = () => {
  const [isAuth, setIsAuth] = useState(null); // null = loading

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuth(false);
      return;
    }

    axios.get('http://localhost:5000/api/admin', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(() => setIsAuth(true))
    .catch(err => {
      console.error('Auth error:', err);
      setIsAuth(false);
    });
  }, []);

  if (isAuth === null) return <div>Loading...</div>;
  if (!isAuth) return <Navigate to="/login" />;

  return <Outlet />; // renders nested protected routes
};

export default PrivateRoute;
