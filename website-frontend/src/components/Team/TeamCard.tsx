import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, User, Briefcase } from "lucide-react";
import "./TeamCard.css";

interface TeamCardProps {
  name: string;
  description: string;
  photo: string;
  isLeader: boolean;
  email?: string;
}

export const TeamCard: React.FC<TeamCardProps> = ({
  name,
  description,
  photo,
  isLeader,
  email,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const profileId = name.toLowerCase().replace(/\s+/g, "-");

  return (
    <div
      className={`card ${isFlipped ? "flipped" : ""} ${isLeader ? "leader-card" : ""} dark:bg-gray-700`}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div className="card-inner">
        <div className="card-front dark:bg-gray-700">
          <div className="card-content">
            <div className="photo-container">
              <img src={photo} alt={name} className="profile-photo" />
              {isLeader && (
                <div className="leader-badge dark:bg-blue-600">Team Leader</div>
              )}
            </div>
            <div className="text-content">
              <h3 className="dark:text-white">{name}</h3>
              <p className="dark:text-gray-300">{description}</p>
            </div>
          </div>
        </div>
        <div className="card-back dark:bg-gray-700">
          <div className="back-content">
            <img src={photo} alt={name} className="back-photo" />
            <h3 className="dark:text-white">{name}</h3>

            <div className="member-info dark:text-gray-300">
              {email && (
                <div className="info-item">
                  <Mail size={16} className="info-icon dark:text-blue-400" />
                  <span>{email}</span>
                </div>
              )}
              <div className="info-item">
                <Briefcase size={16} className="info-icon dark:text-blue-400" />
                <span>{description}</span>
              </div>
            </div>

            <Link
              to={`/profile/${profileId}`}
              className="profile-btn dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
