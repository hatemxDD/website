import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './ArticleSection.css';

interface Article {
  title: string;
  image: string;
}

const articles: Article[] = [
  { 
    title: "Project Alpha",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=500"
  },
  { 
    title: "Project Beta",
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=500"
  },
  { 
    title: "Project Gamma",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=500"
  }
];

export const ArticleSection: React.FC = () => {
  return (
    <section className="articles-section">
      <div className="container">
        <h2 className="section-title">Completed Projects</h2>
        <p className="section-description">
          Explore our latest projects showcasing innovation and excellence in software development
        </p>
        
        <div className="articles-grid">
          {articles.map((article, index) => {
            const projectId = article.title.split(' ')[1].toLowerCase();
            return (
              <article key={index} className="article-card">
                <div className="image-container">
                  <img src={article.image} alt={article.title} />
                  <div className="image-overlay" />
                </div>
                
                <div className="article-content">
                  <h3 className="article-title">{article.title}</h3>
                  <p className="article-description">
                    Innovative solutions driving business success through cutting-edge technology
                  </p>
                  <Link to={`/projects/${projectId}`} className="see-more-link">
                    See more info
                    <ArrowRight />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <span className="featured-badge">Featured Projects</span>
        </div>
      </div>
    </section>
  );
};