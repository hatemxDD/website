import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './PublicationDetail.css';

interface Publication {
  id: string;
  title: string;
  authors: string;
  journal: string;
  citations: number;
  abstract: string;
  pdfUrl: string;
  keywords: string[];
  publishedDate: string;
  methodology: string;
  results: string;
  conclusion: string;
}

const PublicationDetail: React.FC = () => {
  const { id } = useParams();
  const [publication, setPublication] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This is sample data - replace with your actual API call
    const fetchPublication = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Sample data
        const samplePublication = {
          id: id,
          title: "Advanced Thermal Comfort Systems in Sustainable Buildings",
          authors: "John Doe, Jane Smith, Robert Johnson",
          journal: "Journal of Sustainable Energy",
          citations: 25,
          abstract: "This study investigates innovative approaches to thermal comfort in sustainable building design, focusing on energy-efficient solutions that maintain optimal indoor conditions while minimizing environmental impact.",
          pdfUrl: "#",
          keywords: ["Thermal Comfort", "Sustainable Buildings", "Energy Efficiency", "Indoor Climate"],
          publishedDate: "2023-06-15",
          methodology: "The research employed a mixed-methods approach, combining quantitative data from sensor networks with qualitative assessments of occupant comfort. Multiple case studies were conducted across different climate zones to ensure comprehensive results.",
          results: "Results indicate that adaptive comfort systems can reduce energy consumption by up to 30% while maintaining or improving occupant satisfaction. The integration of smart sensors and predictive algorithms showed particular promise in optimizing thermal conditions.",
          conclusion: "This study demonstrates the viability of advanced thermal comfort systems in achieving both sustainability goals and occupant comfort. The findings suggest that implementing these systems could significantly contribute to reducing building energy consumption while enhancing indoor environmental quality."
        };
        
        setPublication(samplePublication);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching publication:', error);
        setLoading(false);
      }
    };

    fetchPublication();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading publication details...</p>
      </div>
    );
  }

  if (!publication) {
    return (
      <div className="error-container">
        <p>Publication not found</p>
      </div>
    );
  }

  return (
    <div className="publication-detail-container">
      <article className="publication-content">
        <header className="publication-header">
          <h1>{publication.title}</h1>
          <div className="publication-meta">
            <p className="authors">{publication.authors}</p>
            <p className="journal">{publication.journal}</p>
            <p className="published-date">Published: {new Date(publication.publishedDate).toLocaleDateString()}</p>
            <p className="citations">Citations: {publication.citations}</p>
          </div>
          <div className="keywords">
            {publication.keywords.map((keyword, index) => (
              <span key={index} className="keyword-tag">{keyword}</span>
            ))}
          </div>
        </header>

        <section className="publication-section">
          <h2>Abstract</h2>
          <p>{publication.abstract}</p>
        </section>

        <section className="publication-section">
          <h2>Methodology</h2>
          <p>{publication.methodology}</p>
        </section>

        <section className="publication-section">
          <h2>Results</h2>
          <p>{publication.results}</p>
        </section>

        <section className="publication-section">
          <h2>Conclusion</h2>
          <p>{publication.conclusion}</p>
        </section>

        <div className="publication-actions">
          <a href={publication.pdfUrl} target="_blank" rel="noopener noreferrer" className="action-button pdf-button">
            Download PDF
          </a>
        </div>
      </article>
    </div>
  );
};

export default PublicationDetail; 