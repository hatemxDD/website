/**
 * GroupDetail Component
 * 
 * This component represents the detailed view of a team, displaying:
 * - Team leader information with enhanced visibility
 * - Team members in a grid layout
 * - Related team articles and publications
 * - Responsive design for various screen sizes
 */

import { Users } from 'lucide-react';
import { TeamCard } from './TeamCard';
import { TeamArticles } from './TeamArticles';
import { ArticleSection } from '../Article/ArticleSection';
import './GroupDetail.css';

const teamLeader = {
  name: "Sarah Johnson",
  description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam ipsam commodi dolorum quaerat repellendus quasi voluptas quam in expedita veniam possimus optio odio.",
  isLeader: true,
  photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
};

const teamMembers = [
  { 
    name: "Mike Chen", 
    description: "UX Designer",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400"
  },
  { 
    name: "Emma Davis", 
    description: "Backend Developer",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400"
  },
  { 
    name: "Alex Kim", 
    description: "Frontend Developer",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400"
  },
  { 
    name: "Lisa Wang", 
    description: "Product Manager",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400"
  },
  { 
    name: "John Smith", 
    description: "DevOps Engineer",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
  },
  { 
    name: "Rachel Torres", 
    description: "Data Scientist",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400"
  }
];

function GroupDetail() {
  return (
    <div className="app">
      <header className="team-header">
        <Users size={48} className="team-icon" />
        <h1>Our Amazing Team</h1>
        <p>Building the future of technology together</p>
      </header>

      <div className="leader-section">
        <div className="leader-content">
          <div className="leader-info">
            <h2 className="leader-title">Team Leader</h2>
            <p className="leader-description">{teamLeader.description}</p>
          </div>
          <div className="leader-card-container">
            <TeamCard
              name={teamLeader.name}
              description="Chief Technology Officer"
              isLeader={teamLeader.isLeader}
              photo={teamLeader.photo}
            />
          </div>
        </div>
      </div>

      <h2 className="members-title">Team Members</h2>
      
      <section className="team-grid">
        {teamMembers.map((member, index) => (
          <TeamCard
            key={index}
            name={member.name}
            description={member.description}
            photo={member.photo}
            isLeader={false}
          />
        ))}
      </section>

      <TeamArticles />
      <ArticleSection />
    </div>
  );
}

export default GroupDetail; 