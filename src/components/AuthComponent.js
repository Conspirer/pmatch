// src/components/AuthComponent.js
import React, { useState } from 'react';
import { signUp, signIn, signOut } from '../Auth';
import './AuthComponent.css';
import { useNavigate } from "react-router-dom";

const AuthComponent = () => {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const navigate = useNavigate();

 const handleSignUp = async () => {
    await signUp(email, password);
    navigate("/");
 };

 const handleSignIn = async () => {
    await signIn(email, password);
    navigate("/");
 };

 const handleSignOut = () => {
    signOut();
 };

 return (
    <div className="auth-container">
      <h2>Authentication</h2>
      <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignUp}>Sign Up</button>
      <button onClick={handleSignIn}>Sign In</button>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
 );
};

export default AuthComponent;