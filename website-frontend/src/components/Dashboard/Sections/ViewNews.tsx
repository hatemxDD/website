import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Edit, 
  Trash2, 
  AlertCircle,
  Loader2,
  Share2
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  publishDate: string;
  published: boolean;
  imageUrl?: string;
}

const ViewNews: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data for the specific article
        const mockArticle: Article = {
          id: id || '1',
          title: 'New Research Breakthrough in Molecular Biology',
          content: `
          <p>Our lab team has achieved a significant breakthrough in molecular biology research, specifically in the area of gene editing technologies.</p>
          
          <p>The research team, led by Dr. Sarah Johnson, has developed a novel approach to CRISPR-Cas9 gene editing that significantly increases precision and reduces off-target effects. This advancement has important implications for both basic science research and potential therapeutic applications.</p>
          
          <h3>Key Findings</h3>
          <ul>
            <li>Improved targeting specificity by 87% compared to conventional methods</li>
            <li>Reduced off-target effects to less than 0.1%</li>
            <li>Successfully demonstrated in both in vitro and in vivo models</li>
            <li>Potential applications in treating genetic disorders</li>
          </ul>
          
          <p>"This represents a major step forward in our ability to edit genes with both precision and safety," said Dr. Johnson. "The reduced off-target effects are particularly important for potential clinical applications."</p>
          
          <p>The team's findings have been published in the prestigious journal Nature Biotechnology and have already garnered significant attention from the scientific community.</p>
          
          <h3>Future Directions</h3>
          <p>The research team is now focused on further optimizing the technology and exploring its applications in treating specific genetic disorders. Collaborations with clinical partners are being established to move the technology closer to therapeutic use.</p>
          
          <p>Funding for this research was provided by the National Institutes of Health and the University Research Foundation.</p>
          `,
          author: 'Dr. Sarah Johnson',
          publishDate: '2023-05-15',
          published: true,
          imageUrl: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
        };
        
        setArticle(mockArticle);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to load article. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchArticle();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    if (article) {
      navigate(`/dashboard/news/edit/${article.id}`);
    }
  };

  const handleDelete = async () => {
    if (!article) return;
    
    try {
      setIsDeleting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back after successful deletion
      navigate('/dashboard/news');
    } catch (err) {
      console.error('Error deleting article:', err);
      setError('Failed to delete article. Please try again.');
      setIsDeleting(false);
    }
  };

  const handleShare = () => {
    // Implement share functionality
    // This could copy a link to clipboard, open a share dialog, etc.
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl)
      .then(() => {
        alert('Link copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy link:', err);
      });
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <span className="ml-2 text-gray-600">Loading article...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
        <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
        Article not found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Article header */}
      <div className="relative">
        {article.imageUrl ? (
          <div className="h-56 md:h-64 lg:h-72 w-full overflow-hidden">
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-32 bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
        
        <div className="absolute top-4 left-4">
          <button
            onClick={handleBack}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
        </div>
        
        {article.published ? (
          <div className="absolute top-4 right-4 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Published
          </div>
        ) : (
          <div className="absolute top-4 right-4 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
            Draft
          </div>
        )}
      </div>
      
      {/* Article content */}
      <div className="px-4 sm:px-6 py-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
        
        <div className="flex flex-wrap items-center text-sm text-gray-500 mb-6 gap-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1.5" />
            <span>{formatDate(article.publishDate)}</span>
          </div>
          
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1.5" />
            <span>{article.author}</span>
          </div>
        </div>
        
        <div className="flex justify-between mb-8">
          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Edit className="h-4 w-4 mr-1.5" />
              Edit
            </button>
            
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center px-3 py-1.5 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  Delete
                </>
              )}
            </button>
          </div>
          
          <button
            onClick={handleShare}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Share2 className="h-4 w-4 mr-1.5" />
            Share
          </button>
        </div>
        
        <div className="prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>
    </div>
  );
};

export default ViewNews; 