/**
 * News Data Types and Mock Data
 * 
 * This file contains:
 * - TypeScript interface for news items
 * - Mock data for testing and development
 * - Structured news content with author information
 */

export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  content: string;
  image: string;
  date: string;
  author: {
    name: string;
    role: string;
    institution: string;
  };
}

export const newsData: NewsItem[] = [
  {
    id: 1,
    title: "Breakthrough in Quantum Computing Research",
    summary: "Scientists achieve major milestone in quantum computing stability",
    content: `Our research team has made a groundbreaking discovery in quantum computing stability. 
    The new method allows qubits to maintain coherence for significantly longer periods, marking a major step forward in quantum computing research.
    
    This breakthrough could potentially revolutionize the field of quantum computing, making it more practical for real-world applications. The team's findings, published in Nature Quantum Science, demonstrate a novel approach to reducing decoherence in quantum systems.
    
    The implications of this discovery extend beyond quantum computing, potentially impacting fields such as cryptography, drug discovery, and climate modeling.`,
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
    date: "2024-03-15",
    author: {
      name: "Dr. Sarah Chen",
      role: "Lead Quantum Researcher",
      institution: "Quantum Computing Division"
    }
  },
  {
    id: 2,
    title: "New Particle Accelerator Facility Opens",
    summary: "State-of-the-art facility promises to advance particle physics research",
    content: `The inauguration of our new particle accelerator facility marks a significant milestone in our research capabilities. 
    This state-of-the-art facility features the latest in particle acceleration technology and detection systems.
    
    The accelerator will enable researchers to conduct experiments at unprecedented energy levels, potentially unveiling new particles and forces that could reshape our understanding of the universe.
    
    International collaboration opportunities are already being established, with research teams from around the world showing interest in conducting experiments at the facility.`,
    image: "https://images.unsplash.com/photo-1581093458791-4b041a98425f",
    date: "2024-03-10",
    author: {
      name: "Prof. Michael Thompson",
      role: "Director of Particle Physics",
      institution: "Particle Physics Laboratory"
    }
  },
  {
    id: 3,
    title: "Artificial Intelligence Enhances Drug Discovery",
    summary: "Machine learning algorithm successfully predicts new drug compounds",
    content: `Our laboratory's AI research team has developed a revolutionary machine learning algorithm that significantly accelerates the drug discovery process. 
    The algorithm has successfully identified several promising compounds for treating resistant bacterial infections.
    
    This breakthrough combines advanced machine learning techniques with traditional pharmaceutical research methods, potentially reducing the time and cost of bringing new drugs to market.
    
    Initial testing has shown promising results, with several compounds showing high efficacy in preliminary trials.`,
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69",
    date: "2024-03-05",
    author: {
      name: "Dr. Emily Rodriguez",
      role: "Senior AI Researcher",
      institution: "AI & Drug Discovery Lab"
    }
  }
]; 