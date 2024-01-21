// src/components/ProjectForm.js
import React, { useState } from 'react';
import { storage } from '../firebase';
import { addProject } from '../Firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
`;

const TextArea = styled.textarea`
  margin-bottom: 10px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
`;

const ProjectForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState(null);
  const storage = getStorage();

  const uploadFile = async (file) => {
    const storageRef = ref(storage, file.name); // Use ref from the 'firebase/storage' module
    await uploadBytesResumable(storageRef, file);
    const fileUrl = await getDownloadURL(storageRef);
    return fileUrl;
  };

  const handleAddProject = async () => {
    const projectData = {
      title,
      description,
      tags: tags.split(',').map((tag) => tag.trim()),
    };

    if (file) {
      try {
        const fileUrl = await uploadFile(file);
        projectData.fileUrl = fileUrl;
      } catch (error) {
        console.error('Error uploading file:', error);
        // Display an error message to the user
      }
    }

    addProject(projectData);
  };

  return (
    <Form>
      <h2>Add Project</h2>
      <Input
        type="text"
        placeholder="Project Title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextArea
        placeholder="Project Description"
        onChange={(e) => setDescription(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Tags (comma-separated)"
        onChange={(e) => setTags(e.target.value)}
      />
      <Input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <Button onClick={handleAddProject}>Add Project</Button>
    </Form>
  );
};

export default ProjectForm;
