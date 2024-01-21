import React, { useState, useEffect } from 'react';
import { addProject } from '../Firestore'; // Import only the addProject function
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const AddProject = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState(''); // Add initial value for tags
  const [githubLink, setGithubLink] = useState('');
  const [file, setFile] = useState(null);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [projectId, setProjectId] = useState('');

  useEffect(() => {
    if (projectId) {
      // Clear input fields after adding the project
      setTitle('');
      setDescription('');
      setTags('');
      setGithubLink('');
      setFile(null);
      setUploadPercentage(0);
      setProjectId('');
    }
  }, [projectId]);

  const handleAddProject = async () => {
    // Split the tags string into an array
    const tagsArray = tags.split(',').map(tag => tag.trim());

    // Check if required fields are not empty
    if (title && description && tagsArray.length > 0) {
      // Create a project object with required fields
      const projectData = {
        title,
        description,
        tags: tagsArray,
      };

      // Add githubLink to the projectData only if it is defined
      if (githubLink) {
        projectData.githubLink = githubLink;
      }

      // Add the project to Firestore
      const newProjectId = await addProject(projectData);

      // Upload the file if selected
      if (file) {
        try {
          const fileUrl = await uploadFile(file, newProjectId);
          // Optionally update the project with the fileUrl
          // Note: updateProjectWithFileUrl should be defined in Firestore.js
          // await updateProjectWithFileUrl(newProjectId, fileUrl);
          console.log('File uploaded:', fileUrl);
        } catch (error) {
          console.error('Error uploading file:', error);
          alert('Error uploading file. Please try again.');
        }
      }

      setProjectId(newProjectId);
    } else {
      // Display an error message if any required field is empty
      alert('Please fill in all required fields.');
    }
  };

  const uploadFile = async (file, newProjectId) => {
    const storageRef = getStorage();
    const projectRef = ref(storageRef, `projects/${newProjectId}`);
    const uploadTask = uploadBytesResumable(projectRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadPercentage(progress);
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error('Error uploading file:', error);
          alert('Error uploading file. Please try again.');
          reject(error);
        },
        () => {
          // Handle successful uploads on complete
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            resolve(downloadURL);
          });
        }
      );
    });
  };

  // Validate file type
  const isValidFileType = (file) => {
    const acceptedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    return acceptedTypes.includes(file.type);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (isValidFileType(file)) {
      setFile(file);
    } else {
      alert('Invalid file type. Please select a JPEG, PNG, or PDF file.');
      setFile(null);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'Arial, sans-serif', color: '#333' }}>
      <h2 style={{ color: '#008080' }}>Add Project</h2>
      <div>
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <label htmlFor="tags">Tags (comma-separated):</label>
        <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} />
      </div>
      <div>
        <label htmlFor="githubLink">GitHub Link:</label>
        <input type="text" id="githubLink" value={githubLink} onChange={(e) => setGithubLink(e.target.value)} />
      </div>
      <div>
        <label htmlFor="file">File:</label>
        <input type="file" id="file" onChange={handleFileChange} />
      </div>
      <button onClick={handleAddProject}>Add Project</button>
    </div>
  );
};

export default AddProject;