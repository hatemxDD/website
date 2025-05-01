import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './TeamCard.css';

interface TeamCardProps {
  name: string;
  description: string;
  photo: string;
  isLeader: boolean;
}

export const TeamCard: React.FC<TeamCardProps> = ({ name, description, photo, isLeader }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const profileId = name.toLowerCase().replace(/\s+/g, '-');

  return (
    <div 
      className={`card ${isFlipped ? 'flipped' : ''} ${isLeader ? 'leader-card' : ''}`}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div className="card-inner">
        <div className="card-front">
          <div className="card-content">
            <div className="photo-container">
              <img src={photo} alt={name} className="profile-photo" />
              {isLeader && <div className="leader-badge">Team Leader</div>}
            </div>
            <div className="text-content">
              <h3>{name}</h3>
              <p>{description}</p>
            </div>
          </div>
        </div>
        <div className="card-back">
          <div className="back-content">
            <img src={photo} alt={name} className="back-photo" />
            <h3>{name}</h3>
            <Link to="/profile" className="profile-btn">
              Consulter le profil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};