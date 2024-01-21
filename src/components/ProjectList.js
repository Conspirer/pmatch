// src/components/ProjectList.js
import React, { useEffect, useState } from 'react';
import { getAllProjects, getAllTags } from '../Firestore';
import { auth } from '../firebase';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const allProjects = await getAllProjects();
      setProjects(allProjects);

      // Fetch all tags from projects
      const tagsFromProjects = allProjects.flatMap((project) => project.tags);
      // Remove duplicates and set allTags state
      setAllTags([...new Set(tagsFromProjects)]);
    };

    fetchData();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleTagClick = (tag) => {
    // Toggle the selected tag
    setSelectedTags((prevTags) => {
      if (prevTags.includes(tag)) {
        return prevTags.filter((prevTag) => prevTag !== tag);
      } else {
        return [...prevTags, tag];
      }
    });
  };

  const filteredProjects = projects.filter((project) => {
    const tagMatches = selectedTags.length === 0 || project.tags.some((tag) => selectedTags.includes(tag));
    const searchMatches = searchTerm === '' || project.title.toLowerCase().includes(searchTerm.toLowerCase());
    return tagMatches && searchMatches;
  });

  return (
    <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'Arial, sans-serif', color: '#FFFFFF', marginTop: '60px' }}>
      {user ? (
        <>
          <h2 style={{ color: '#008080' }}>Projects</h2>
          <input
            type="text"
            placeholder="Search Tags"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: '10px', padding: '5px', fontFamily: 'Arial, sans-serif' }}
          />
          <div style={{ marginBottom: '10px' }}>
            <strong>Random Tags:</strong>
            {allTags.map((tag) => (
              <span
                key={tag}
                style={{
                  margin: '0 5px',
                  cursor: 'pointer',
                  color: selectedTags.includes(tag) ? '#FFA550' : '#FFA550',
                  backgroundColor: selectedTags.includes(tag) ? '#000000' : 'transparent',
                  padding: '3px 6px',
                  borderRadius: '3px',
                }}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </span>
            ))}
          </div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {filteredProjects.map((project) => (
              <li key={project.id} style={{ borderBottom: '1px solid #ccc', padding: '10px' }}>
                <p><strong>Project Name: </strong>{project.title}</p>
                <p><strong>Description: </strong>{project.description}</p>
                <p style={{ color: '#888' }}><strong>Tags: </strong>{project.tags.join(', ')}</p>
                {project.githubLink && (
                  <p style={{ color: '#4caf50' }}>
                    <strong>Github Link: </strong>
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                      {project.githubLink}
                    </a>
                  </p>
                )}
                {project.fileUrl && (
                  <p style={{ color: '#4caf50' }}>
                    <strong>File URL: </strong>
                    <a href={project.fileUrl} target="_blank" rel="noopener noreferrer">
                      {project.fileUrl}
                    </a>
                  </p>
                )}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p style={{ color: '#888' }}>Please log in to view projects.</p>
      )}
    </div>
  );
};

export default ProjectList;