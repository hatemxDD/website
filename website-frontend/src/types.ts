export interface Member {
  id: string;
  name: string;
  dateOfBirth: Date;
  sex: string;
  grade: string;
  degree: string;
  specialty: string;
  email: string;
  photo: string;
  password: string;
  username: string;
  type: string;
  photoUrl?: string;
  teamId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  username: string;
  type: 'lab_leader' | 'team_leader' | 'member';
  dateOfBirth?: string;
  sex?: 'male' | 'female';
  grade?: string;
  degree?: string;
  specialty?: string;
  photo?: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  acronymes: string;
  leader: Member;
  members: Member[];
  photoUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: string;
  photo?: string;
  result?: string;
  team?: Team;
  members: Member[];
}

export interface Article {
  id: string;
  name: string;
  writer: Member;
  lien: string;
}

export interface News {
  title: string;
  description: string;
  photo: string;
  id: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
}

export interface TeamData {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  leader: TeamMember;
}

export type UserRole = 'lab_leader' | 'team_leader' | 'member';

export interface ExtendedUser {
  id: string;
  name: string;
  email: string;
  type: UserRole;
  role: UserRole;
  department: string;
  position: string;
  avatar: string;
  bio?: string;
  phone?: string;
  joinDate?: string;
  education?: string;
  researchInterests?: string[];
  publicationsList?: string[];
  projectsList?: string[];
  collaboratorsList?: string[];
}

export interface DashboardProps {
  userData: ExtendedUser;
} 