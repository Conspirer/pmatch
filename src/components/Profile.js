import React, { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile } from '../Firestore';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  text-align: center;
  font-size: 30px;
  padding: 20px;
  font-family: 'Arial, sans-serif';
  color: #FFFFFF;
`;

const ProfileHeading = styled.h2`
  color: #008080;
`;

const ProfileLabel = styled.label`
  display: block;
  margin: 15px 0;
`;

const ProfileInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
`;

const ProfileTextarea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
`;

const SaveButton = styled.button`
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

const EditButton = styled.button`
  padding: 10px 20px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #555;
  }
`;

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({
    displayName: '',
    skills: '',
    socialMedia: '',
    bio: '',
    // Add other profile properties as needed
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userProfile = await getUserProfile();
      setProfile(userProfile);
      setUpdatedProfile(userProfile || {}); // Set initial values for editing
    };

    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async () => {
    await updateUserProfile(updatedProfile);
    setEditing(false);
  };

  const handleChange = (e) => {
    setUpdatedProfile({
      ...updatedProfile,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <ProfileContainer>
      <ProfileHeading>My Profile</ProfileHeading>
      {profile ? (
        <>
          {editing ? (
            <>
              <ProfileLabel>
                Display Name:
                <ProfileInput
                  type="text"
                  name="displayName"
                  value={updatedProfile.displayName}
                  onChange={handleChange}
                />
              </ProfileLabel>
              <ProfileLabel>
                Skills:
                <ProfileInput
                  type="text"
                  name="skills"
                  value={updatedProfile.skills}
                  onChange={handleChange}
                />
              </ProfileLabel>
              <ProfileLabel>
                Social Media:
                <ProfileInput
                  type="text"
                  name="socialMedia"
                  value={updatedProfile.socialMedia}
                  onChange={handleChange}
                />
              </ProfileLabel>
              <ProfileLabel>
                Bio:
                <ProfileTextarea
                  name="bio"
                  value={updatedProfile.bio}
                  onChange={handleChange}
                ></ProfileTextarea>
              </ProfileLabel>
              <SaveButton onClick={handleUpdateProfile}>Save Changes</SaveButton>
            </>
          ) : (
            <>
              <p>
                <strong>Name:</strong> {profile.displayName}
              </p>
              <p>
                <strong>Skills:</strong> {profile.skills}
              </p>
              <p>
                <strong>Social Media:</strong> {profile.socialMedia}
              </p>
              <p>
                <strong>Bio:</strong> {profile.bio}
              </p>
              <EditButton onClick={() => setEditing(true)}>Edit Profile</EditButton>
            </>
          )}
        </>
      ) : (
        <p>Loading profile...</p>
      )}
    </ProfileContainer>
  );
};

export default Profile;
