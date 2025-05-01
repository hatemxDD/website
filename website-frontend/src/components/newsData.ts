interface Author {
  name: string;
  role: string;
  avatar?: string;
}

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  content: string;
  date: string;
  image: string;
  author: Author;
  category: string;
}

export const newsData: NewsItem[] = [
  {
    id: 1,
    title: "Breakthrough in Quantum Computing Research",
    summary: "Our team has achieved a significant milestone in quantum computing stability.",
    content: "Our research team has successfully demonstrated a new method for maintaining quantum coherence...",
    date: "2024-03-15",
    image: "/images/news/quantum-computing.jpg",
    author: {
      name: "Dr. Sarah Chen",
      role: "Lead Quantum Researcher"
    },
    category: "Research"
  },
  {
    id: 2,
    title: "New AI Algorithm for Medical Diagnosis",
    summary: "Development of a revolutionary AI system for early disease detection.",
    content: "The newly developed AI algorithm shows promising results in early detection of various diseases...",
    date: "2024-03-10",
    image: "/images/news/ai-medical.jpg",
    author: {
      name: "Prof. Michael Johnson",
      role: "AI Research Director"
    },
    category: "Research"
  },
  {
    id: 3,
    title: "International Research Collaboration Success",
    summary: "Our lab establishes new partnerships with leading international institutions.",
    content: "We are proud to announce new research partnerships with several leading institutions...",
    date: "2024-03-05",
    image: "/images/news/collaboration.jpg",
    author: {
      name: "Dr. Emma Williams",
      role: "Head of International Relations"
    },
    category: "Collaboration"
  },
  {
    id: 4,
    title: "Publication in Nature Journal",
    summary: "Our latest research findings published in prestigious Nature journal.",
    content: "The team's groundbreaking research on molecular structures has been published...",
    date: "2024-03-01",
    image: "/images/news/publication.jpg",
    author: {
      name: "Dr. James Wilson",
      role: "Senior Researcher"
    },
    category: "Publication"
  }
]; 