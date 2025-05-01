/**
 * Publications Component
 * 
 * This component displays a list of research publications with:
 * - Publication details including title, authors, date, and journal
 * - Impact factors and citation counts
 * - Links to full papers
 * - Responsive grid layout
 */

import { Link } from 'react-router-dom';
import { FaBook, FaCalendar, FaUser, FaArrowRight, FaGraduationCap, FaUniversity } from 'react-icons/fa';
import './Publications.css';

interface Publication {
  id: string;
  title: string;
  authors: string[];
  date: string;
  journal: string;
  abstract: string;
  category: string;
  doi: string;
  image: string;
  impactFactor?: string;
  citations?: number;
}

const publications: Publication[] = [
  {
    id: '1',
    title: 'Advanced Machine Learning Techniques in Computer Vision: A Comprehensive Review',
    authors: ['Dr. Sarah Johnson', 'Dr. Michael Chen', 'Dr. Emily Williams'],
    date: '2024-03-15',
    journal: 'International Journal of Computer Vision',
    abstract: 'This paper presents novel approaches to computer vision problems using state-of-the-art machine learning techniques. We introduce a new framework for object detection and recognition that significantly improves accuracy while reducing computational complexity...',
    category: 'Computer Vision',
    doi: '10.1234/ijcv.2024.001',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80',
    impactFactor: '4.8',
    citations: 12
  },
  {
    id: '2',
    title: 'Natural Language Processing: Recent Advances and Applications in Healthcare',
    authors: ['Dr. Robert Smith', 'Dr. Lisa Anderson', 'Dr. James Wilson'],
    date: '2024-02-28',
    journal: 'Journal of Artificial Intelligence Research',
    abstract: 'A comprehensive review of recent developments in natural language processing and their practical applications in healthcare. We present a new methodology for medical text analysis that achieves state-of-the-art results...',
    category: 'NLP',
    doi: '10.5678/jair.2024.002',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80',
    impactFactor: '5.2',
    citations: 8
  },
  {
    id: '3',
    title: 'Deep Learning in Healthcare: A Systematic Review and Future Directions',
    authors: ['Dr. David Wilson', 'Dr. Jennifer Brown', 'Dr. Thomas Lee'],
    date: '2024-01-20',
    journal: 'Healthcare Informatics Research',
    abstract: 'This systematic review examines the impact of deep learning technologies in healthcare applications. We analyze current trends, challenges, and propose innovative solutions for medical image analysis...',
    category: 'Healthcare AI',
    doi: '10.9012/hir.2024.003',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80',
    impactFactor: '3.9',
    citations: 15
  }
];

const Publications = () => {
  return (
    <div className="publications-container">
      {/* Hero Section */}
      <section className="publications-hero">
        <div className="publications-hero-content">
          <h1>Research Publications</h1>
          <p>Discover our latest scientific contributions and research breakthroughs in artificial intelligence and machine learning</p>
        </div>
      </section>

      {/* Publications Grid */}
      <section className="publications-content">
        <div className="publications-grid">
          {publications.map((publication) => (
            <article key={publication.id} className="publication-card">
              <div className="publication-image">
                <img src={publication.image} alt={publication.title} />
                <div className="publication-category">{publication.category}</div>
              </div>
              <div className="publication-details">
                <h2>{publication.title}</h2>
                <div className="publication-meta">
                  <div className="meta-item">
                    <FaUser className="meta-icon" />
                    <span>{publication.authors.join(', ')}</span>
                  </div>
                  <div className="meta-item">
                    <FaCalendar className="meta-icon" />
                    <span>{new Date(publication.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="meta-item">
                    <FaBook className="meta-icon" />
                    <span>{publication.journal}</span>
                  </div>
                  {publication.impactFactor && (
                    <div className="meta-item">
                      <FaGraduationCap className="meta-icon" />
                      <span>Impact Factor: {publication.impactFactor}</span>
                    </div>
                  )}
                  {publication.citations && (
                    <div className="meta-item">
                      <FaUniversity className="meta-icon" />
                      <span>{publication.citations} Citations</span>
                    </div>
                  )}
                </div>
                <p className="publication-abstract">{publication.abstract}</p>
                <div className="publication-footer">
                  <span className="doi">DOI: {publication.doi}</span>
                  <Link to={`/publications/${publication.id}`} className="read-more">
                    Read Full Paper
                    <FaArrowRight className="arrow-icon" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Publications; 