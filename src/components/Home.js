import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const HomeContainer = styled.div`
  text-align: center;
  padding: 50px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
`;

const WelcomeText = styled.h1`
  color: #008080;
  font-size: 2.5em;
  margin-bottom: 20px;
`;

const DescriptionText = styled.p`
  max-width: 800px;
  margin: 0 auto;
  font-size: 1.2em;
  line-height: 1.6;
  margin-bottom: 40px;
  color: #f8ffff;
  overflow: hidden;
`;

const StyledButton = styled.button`
  padding: 15px 30px;
  font-size: 1.2em;
  background-color: #008080;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #005757;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AnimatedLetter = styled.span`
  display: inline-block;
  opacity: 0;
  transform: translateY(10px);
  animation: ${fadeIn} 1s forwards;
  animation-delay: ${(props) => props.delay}s;
`;

const Home = () => {
  const [showTitle, setShowTitle] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Delay the appearance of title and description for a better visual effect
    const titleTimeout = setTimeout(() => setShowTitle(true), 500);
    const descriptionTimeout = setTimeout(() => setShowDescription(true), 1000);

    return () => {
      clearTimeout(titleTimeout);
      clearTimeout(descriptionTimeout);
    };
  }, []);

  const renderAnimatedText = (text, delay = 0.1) => (
    text.split('').map((character, index) => (
      character === ' ' ? (
        <span key={index} style={{ margin: '0.3em' }}></span>
      ) : (
        <AnimatedLetter key={index} delay={index * delay}>
          {character}
        </AnimatedLetter>
      )
    ))
  );

  const handleGetStartedClick = () => {
    // Check if the user is authenticated
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, navigate to the Projects page
        navigate('/projects');
      } else {
        // No user is signed in, navigate to the login page
        navigate('/login');
      }
    });
  };

  return (
    <HomeContainer>
      <WelcomeText style={{ opacity: showTitle ? 1 : 0, transition: 'opacity 1s ease' }}>
        {renderAnimatedText('Welcome to Project Matchmaker')}
      </WelcomeText>
      <DescriptionText style={{ opacity: showDescription ? 1 : 0, transition: 'opacity 1s ease' }}>
        {renderAnimatedText('Discover and collaborate on exciting tech projects with like-minded individuals! Join our community to turn your ideas into reality.', 0.03)}
      </DescriptionText>
      <StyledButton onClick={handleGetStartedClick}>Get Started</StyledButton>
    </HomeContainer>
  );
};

export default Home;
