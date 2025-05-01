import { Link } from 'react-router-dom';
import './TeamArticles.css';
const teamArticles = [
  {
    id: "building-team-culture", // Changed to match ArticleDetails.tsx
    title: "Building Team Culture",
    date: "March 15, 2024",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=500",
    excerpt: "Discover how our team maintains a strong and positive culture while working on challenging projects."
  },
  {
    id: "innovation-workshop",
    title: "Innovation Workshop",
    date: "March 10, 2024",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=500",
    excerpt: "Our team recently participated in an innovation workshop to enhance creative problem-solving skills."
  },
  {
    id: "team-building-event",
    title: "Team Building Event",
    date: "March 5, 2024",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=500",
    excerpt: "Take a look at our recent team-building event where we strengthened our bonds through various activities."
  }
];

export const TeamArticles: React.FC = () => {
  return (
    <section className="team-articles">
      <h2>Team News & Updates</h2>
      <div className="articles-container">
        {teamArticles.map((article) => (
          <article key={article.id} className="team-article">
            <div className="article-image">
              <img src={article.image} alt={article.title} />
            </div>
            <div className="article-details">
              <span className="article-date">{article.date}</span>
              <h3>{article.title}</h3>
              <p>{article.excerpt}</p>

              {/* Updated to use the correct route path */}
              <Link to={`/publications/${article.id}`} className="read-more">Read More →</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
