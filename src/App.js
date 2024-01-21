import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import AddProject from './components/AddProject';
import ProjectList from './components/ProjectList';
import UserProjects from './components/UserProjects';
import { auth } from './firebase';
import AuthComponent from './components/AuthComponent';
import ProjectForm from './components/ProjectForm';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import Profile from './components/Profile';

function App() {
 const [user, setUser] = useState(null);

 useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
 }, []);

 return (
    <Router>
      <div>
        <Navbar />

        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/login" element={<AuthComponent />} />

          {user && (
            <>
              <Route path="/my-profile" element={<Profile />} />
              <Route path="/add-project" element={<ProjectForm />} /> 
              <Route path="/your-Projects" element={<UserProjects />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
 );
}

export default App;