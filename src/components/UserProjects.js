import React, { useEffect, useState } from 'react';
import { getUserProjects } from '../Firestore';
import { auth } from '../firebase';
import styled from 'styled-components';

const ProjectsContainer = styled.div`
  text-align: center;
  padding: 20px;
  font-family: 'Arial, sans-serif';
  color: #333;
  font-size: 25px
`;

const ProjectsHeading = styled.h2`
  color: #008080;
  margin-bottom: 20px;
  font-size: 50px
`;

const ProjectsList = styled.ul`
  list-style: none;
  padding: 0;
`;

const ProjectItem = styled.li`
  border-bottom: 1px solid #ccc;
  padding: 20px;
`;

const ProjectTitle = styled.strong`
  display: block;
  font-size: 1.5em;
  margin-bottom: 10px;
`;

const ProjectDescription = styled.p`
  margin-top: 5px;
`;

const TagsText = styled.p`
  color: #888;
`;

const NoProjectsText = styled.p`
  color: #888;
`;

const UserProjects = () => {
  const [userProjects, setUserProjects] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        const projects = await getUserProjects();
        setUserProjects(projects);
      } catch (error) {
        console.error('Error fetching user projects:', error.message);
      }
    };

    fetchUserProjects();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ProjectsContainer>
      {user ? (
        <>
          <ProjectsHeading>Your Projects</ProjectsHeading>
          {userProjects.length > 0 ? (
            <ProjectsList>
              {userProjects.map((project) => (
                <ProjectItem key={project.id}>
                  <ProjectTitle>{project.title}</ProjectTitle>
                  <ProjectDescription>{project.description}</ProjectDescription>
                  <TagsText>Tags: {project.tags.join(', ')}</TagsText>
                </ProjectItem>
              ))}
            </ProjectsList>
          ) : (
            <NoProjectsText>No projects found.</NoProjectsText>
          )}
        </>
      ) : (
        <p>Please log in to view your projects.</p>
      )}
    </ProjectsContainer>
  );
};

export default UserProjects;
