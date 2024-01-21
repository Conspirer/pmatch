import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { getDoc, setDoc, serverTimestamp, collection, doc } from 'firebase/firestore';
import { firestore as db } from '../firebase'; // Assuming you have initialized db in firebase.js
import styled from 'styled-components';

const ProfileContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial, sans-serif';
  color: #333;
`;

const ProfileHeading = styled.h2`
  color: #008080;
  margin-bottom: 20px;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 10px;
`;

const InputField = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
`;

const TextAreaField = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
`;

const UpdateButton = styled.button`
  padding: 10px 20px;
  background-color: #008080;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #005757;
  }
`;

const UserProfile = () => {
  const [userDetails, setUserDetails] = useState({
    displayName: '',
    bio: '',
    skills: '',
    socialMedia: '',
  });

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const userDoc = await getDoc(doc(collection(db, 'users'), user.uid));
        if (userDoc.exists()) {
          setUserDetails({
            displayName: userDoc.data().displayName,
            bio: userDoc.data().bio,
            skills: userDoc.data().skills,
            socialMedia: userDoc.data().socialMedia,
          });
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      if (user) {
        await setDoc(doc(collection(db, 'users'), user.uid), {
          displayName: userDetails.displayName,
          bio: userDetails.bio,
          skills: userDetails.skills,
          socialMedia: userDetails.socialMedia,
          updatedAt: serverTimestamp(),
        }, { merge: true });

        await updateProfile(user, {
          displayName: userDetails.displayName,
        });

        console.log('User profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating user profile:', error.message);
    }
  };

  const handleChange = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <ProfileContainer>
      <ProfileHeading>Your Profile</ProfileHeading>
      <FormLabel>
        Display Name:
        <InputField
          type="text"
          name="displayName"
          value={userDetails.displayName}
          onChange={handleChange}
        />
      </FormLabel>
      <FormLabel>
        Bio:
        <TextAreaField name="bio" value={userDetails.bio} onChange={handleChange}></TextAreaField>
      </FormLabel>
      <FormLabel>
        Skills:
        <InputField type="text" name="skills" value={userDetails.skills} onChange={handleChange} />
      </FormLabel>
      <FormLabel>
        Social Media:
        <InputField
          type="text"
          name="socialMedia"
          value={userDetails.socialMedia}
          onChange={handleChange}
        />
      </FormLabel>
      <UpdateButton onClick={handleUpdateProfile}>Update Profile</UpdateButton>
    </ProfileContainer>
  );
};

export default UserProfile;
