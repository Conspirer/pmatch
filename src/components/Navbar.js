// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: '#333',
      padding: '10px',
      color: '#fff',
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <div style={{ flex: 1 }}>
        <Link to="/" style={{ margin: '0 10px', color: '#fff', textDecoration: 'none' }}>Home</Link>
        <Link to="/projects" style={{ margin: '0 10px', color: '#fff', textDecoration: 'none' }}>Projects</Link>

        {/* Add the following links */}
        {user && (
          <>
            <Link to="/my-profile" style={{ margin: '0 10px', color: '#fff', textDecoration: 'none' }}>My Profile</Link>
            <Link to="/add-project" style={{ margin: '0 10px', color: '#fff', textDecoration: 'none' }}>Add Project</Link>
          </>
        )}

        {user && (
          <Link to="/your-projects" style={{ margin: '0 10px', color: '#fff', textDecoration: 'none' }}>Your Projects</Link>
        )}
      </div>

      <div>
        {user ? (
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>Log Out</button>
        ) : (
          <Link to="/login" style={{ margin: '0 10px', color: '#fff', textDecoration: 'none' }}>Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
