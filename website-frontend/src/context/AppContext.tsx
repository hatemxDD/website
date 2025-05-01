import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;  // Note: In a real app, passwords should be hashed
  type: 'lab_leader' | 'team_leader' | 'team_member';
  avatar?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold';
  startDate: string;
  endDate?: string;
  teamId: string;
  progress: number;
  budget: number;
  priority: 'low' | 'medium' | 'high';
}

interface Publication {
  id: string;
  title: string;
  authors: string[];
  publishDate: string;
  journal: string;
  impactFactor: number;
  teamId: string;
  projectId?: string;
}

interface News {
  id: string;
  title: string;
  description?: string;
  content?: string;
  photo?: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
}

interface Team {
  id: string;
  name: string;
  description: string;
  leader: User;
  members: User[];
  projects: Project[];
  publications: Publication[];
  status: 'active' | 'inactive';
  createdAt: string;
}

interface AppContextType {
  teams: Team[];
  members: User[];
  projects: Project[];
  publications: Publication[];
  news: News[];
  addTeam: (team: Team) => void;
  updateTeam: (teamId: string, updates: Partial<Team>) => void;
  addMember: (member: User) => void;
  updateMember: (memberId: string, updates: Partial<User>) => void;
  addProject: (project: Project) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  addPublication: (publication: Publication) => void;
  updatePublication: (publicationId: string, updates: Partial<Publication>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Sample data
const sampleMembers: User[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    password: 'LabLeader123!',
    type: 'lab_leader',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: '2',
    name: 'Prof. Michael Chen',
    email: 'michael.chen@university.edu',
    password: 'TeamLead123!',
    type: 'team_leader',
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@university.edu',
    password: 'TeamLead456!',
    type: 'team_leader',
    avatar: 'https://i.pravatar.cc/150?img=3'
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    email: 'james.wilson@university.edu',
    password: 'TeamLead789!',
    type: 'team_leader',
    avatar: 'https://i.pravatar.cc/150?img=4'
  },
  {
    id: '5',
    name: 'Alex Thompson',
    email: 'alex.thompson@university.edu',
    password: 'Member123!',
    type: 'team_member',
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
  {
    id: '6',
    name: 'Lisa Park',
    email: 'lisa.park@university.edu',
    password: 'Member456!',
    type: 'team_member',
    avatar: 'https://i.pravatar.cc/150?img=6'
  },
  {
    id: '7',
    name: 'David Kim',
    email: 'david.kim@university.edu',
    password: 'Member789!',
    type: 'team_member',
    avatar: 'https://i.pravatar.cc/150?img=7'
  },
  {
    id: '8',
    name: 'Maria Garcia',
    email: 'maria.garcia@university.edu',
    password: 'Member012!',
    type: 'team_member',
    avatar: 'https://i.pravatar.cc/150?img=8'
  },
  {
    id: '9',
    name: 'Dr. Robert Smith',
    email: 'robert.smith@university.edu',
    password: 'TeamLead012!',
    type: 'team_leader',
    avatar: 'https://i.pravatar.cc/150?img=9'
  },
  {
    id: '10',
    name: 'Sophia Lee',
    email: 'sophia.lee@university.edu',
    password: 'Member345!',
    type: 'team_member',
    avatar: 'https://i.pravatar.cc/150?img=10'
  },
  {
    id: '11',
    name: 'Thomas Brown',
    email: 'thomas.brown@university.edu',
    password: 'Member678!',
    type: 'team_member',
    avatar: 'https://i.pravatar.cc/150?img=11'
  },
  {
    id: '12',
    name: 'Emma Davis',
    email: 'emma.davis@university.edu',
    password: 'Member901!',
    type: 'team_member',
    avatar: 'https://i.pravatar.cc/150?img=12'
  }
];

const sampleProjects: Project[] = [
  {
    id: 'p1',
    name: 'Quantum Computing Research',
    description: 'Exploring quantum algorithms for optimization problems',
    status: 'in_progress',
    startDate: '2023-01-15',
    endDate: '2024-06-30',
    teamId: 't1',
    progress: 65,
    budget: 500000,
    priority: 'high'
  },
  {
    id: 'p2',
    name: 'AI in Healthcare',
    description: 'Developing AI models for medical diagnosis',
    status: 'in_progress',
    startDate: '2023-03-01',
    endDate: '2024-12-31',
    teamId: 't2',
    progress: 45,
    budget: 750000,
    priority: 'high'
  },
  {
    id: 'p3',
    name: 'Renewable Energy Systems',
    description: 'Optimizing solar panel efficiency',
    status: 'completed',
    startDate: '2022-06-01',
    endDate: '2023-05-30',
    teamId: 't3',
    progress: 100,
    budget: 300000,
    priority: 'medium'
  },
  {
    id: 'p4',
    name: 'Cybersecurity Framework',
    description: 'Developing new security protocols',
    status: 'planning',
    startDate: '2024-01-01',
    teamId: 't1',
    progress: 10,
    budget: 400000,
    priority: 'high'
  },
  {
    id: 'p5',
    name: 'Biomedical Imaging',
    description: 'Advanced imaging techniques for early detection',
    status: 'in_progress',
    startDate: '2023-05-15',
    endDate: '2024-08-31',
    teamId: 't2',
    progress: 30,
    budget: 600000,
    priority: 'medium'
  },
  {
    id: 'p6',
    name: 'Machine Learning in Finance',
    description: 'Developing ML models for financial predictions',
    status: 'in_progress',
    startDate: '2023-07-01',
    endDate: '2024-09-30',
    teamId: 't4',
    progress: 40,
    budget: 450000,
    priority: 'high'
  },
  {
    id: 'p7',
    name: 'Blockchain Security',
    description: 'Enhancing blockchain security protocols',
    status: 'planning',
    startDate: '2024-02-01',
    teamId: 't1',
    progress: 5,
    budget: 350000,
    priority: 'medium'
  },
  {
    id: 'p8',
    name: 'Robotics in Healthcare',
    description: 'Developing assistive robotics for healthcare',
    status: 'in_progress',
    startDate: '2023-09-15',
    endDate: '2024-12-31',
    teamId: 't4',
    progress: 25,
    budget: 800000,
    priority: 'high'
  }
];

const samplePublications: Publication[] = [
  {
    id: 'pub1',
    title: 'Quantum Algorithms for Optimization',
    authors: ['Michael Chen', 'Alex Thompson'],
    publishDate: '2023-06-15',
    journal: 'Nature Quantum Information',
    impactFactor: 8.5,
    teamId: 't1',
    projectId: 'p1'
  },
  {
    id: 'pub2',
    title: 'AI in Medical Diagnosis',
    authors: ['Emily Rodriguez', 'Lisa Park'],
    publishDate: '2023-08-20',
    journal: 'Journal of Medical AI',
    impactFactor: 7.2,
    teamId: 't2',
    projectId: 'p2'
  },
  {
    id: 'pub3',
    title: 'Solar Panel Efficiency Optimization',
    authors: ['James Wilson', 'David Kim'],
    publishDate: '2023-04-10',
    journal: 'Renewable Energy Journal',
    impactFactor: 6.8,
    teamId: 't3',
    projectId: 'p3'
  },
  {
    id: 'pub4',
    title: 'Advanced Cybersecurity Protocols',
    authors: ['Michael Chen', 'Maria Garcia'],
    publishDate: '2023-09-05',
    journal: 'Security and Privacy',
    impactFactor: 7.9,
    teamId: 't1',
    projectId: 'p4'
  },
  {
    id: 'pub5',
    title: 'Machine Learning in Financial Markets',
    authors: ['Robert Smith', 'Sophia Lee'],
    publishDate: '2023-10-15',
    journal: 'Journal of Financial Technology',
    impactFactor: 6.5,
    teamId: 't4',
    projectId: 'p6'
  },
  {
    id: 'pub6',
    title: 'Blockchain Security Analysis',
    authors: ['Michael Chen', 'Thomas Brown'],
    publishDate: '2023-11-20',
    journal: 'Cryptography and Security',
    impactFactor: 7.1,
    teamId: 't1',
    projectId: 'p7'
  },
  {
    id: 'pub7',
    title: 'Healthcare Robotics: Current Trends',
    authors: ['Robert Smith', 'Emma Davis'],
    publishDate: '2023-12-05',
    journal: 'Robotics in Medicine',
    impactFactor: 6.9,
    teamId: 't4',
    projectId: 'p8'
  }
];

const sampleTeams: Team[] = [
  {
    id: 't1',
    name: 'Quantum Computing Lab',
    description: 'Researching quantum algorithms and computing',
    leader: sampleMembers[1],
    members: [sampleMembers[4], sampleMembers[7]],
    projects: sampleProjects.filter(p => p.teamId === 't1'),
    publications: samplePublications.filter(p => p.teamId === 't1'),
    status: 'active',
    createdAt: '2022-01-01'
  },
  {
    id: 't2',
    name: 'AI Research Group',
    description: 'Developing AI solutions for healthcare',
    leader: sampleMembers[2],
    members: [sampleMembers[5]],
    projects: sampleProjects.filter(p => p.teamId === 't2'),
    publications: samplePublications.filter(p => p.teamId === 't2'),
    status: 'active',
    createdAt: '2022-03-15'
  },
  {
    id: 't3',
    name: 'Energy Systems Lab',
    description: 'Researching renewable energy solutions',
    leader: sampleMembers[3],
    members: [sampleMembers[6]],
    projects: sampleProjects.filter(p => p.teamId === 't3'),
    publications: samplePublications.filter(p => p.teamId === 't3'),
    status: 'active',
    createdAt: '2022-06-01'
  },
  {
    id: 't4',
    name: 'Advanced Technology Lab',
    description: 'Researching cutting-edge technologies in finance and healthcare',
    leader: sampleMembers[8],
    members: [sampleMembers[9], sampleMembers[10], sampleMembers[11]],
    projects: sampleProjects.filter(p => p.teamId === 't4'),
    publications: samplePublications.filter(p => p.teamId === 't4'),
    status: 'active',
    createdAt: '2022-09-01'
  }
];

const sampleNews: News[] = [
  {
    id: "1",
    title: "New Breakthrough in AI Research",
    description: "Our team has achieved significant progress in machine learning algorithms, pushing the boundaries of what's possible in artificial intelligence.",
    content: `Our research team has made a groundbreaking discovery in the field of artificial intelligence, specifically in the area of machine learning algorithms. This breakthrough represents a significant step forward in our understanding of neural networks and their applications.

Key Findings:
• Improved accuracy in complex pattern recognition
• Reduced computational requirements
• Enhanced learning capabilities
• Better generalization across different domains

The research, led by Dr. Sarah Johnson and her team, focused on developing novel approaches to deep learning that address several longstanding challenges in the field. The team's innovative methodology combines traditional machine learning techniques with cutting-edge neural network architectures.

Impact and Applications:
This breakthrough has far-reaching implications for various industries:
• Healthcare: More accurate disease diagnosis
• Finance: Better risk assessment
• Transportation: Enhanced autonomous systems
• Manufacturing: Improved quality control

The team's findings have been published in several prestigious journals and have already attracted attention from leading technology companies and research institutions worldwide.`,
    photo: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80",
    date: "March 15, 2024",
    author: "Dr. Sarah Johnson",
    category: "Research",
    tags: ["AI", "Machine Learning", "Research", "Innovation"]
  },
  {
    id: "2",
    title: "International Collaboration Success",
    description: "Our lab has established a groundbreaking partnership with leading international research institutions.",
    content: "Detailed content about the international collaboration...",
    photo: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80",
    date: "March 10, 2024",
    author: "Prof. Michael Chen",
    category: "Collaboration",
    tags: ["International", "Partnership", "Research"]
  },
  {
    id: "3",
    title: "New Research Facility Opening",
    description: "State-of-the-art research facility opening next month to accelerate our scientific discoveries.",
    content: "Detailed content about the new research facility...",
    photo: "https://images.unsplash.com/photo-1581093458791-4b041a98425f?auto=format&fit=crop&q=80",
    date: "March 5, 2024",
    author: "Dr. Emily Rodriguez",
    category: "Facility",
    tags: ["Infrastructure", "Innovation", "Growth"]
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>(sampleTeams);
  const [members, setMembers] = useState<User[]>(sampleMembers);
  const [projects, setProjects] = useState<Project[]>(sampleProjects);
  const [publications, setPublications] = useState<Publication[]>(samplePublications);
  const [news, setNews] = useState<News[]>(sampleNews);

  const addTeam = (team: Team) => {
    setTeams(prev => [...prev, team]);
  };

  const updateTeam = (teamId: string, updates: Partial<Team>) => {
    setTeams(prev => prev.map(team => 
      team.id === teamId ? { ...team, ...updates } : team
    ));
  };

  const addMember = (member: User) => {
    setMembers(prev => [...prev, member]);
  };

  const updateMember = (memberId: string, updates: Partial<User>) => {
    setMembers(prev => prev.map(member => 
      member.id === memberId ? { ...member, ...updates } : member
    ));
  };

  const addProject = (project: Project) => {
    setProjects(prev => [...prev, project]);
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId ? { ...project, ...updates } : project
    ));
  };

  const addPublication = (publication: Publication) => {
    setPublications(prev => [...prev, publication]);
  };

  const updatePublication = (publicationId: string, updates: Partial<Publication>) => {
    setPublications(prev => prev.map(publication => 
      publication.id === publicationId ? { ...publication, ...updates } : publication
    ));
  };

  return (
    <AppContext.Provider value={{
      teams,
      members,
      projects,
      publications,
      news,
      addTeam,
      updateTeam,
      addMember,
      updateMember,
      addProject,
      updateProject,
      addPublication,
      updatePublication
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};