import React from "react";
import { useParams } from "react-router-dom";
import Profile from "./Profile";
import { useAuth } from "../../contexts/AuthContext";

const ProfileWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  // If no ID is provided, show the current user's profile
  const userId = id ? parseInt(id) : undefined;

  return (
    <div className="container mx-auto px-4 py-8">
      <Profile userId={userId} />
    </div>
  );
};

export default ProfileWrapper;
