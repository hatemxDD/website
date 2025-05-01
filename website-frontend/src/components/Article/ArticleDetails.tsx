import React from 'react';
import { useParams } from 'react-router-dom';
import { FaDownload, FaExternalLinkAlt } from 'react-icons/fa';
import './ArticleDetails.css';

interface Article {
  id: string | number;
  title: string;
  author: string;
  date: string;
  content: string;
  pdfLink?: string;
  journalLink?: string;
}

const articles: { [key: string | number]: Article } = {
  '1': {
    id: '1',
    title: 'Advanced Energy Storage Solutions for Renewable Integration',
    author: 'Dr. Sarah Johnson',
    date: '2023-12-15',
    content: `This research paper explores innovative approaches to energy storage technologies, focusing on their integration with renewable energy sources. The study examines various storage solutions including battery technologies, pumped hydro storage, and thermal energy storage systems.

    Key findings include:
    • Novel battery chemistries with improved energy density
    • Advanced control systems for grid integration
    • Economic analysis of different storage solutions
    • Environmental impact assessment
    
    The research demonstrates significant potential for reducing renewable energy intermittency through optimized storage solutions.`,
    pdfLink: '/papers/energy-storage-2023.pdf',
    journalLink: 'https://journal.example.com/energy-storage'
  },
  '2': {
    id: '2',
    title: 'Sustainable Building Materials for Energy Efficiency',
    author: 'Prof. Michael Chen',
    date: '2023-11-20',
    content: `This comprehensive study examines the development and application of sustainable building materials in modern construction. The research focuses on materials that contribute to energy efficiency while maintaining structural integrity and cost-effectiveness.

    Research highlights:
    • Development of new composite materials
    • Thermal performance analysis
    • Life cycle assessment
    • Cost-benefit analysis
    
    The findings suggest significant potential for reducing building energy consumption through innovative material solutions.`,
    pdfLink: '/papers/sustainable-materials-2023.pdf',
    journalLink: 'https://journal.example.com/sustainable-materials'
  },
  '3': {
    id: '3',
    title: 'Smart Grid Technologies for Future Energy Systems',
    author: 'Dr. Emily Rodriguez',
    date: '2023-10-05',
    content: `This paper presents a detailed analysis of smart grid technologies and their implementation in modern energy systems. The research covers various aspects of grid modernization, including communication protocols, automation systems, and consumer interaction platforms.

    Key research areas:
    • Advanced metering infrastructure
    • Distribution automation
    • Demand response programs
    • Cybersecurity measures
    
    The study provides valuable insights into the future of energy distribution and management.`,
    pdfLink: '/papers/smart-grid-2023.pdf',
    journalLink: 'https://journal.example.com/smart-grid'
  }
};

const ArticleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const article = id ? articles[id] : null;

  if (!article) {
    return (
      <div className="article-not-found">
        <h2>Article Not Found</h2>
        <p>The requested article could not be found.</p>
      </div>
    );
  }

  return (
    <div className="article-details">
      <div className="article-header">
        <h1>{article.title}</h1>
        <div className="article-meta">
          <span className="author">By {article.author}</span>
          <span className="date">{new Date(article.date).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="article-content">
        {article.content.split('\n\n').map((paragraph, index) => (
          <p key={index}>{paragraph.trim()}</p>
        ))}
      </div>

      <div className="article-actions">
        {article.pdfLink && (
          <a href={article.pdfLink} className="action-button" download>
            <FaDownload /> Download PDF
          </a>
        )}
        {article.journalLink && (
          <a href={article.journalLink} className="action-button" target="_blank" rel="noopener noreferrer">
            <FaExternalLinkAlt /> View in Journal
          </a>
        )}
      </div>
    </div>
  );
};

export default ArticleDetails;
